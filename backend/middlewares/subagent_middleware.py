"""Subagent middleware for LangGraph workflows."""

import asyncio
import logging
from collections.abc import Awaitable, Callable, Sequence
from typing import Any, cast

from langchain.agents.middleware.types import (
    AgentMiddleware,
    ModelRequest,
    ModelResponse,
)
from langchain.tools import BaseTool, ToolRuntime
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.runnables import Runnable, RunnableConfig
from langchain_core.tools import StructuredTool
from langgraph.types import Command

from models.agent import EXCLUDED_STATE_KEYS, CompiledSubAgent, SubAgent

logger = logging.getLogger(__name__)

__all__ = ["SubAgent", "CompiledSubAgent", "SubAgentMiddleware"]

# ── Local prompt constants ────────────────────────────────────────────────────

DEFAULT_GENERAL_PURPOSE_DESCRIPTION = (
    "A general-purpose agent that can handle a wide variety of tasks "
    "using the available tools."
)

DEFAULT_SUBAGENT_PROMPT = (
    "You are a helpful AI assistant. Complete the task given to you using "
    "the available tools. Be thorough and precise."
)

TASK_SYSTEM_PROMPT = (
    "You have access to the `task` tool to delegate work to specialised subagents. "
    "Use it when a task requires capabilities beyond your own tools."
)

TASK_TOOL_DESCRIPTION = """Delegate a task to a specialised subagent.

Available subagents:
{available_agents}

Args:
    description: Detailed description of what you want the subagent to accomplish.
    subagent_type: The subagent type to use (from the list above).
"""

# ── Global lock — prevents parallel subagent invocations ─────────────────────

_SUBAGENT_INVOCATION_LOCK = asyncio.Lock()


# ── Internal helpers ──────────────────────────────────────────────────────────

def _get_subagents(
    *,
    default_model: str | BaseChatModel,
    default_tools: Sequence[BaseTool | Callable | dict[str, Any]],
    default_middleware: list[AgentMiddleware] | None,
    subagents: list[SubAgent | CompiledSubAgent],
    general_purpose_agent: bool,
) -> tuple[dict[str, Any], list[str]]:
    """Compile subagent graphs and collect their descriptions."""
    from graph import create_react_agent as create_agent

    base_middleware = default_middleware or []
    agents: dict[str, Any] = {}
    descriptions: list[str] = []

    if general_purpose_agent:
        agents["general-purpose"] = create_agent(
            default_model,
            system_prompt=DEFAULT_SUBAGENT_PROMPT,
            tools=default_tools,
            middleware=base_middleware,
        )
        descriptions.append(f"- general-purpose: {DEFAULT_GENERAL_PURPOSE_DESCRIPTION}")

    for agent_ in subagents:
        descriptions.append(f"- {agent_['name']}: {agent_['description']}")

        if "runnable" in agent_:
            compiled = cast("CompiledSubAgent", agent_)
            agents[compiled["name"]] = compiled["runnable"]
            continue

        if "tools_factory" in agent_:
            agents[agent_["name"]] = None  # built dynamically at invocation time
            continue

        _middleware = (
            [*base_middleware, *agent_["middleware"]]
            if "middleware" in agent_
            else [*base_middleware]
        )

        agents[agent_["name"]] = create_agent(
            agent_.get("model", default_model),
            system_prompt=agent_["system_prompt"],
            tools=agent_.get("tools", list(default_tools)),
            middleware=_middleware,
            use_sequential_tools=agent_.get("use_sequential_tools", False),
            state_schema=agent_.get("state_schema", None),
        )

    return agents, descriptions


def _create_task_tool(
    *,
    default_model: str | BaseChatModel,
    default_tools: Sequence[BaseTool | Callable | dict[str, Any]],
    default_middleware: list[AgentMiddleware] | None,
    subagents: list[SubAgent | CompiledSubAgent],
    general_purpose_agent: bool,
    task_description: str | None = None,
) -> BaseTool:
    """Create the `task` tool that lets the main agent invoke subagents."""
    subagent_graphs, subagent_descriptions = _get_subagents(
        default_model=default_model,
        default_tools=default_tools,
        default_middleware=default_middleware,
        subagents=subagents,
        general_purpose_agent=general_purpose_agent,
    )
    description_str = "\n".join(subagent_descriptions)

    # ── Subagent config lookup ────────────────────────────────────────────────
    _subagent_configs: dict[str, dict] = {sa["name"]: sa for sa in subagents}

    def _prepare_state(
        subagent_type: str, description: str, runtime: ToolRuntime
    ) -> tuple[Runnable, dict]:
        subagent = subagent_graphs[subagent_type]
        sa_config = _subagent_configs.get(subagent_type, {})

        # Build subagent state from parent (minus excluded keys)
        subagent_state = {
            k: v for k, v in runtime.state.items() if k not in EXCLUDED_STATE_KEYS
        }
        subagent_state["messages"] = [HumanMessage(content=description)]

        for key in sa_config.get("state_forwarding_keys", []):
            value = runtime.state.get(key)
            if value is not None:
                subagent_state[key] = value

        # Build dynamically if tools_factory was used
        if subagent is None and "tools_factory" in sa_config:
            from graph import create_react_agent as create_agent  # noqa: PLC0415

            _base = default_middleware or []
            _mw = (
                [*_base, *sa_config["middleware"]]
                if "middleware" in sa_config
                else [*_base]
            )
            subagent = create_agent(
                sa_config.get("model", default_model),
                system_prompt=sa_config["system_prompt"],
                tools=sa_config["tools_factory"](runtime.state),
                middleware=_mw,
                use_sequential_tools=sa_config.get("use_sequential_tools", False),
                state_schema=sa_config.get("state_schema", None),
            )

        return subagent, subagent_state

    def _build_command(result: dict, tool_call_id: str) -> Command:
        state_update = {k: v for k, v in result.items() if k not in EXCLUDED_STATE_KEYS}
        message_text = (
            result["messages"][-1].text.rstrip()
            if result["messages"][-1].text
            else ""
        )
        return Command(
            update={
                **state_update,
                "messages": [ToolMessage(message_text, tool_call_id=tool_call_id)],
            }
        )

    def _config_with_no_stream(config: RunnableConfig) -> RunnableConfig:
        cfg = dict(config) if config else {}
        tags = list(cfg.get("tags", []))
        if "no_stream" not in tags:
            tags.append("no_stream")
        cfg["tags"] = tags
        return cfg

    # ── Resolve tool description ──────────────────────────────────────────────
    if task_description is None:
        task_description = TASK_TOOL_DESCRIPTION.format(available_agents=description_str)
    elif "{available_agents}" in task_description:
        task_description = task_description.format(available_agents=description_str)

    # ── Sync task function ────────────────────────────────────────────────────
    def task(
        description: str,
        subagent_type: str,
        runtime: ToolRuntime,
        config: RunnableConfig,
    ) -> str | Command:
        if subagent_type not in subagent_graphs:
            allowed = ", ".join(f"`{k}`" for k in subagent_graphs)
            return f"Subagent `{subagent_type}` does not exist. Allowed: {allowed}"

        subagent, state = _prepare_state(subagent_type, description, runtime)
        result = subagent.invoke(state, _config_with_no_stream(config))

        if not runtime.tool_call_id:
            raise ValueError("Tool call ID is required for subagent invocation")
        return _build_command(result, runtime.tool_call_id)

    # ── Async task function ───────────────────────────────────────────────────
    async def atask(
        description: str,
        subagent_type: str,
        runtime: ToolRuntime,
        config: RunnableConfig,
    ) -> str | Command:
        if subagent_type not in subagent_graphs:
            allowed = ", ".join(f"`{k}`" for k in subagent_graphs)
            return f"Subagent `{subagent_type}` does not exist. Allowed: {allowed}"

        async with _SUBAGENT_INVOCATION_LOCK:
            subagent, state = _prepare_state(subagent_type, description, runtime)

            cfg = _config_with_no_stream(config)
            cfg["recursion_limit"] = 1000

            logger.info(
                "[Subagent] Invoking %s: %s…", subagent_type, description[:100]
            )
            result = await subagent.ainvoke(state, cfg)

            if not runtime.tool_call_id:
                raise ValueError("Tool call ID is required for subagent invocation")
            return _build_command(result, runtime.tool_call_id)

    return StructuredTool.from_function(
        name="task",
        func=task,
        coroutine=atask,
        description=task_description,
    )


# ── Public middleware class ───────────────────────────────────────────────────

class SubAgentMiddleware(AgentMiddleware):
    """Middleware that exposes a `task` tool for delegating work to subagents."""

    def __init__(
        self,
        *,
        default_model: str | BaseChatModel,
        default_tools: Sequence[BaseTool | Callable | dict[str, Any]] | None = None,
        default_middleware: list[AgentMiddleware] | None = None,
        subagents: list[SubAgent | CompiledSubAgent] | None = None,
        system_prompt: str | None = TASK_SYSTEM_PROMPT,
        general_purpose_agent: bool = True,
        task_description: str | None = None,
    ) -> None:
        super().__init__()
        self.system_prompt = system_prompt

        self.tools = [
            _create_task_tool(
                default_model=default_model,
                default_tools=default_tools or [],
                default_middleware=default_middleware,
                subagents=subagents or [],
                general_purpose_agent=general_purpose_agent,
                task_description=task_description,
            )
        ]

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        if self.system_prompt is not None:
            msg = SystemMessage(content=self.system_prompt)
            return handler(request.override(messages=[msg, *request.messages]))
        return handler(request)

    async def awrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], Awaitable[ModelResponse]],
    ) -> ModelResponse:
        if self.system_prompt is not None:
            msg = SystemMessage(content=self.system_prompt)
            return await handler(request.override(messages=[msg, *request.messages]))
        return await handler(request)
