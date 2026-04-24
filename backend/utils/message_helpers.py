"""Message extraction helpers for edge routing."""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

if TYPE_CHECKING:
    from langchain_core.messages import AIMessage, AnyMessage, ToolMessage


def fetch_last_ai_and_tool_messages(
    messages: list[AnyMessage],
) -> tuple[AIMessage, list[ToolMessage]]:
    """Extract the last AI message and subsequent tool messages from the message list.

    Args:
        messages: List of messages to search

    Returns:
        Tuple of (last_ai_message, subsequent_tool_messages)
    """
    from langchain_core.messages import AIMessage, ToolMessage

    last_ai_index: int
    last_ai_message: AIMessage

    for i in range(len(messages) - 1, -1, -1):
        if isinstance(messages[i], AIMessage):
            last_ai_index = i
            last_ai_message = cast("AIMessage", messages[i])
            break

    tool_messages = [m for m in messages[last_ai_index + 1 :] if isinstance(m, ToolMessage)]
    return last_ai_message, tool_messages


__all__ = [
    "fetch_last_ai_and_tool_messages",
]
