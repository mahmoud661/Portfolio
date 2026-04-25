from __future__ import annotations

from typing import TYPE_CHECKING, Annotated, Any, Literal, cast

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

from langchain.agents.middleware.types import (
    AgentMiddleware,
    AgentState,
    ModelCallResult,
    ModelRequest,
    ModelResponse,
    OmitFromInput,
)
from langchain.tools import InjectedToolCallId
from langchain_core.messages import SystemMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.runtime import Runtime
from langgraph.types import Command
from typing_extensions import NotRequired, TypedDict


class TourStep(TypedDict):
    title: str
    description: str
    status: Literal["pending", "in_progress", "completed"]


class TourState(AgentState):
    tour_steps: Annotated[NotRequired[list[TourStep]], OmitFromInput]


MANAGE_TOUR_TOOL_DESCRIPTION = """Use this tool to create and manage a structured step list for interactive portfolio tours.

## When to Use
- When the user asks for a tour, walkthrough, or guided demo of the portfolio
- To track progress through a multi-step tour sequence
- To update step status as you move through the tour

## How to Use
1. Call this tool at the start of a tour to define all steps with status "pending"
2. Mark the CURRENT step as "in_progress" BEFORE executing it (navigating, explaining, etc.)
3. Mark a step "completed" IMMEDIATELY after you have shown/explained it
4. Always call this tool again when moving to the next step

## Step States
- pending: Step has not been started yet
- in_progress: Currently executing this step right now
- completed: Step has been fully shown and explained to the user

## Rules
- Always have exactly one step "in_progress" while the tour is running
- Never batch completions — update the list after EACH step
- If the user asks questions mid-tour, answer them, then resume the tour
- When all steps are "completed", the tour ends — do NOT call this tool further"""

TOUR_SYSTEM_PROMPT = """## `manage_tour` — Interactive Tour Tracker

You have access to the `manage_tour` tool to lead structured, step-by-step portfolio tours.

When a user asks for a tour or walkthrough:
1. Call `manage_tour` to plan all steps, marking the first step as "in_progress"
2. Navigate to each section using `trigger_ui_action` in the correct order
3. Briefly explain what the user sees at each step
4. After explaining a step, call `manage_tour` again to mark it "completed" and the next step "in_progress"
5. Continue until all steps are "completed"

## Key Rules
- ALWAYS mark a step "in_progress" BEFORE navigating to it
- ALWAYS mark it "completed" IMMEDIATELY after explaining it
- Keep responses concise — tour steps should feel natural, not scripted
- If the user interrupts with a question, answer it, then say you are continuing the tour"""

TOUR_REMINDER = (
    "[System Reminder] The portfolio tour is still in progress and has unfinished steps. "
    "Please continue the tour by proceeding to the next pending step. "
    "If you are waiting for the user to respond or ask something, that is fine — "
    "just make sure to pick up the tour again once they reply."
)


@tool(description=MANAGE_TOUR_TOOL_DESCRIPTION)
def manage_tour(
    tour_steps: list[TourStep],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command:
    """Write the tour step list into shared agent state."""
    return Command(
        update={
            "tour_steps": tour_steps,
            "messages": [
                ToolMessage(
                    f"Updated tour steps to {tour_steps}",
                    tool_call_id=tool_call_id,
                )
            ],
        }
    )


def _is_active_tour(tour_steps: list[TourStep]) -> bool:
    return any(step["status"] in ("pending", "in_progress") for step in tour_steps)


def _format_tour_steps(tour_steps: list[TourStep]) -> str:
    STATUS_LABELS: dict[str, str] = {
        "pending": "[PENDING]",
        "in_progress": "[IN PROGRESS]",
        "completed": "[COMPLETED]",
    }
    lines = ["\n\n## Current Tour Progress"]
    for i, step in enumerate(tour_steps, 1):
        label = STATUS_LABELS.get(step["status"], f"[{step['status'].upper()}]")
        lines.append(f"{i}. {label} **{step['title']}**: {step['description']}")
    return "\n".join(lines)


class TourMiddleware(AgentMiddleware):
    state_schema = TourState

    def __init__(
        self,
        *,
        system_prompt: str = TOUR_SYSTEM_PROMPT,
        tool_description: str = MANAGE_TOUR_TOOL_DESCRIPTION,
    ) -> None:
        super().__init__()
        self.system_prompt = system_prompt

        @tool(description=tool_description)
        def manage_tour(
            tour_steps: list[TourStep],
            tool_call_id: Annotated[str, InjectedToolCallId],
        ) -> Command:
            return Command(
                update={
                    "tour_steps": tour_steps,
                    "messages": [
                        ToolMessage(
                            f"Updated tour steps to {tour_steps}",
                            tool_call_id=tool_call_id,
                        )
                    ],
                }
            )

        self.tools = [manage_tour]

    def _build_system_content(self, request: ModelRequest, tour_steps: list[TourStep]) -> list:
        extra_blocks: list[dict[str, str]] = [
            {"type": "text", "text": f"\n\n{self.system_prompt}"},
            {"type": "text", "text": _format_tour_steps(tour_steps)},
        ]
        if request.system_message is not None:
            return [*request.system_message.content_blocks, *extra_blocks]
        return extra_blocks

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelCallResult:
        tour_steps: list[TourStep] = request.state.get("tour_steps") or []
        if not tour_steps or not _is_active_tour(tour_steps):
            return handler(request)
        new_system_message = SystemMessage(
            content=cast(
                "list[str | dict[str, str]]",
                self._build_system_content(request, tour_steps),
            )
        )
        return handler(request.override(system_message=new_system_message))

    async def awrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], Awaitable[ModelResponse]],
    ) -> ModelCallResult:
        tour_steps: list[TourStep] = request.state.get("tour_steps") or []
        if not tour_steps or not _is_active_tour(tour_steps):
            return await handler(request)
        new_system_message = SystemMessage(
            content=cast(
                "list[str | dict[str, str]]",
                self._build_system_content(request, tour_steps),
            )
        )
        return await handler(request.override(system_message=new_system_message))

    def after_agent(  # noqa: ARG002
        self, state: AgentState, runtime: Runtime[Any]
    ) -> dict[str, Any] | None:
        tour_steps: list[TourStep] = state.get("tour_steps") or []
        if not tour_steps:
            return None
        if not _is_active_tour(tour_steps):
            # Tour finished — clear any stale jump_to so the graph exits cleanly
            return {"jump_to": None}
        return {"jump_to": "model", "messages": [SystemMessage(content=TOUR_REMINDER)]}

    after_agent.__can_jump_to__ = ["model"]

    async def aafter_agent(
        self, state: AgentState, runtime: Runtime[Any]
    ) -> dict[str, Any] | None:
        return self.after_agent(state, runtime)

    aafter_agent.__can_jump_to__ = ["model"]
