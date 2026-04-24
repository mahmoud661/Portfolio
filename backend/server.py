import os
import uuid
import uvicorn
import socketio
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables.config import RunnableConfig
from langgraph.checkpoint.memory import MemorySaver
import json
from graph import create_react_agent
from dotenv import load_dotenv

load_dotenv()

from langchain_core.tools import tool

# Initialize FastAPI and SocketIO
app = FastAPI()
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio, app)


@tool
def trigger_ui_action(action_label: str) -> str:
    """
    Trigger a UI action on the frontend website.
    Use this tool whenever you want to change what the user sees on the screen (e.g., navigate to a page).

    Supported action_labels:
    - 'navigate_home': Go to the Home page
    - 'navigate_about': Go to the About page
    - 'navigate_projects': Go to the Projects portfolio
    - 'navigate_certificates': Go to the Certificates view
    - 'navigate_contact': Go to the Contact forms
    """
    # The actual execution happens on the frontend via markdown tags injected by the system prompt,
    # but defining this as a tool helps the LLM structure and reason about available commands.
    return f'Successfully triggered {action_label} action on the frontend via <call_to_action label="{action_label}" />'


@tool
async def inspect_react_dom(config: RunnableConfig) -> str:
    """
    Inspect the current React DOM/page state on the user's screen.
    Use this to understand what the user is currently looking at.
    """
    sid = config.get("configurable", {}).get("sid")
    if not sid:
        return "Error: Could not determine user session."

    try:
        # Use sio.call to request data from the client and await the callback
        response = await sio.call("request_dom_state", timeout=10, to=sid)
        return json.dumps(response)
    except socketio.exceptions.TimeoutError:
        return "Error: Frontend did not respond in time."


@tool
async def execute_react_dom_action(
    config: RunnableConfig, ref_id: int, action: str, arguments: str = ""
) -> str:
    """
    Executes an action (click or fill) on a specific React element by its Reference ID (ref).
    Use `inspect_react_dom` first to get the list of elements and their `ref` IDs.

    Args:
    - ref_id: The integer ID of the element from the snapshot.
    - action: Either 'click' or 'fill'.
    - arguments: The text to fill if action is 'fill'.
    """
    sid = config.get("configurable", {}).get("sid")
    if not sid:
        return "Error: Could not determine user session."

    try:
        payload = {"refId": ref_id, "action": action}
        if action == "fill":
            payload["arguments"] = arguments

        response = await sio.call("execute_dom_action", payload, timeout=10, to=sid)
        return json.dumps(response)
    except socketio.exceptions.TimeoutError:
        return "Error: Frontend did not respond in time."


# Checkpointer for session memory
memory = MemorySaver()

# System prompt outlining the persona and response format
SYSTEM_PROMPT = """You are an interactive AI guide controlling this portfolio website.
Your job is to give the user a tour of the portfolio, explain the projects, and show off the capabilities.
You can use special markdown tags to tell the frontend to perform actions. 
To perform an action, include a `<call_to_action label="ACTION_NAME" />` tag in your response. 
The frontend will parse this tag and perform the corresponding action (e.g., opening a specific section, showing a project, etc.).
Keep your responses conversational, engaging, and relatively concise.
Use the `inspect_react_dom` tool to look at the user's screen whenever you need context about what page they are on or what content they are viewing."""

# Initialize the model
model = ChatOpenAI(
    model=os.getenv("LITELLM_MODEL", "google/gemma-4-26b-a4b-it"),
    api_key=os.getenv("LITELLM_PROXY_API_KEY", "dummy_api_key"),
    base_url=os.getenv("LITELLM_PROXY_API_BASE", None),
)

# Create the LangGraph react agent
agent_graph = create_react_agent(
    model=model,
    tools=[
        trigger_ui_action,
        inspect_react_dom,
        execute_react_dom_action,
    ],  # Tool helps structural reasoning
    system_prompt=SYSTEM_PROMPT,
    checkpointer=memory,
)


@sio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


@sio.on("message")
async def handle_message(sid, data):
    """
    Handle incoming messages from the client.
    Expects data to be a dictionary with 'message' and optionally 'token'.
    """
    user_message = data.get("message")
    token = data.get("token")

    # Generate a new token if not provided
    if not token:
        token = str(uuid.uuid4())
        await sio.emit("token", {"token": token}, to=sid)

    config = {"configurable": {"thread_id": token, "sid": sid}}

    # Stream the response from the agent
    async for event in agent_graph.astream_events(
        {"messages": [HumanMessage(content=user_message)]}, config=config, version="v2"
    ):
        event_type = event["event"]

        # Stream model tokens as they get generated
        if event_type == "on_chat_model_stream":
            chunk = event["data"]["chunk"]
            if chunk.content:
                await sio.emit("chunk", {"content": chunk.content}, to=sid)

    # Notify that the stream is complete
    await sio.emit("message_complete", {}, to=sid)


if __name__ == "__main__":
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
