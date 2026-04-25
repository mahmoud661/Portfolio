from __future__ import annotations

from typing import TYPE_CHECKING, Annotated, Any

if TYPE_CHECKING:
    pass

from langchain.agents.middleware.types import (
    AgentMiddleware,
    AgentState,
    OmitFromInput,
)
from langgraph.config import get_config
from langgraph.runtime import Runtime
from langgraph.types import interrupt
from typing_extensions import NotRequired, TypedDict


class RecursionGuardState(AgentState):
    agent_step_count: Annotated[NotRequired[int], OmitFromInput]


class RecursionGuardMiddleware(AgentMiddleware):
    """Middleware that detects agent loops and triggers a LangGraph interrupt
    before the hard recursion limit is hit.

    Tracks how many model calls have occurred in a single agent invocation.
    When `step_limit` is reached it calls `interrupt()`, which:
      - Pauses the graph and checkpoints state (first call — raises internally).
      - Returns the resume value on replay so the counter resets and the user's
        new message drives the next iteration.
    """

    state_schema = RecursionGuardState

    def __init__(self, *, step_limit: int = 15) -> None:
        super().__init__()
        self.step_limit = step_limit

    def before_model(  # noqa: ARG002
        self, state: AgentState, runtime: Runtime[Any]
    ) -> dict[str, Any] | None:
        count = (state.get("agent_step_count") or 0) + 1

        if count >= self.step_limit:
            try:
                recursion_limit = get_config().get("recursion_limit", 25)
            except Exception:
                recursion_limit = 25

            interrupt({
                "type": "recursion_limit",
                "message": (
                    f"I've been working for {count} steps "
                    f"(configured recursion limit: {recursion_limit}) and may be stuck in a loop. "
                    "Send me a message to help me refocus — for example, tell me which section "
                    "to visit next, or ask me to restart the tour."
                ),
            })
            # Only reached on replay when the user resumes — reset counter.
            return {"agent_step_count": 0}

        return {"agent_step_count": count}

    async def abefore_model(
        self, state: AgentState, runtime: Runtime[Any]
    ) -> dict[str, Any] | None:
        return self.before_model(state, runtime)
