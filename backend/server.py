import os
import uuid
import uvicorn
import socketio
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.runnables.config import RunnableConfig
from langgraph.checkpoint.memory import MemorySaver
import json
from graph import create_react_agent
from middlewares.tour_middleware import TourMiddleware, TourState, manage_tour
from middlewares.recursion_guard_middleware import RecursionGuardMiddleware
from middlewares.subagent_middleware import SubAgentMiddleware
from langgraph.errors import GraphRecursionError
from langgraph.types import Command
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

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
async def get_site_structure(config: RunnableConfig) -> str:
    """
    Get the complete content and structure of this portfolio website from the frontend.
    Returns a detailed description of every page: sections, all project names and
    descriptions, certificates, skills, scroll requirements, and interaction notes.
    Call this before plan_tour to get accurate, up-to-date site content.
    """
    sid = config.get("configurable", {}).get("sid")
    if not sid:
        return "Error: Could not determine user session."
    try:
        result = await sio.call("request_site_structure", timeout=10, to=sid)
        return result if isinstance(result, str) else str(result)
    except socketio.exceptions.TimeoutError:
        return "Error: Frontend did not respond in time."


@tool
async def scroll_page(position: int, config: RunnableConfig) -> str:
    """
    Scroll the user's page to a specific pixel position from the top.
    Use the pixel values from inspect_react_dom or the site structure's
    Live Element Positions section to know where to scroll.

    Args:
        position: pixel distance from the page top to scroll to (e.g. 820 for ~820px down)
    """
    sid = config.get("configurable", {}).get("sid")
    if not sid:
        return "Error: Could not determine user session."
    await sio.emit("scroll_page", {"position": position}, to=sid)
    return f"Scrolled page to {position}px from top."


@tool
async def spotlight_element(
    selector: str,
    label: str,
    config: RunnableConfig,
    talking_points: str = "",
) -> str:
    """
    Highlight a specific element on the user's screen for 5 seconds with a dark
    overlay spotlight. A caption with your talking points appears at the bottom
    of the screen while the spotlight is held. Blocks until the 5 seconds elapse.

    Use the selectors from the "Spotlight Selectors" section of get_site_structure.

    Two selector formats:
    1. Standard CSS:  "section.space-y-24"  or  "div.flex.flex-col.mb-60"
    2. Text search:   "text:h3:Schema Forge"  →  first <h3> containing that text,
                      automatically resolved to the nearest parent card container.

    Args:
        selector:       CSS selector or "text:TAG:content" string
        label:          short badge label shown at the spotlight edge
        talking_points: narration shown as a caption overlay during the spotlight
                        (what you want to say about this element to the user)
    """
    sid = config.get("configurable", {}).get("sid")
    if not sid:
        return "Error: Could not determine user session."
    try:
        await sio.call(
            "spotlight",
            {"selector": selector, "label": label, "caption": talking_points},
            timeout=8,
            to=sid,
        )
    except socketio.exceptions.TimeoutError:
        pass
    return f"Spotlight held on '{label}' for 5 seconds. The user has seen the element."


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

# ── Tour planner subagent ──────────────────────────────────────────────────────

TOUR_PLANNER_SYSTEM_PROMPT = """You are a tour planner for a developer portfolio website.

When you receive a tour planning request, follow these steps exactly:

1. Call get_site_structure to fetch complete live site content and DOM positions.
   The result has two sections:
   - Static content: every page's sections, all project names/descriptions, certificates,
     skills (24 tags), career timeline, and contact details.
   - Live Element Positions: which headings are in the viewport vs how many pixels
     from page top (use these numbers for the scroll field below).

2. Based on the site data and the request, decide the tour steps.

3. Call manage_tour with ALL steps set to status "pending" to write the plan into
   shared state. The main agent will read these steps and execute them.
   - title: concise step name, e.g. "Home — Hero", "About — Skills Cloud", "Projects — Schema Forge"
   - description: one sentence on what to show/say at this stop — use REAL names
     (actual project titles, certificate names, skill names from the data)
   - status: "pending" for every step — the main agent manages in_progress/completed

4. Return a short confirmation listing the step titles you planned.

Rules for the plan:
- action hint in description: mention the navigate_* label and any scroll distance
  from Live Positions (e.g. "navigate_about, scroll ~820px to skills cloud")
- 4–8 steps for a full tour; 2–4 for a focused request
- Every step must reference specific real content, not generic placeholders"""

tour_planner_subagent = {
    "name": "tour-planner",
    "description": (
        "Plans a detailed portfolio tour. Reads the live site structure, then calls "
        "manage_tour to write the full step list (all 'pending') directly into shared "
        "state so the main agent can execute them immediately."
    ),
    "system_prompt": TOUR_PLANNER_SYSTEM_PROMPT,
    "tools": [get_site_structure, manage_tour],
    "state_schema": TourState,
}

# ── Main agent prompts ────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an interactive AI guide for this developer portfolio website.

## Starting a Tour
When the user asks for ANY tour, walkthrough, or demo:
1. Call task(description="Plan a tour: <user request>", subagent_type="tour-planner").
   The tour-planner fetches live site data, builds the step list, and writes it directly
   into shared state via manage_tour — you do NOT need to call manage_tour yourself to set up steps.
2. After task() returns, the tour_steps are already in state (all "pending").
   The tour context is now auto-injected into your system prompt by TourMiddleware.
3. Begin executing immediately from the first pending step.

## Executing Each Step
For every pending/in_progress step, follow this exact sequence:
  a. manage_tour → mark this step "in_progress" (keep others as-is)
  b. trigger_ui_action → navigate to the correct page (hint is in the step description)
  c. inspect_react_dom → get a fresh element snapshot with current positions
  d. If the target element requires scrolling, call scroll_page(position) first
     using the pixel value from inspect_react_dom or the step description
  e. spotlight_element → highlight the key element (match focus hint to a ref_id)
  f. Speak to the user — use real content names from the step description
  g. manage_tour → mark this step "completed", next step "in_progress"
  h. Move to the next step immediately

## Spotlight Rules
- Use selectors from the "Spotlight Selectors" section of get_site_structure output
- For specific named items: "text:h3:Schema Forge", "text:h3:DevPath", "text:h3:Machine Learning"
- For sections/containers: "section.space-y-24", "div.flex.flex-col.mb-60", "form"
- No need to call inspect_react_dom before spotlight_element
- Use specific badge labels: "Schema Forge — AI database designer", "Skills cloud"

## General
- Use real names — never "a project", always "Schema Forge" or "DevPath"
- Keep narration conversational, enthusiastic, and concise
- If the user asks a question mid-tour, answer it fully, then resume"""

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
        scroll_page,
        spotlight_element,
    ],
    system_prompt=SYSTEM_PROMPT,
    middleware=[
        SubAgentMiddleware(
            default_model=model,
            subagents=[tour_planner_subagent],
            general_purpose_agent=False,
        ),
        TourMiddleware(),
        RecursionGuardMiddleware(step_limit=40),
    ],
    checkpointer=memory,
)


@sio.on("connect")
async def connect(sid, *_):
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

    config = {
        "configurable": {"thread_id": token, "sid": sid},
        "recursion_limit": 100,
    }

    # If the graph is paused at an interrupt, resume it with Command(resume=...)
    # instead of injecting a new user message — LangGraph requires this to
    # replay to the interrupt point and let interrupt() return the resume value.
    is_interrupted = False
    if token:
        try:
            state = await agent_graph.aget_state(config)
            is_interrupted = bool(state.interrupts)
        except Exception:
            pass

    input_data = (
        Command(resume=user_message)
        if is_interrupted
        else {"messages": [HumanMessage(content=user_message)]}
    )

    try:
        async for event in agent_graph.astream_events(input_data, config=config, version="v2"):
            event_type = event["event"]

            if event_type == "on_chat_model_stream":
                # Skip tokens from subagent internal LLM calls
                if "no_stream" in event.get("tags", []):
                    continue
                chunk = event["data"]["chunk"]
                if chunk.content:
                    await sio.emit("chunk", {"content": chunk.content}, to=sid)

            elif event_type == "on_tool_start":
                tool_name = event.get("name", "")
                tool_input = event["data"].get("input", {})
                await sio.emit("tool_call", {"tool": tool_name, "input": tool_input}, to=sid)
                if tool_name == "manage_tour" and "tour_steps" in tool_input:
                    await sio.emit("tour_update", {"steps": tool_input["tour_steps"]}, to=sid)

            elif event_type == "on_chain_stream":
                chunk = event["data"].get("chunk", {})
                if isinstance(chunk, dict) and "__interrupt__" in chunk:
                    for intr in chunk["__interrupt__"]:
                        val = intr.value if hasattr(intr, "value") else {}
                        msg = (
                            val.get("message", "The agent paused and needs your guidance.")
                            if isinstance(val, dict)
                            else str(val)
                        )
                        await sio.emit("agent_interrupt", {"message": msg}, to=sid)

    except GraphRecursionError:
        await sio.emit("agent_error", {
            "message": (
                "The agent hit its step limit without finishing. "
                "Please try a simpler request or ask me to restart the tour."
            )
        }, to=sid)

    finally:
        await sio.emit("message_complete", {}, to=sid)


if __name__ == "__main__":
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
