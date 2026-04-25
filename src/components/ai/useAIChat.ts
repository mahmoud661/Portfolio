import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { inspectDOM, executeDOMAction } from "../../lib/dom-inspector";
import { getSiteTree, getPagePositions } from "../../lib/site-tree";

export type Message =
  | { role: "user" | "ai" | "system"; content: string }
  | { role: "tool"; content: string; toolName: string }
  | { role: "interrupt"; content: string };

export type TourStep = {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
};

function getToolLabel(
  toolName: string,
  input: Record<string, unknown>,
): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  switch (toolName) {
    case "trigger_ui_action": {
      const raw = (input.action_label as string) ?? "";
      const section = raw.replace(/^(navigate|open)_/, "");
      return `Navigating to ${cap(section)}`;
    }
    case "inspect_react_dom":
      return "Inspecting current page...";
    case "execute_react_dom_action": {
      const action = (input.action as string) ?? "interact";
      return `${cap(action)}ing with page element`;
    }
    case "manage_tour":
      return "Updating tour progress...";
    case "write_todos":
      return "Updating task list...";
    case "get_site_structure":
      return "Reading site structure...";
    case "plan_tour":
      return "Planning tour...";
    case "scroll_page":
      return `Scrolling to ${(input.position as number) ?? 0}px...`;
    case "spotlight_element":
      return `Spotlighting: ${(input.label as string) ?? (input.selector as string) ?? "element"}`;
    default:
      return `Using ${toolName.replace(/_/g, " ")}...`;
  }
}

/**
 * Resolve a spotlight selector to a DOM element.
 *
 * Two formats:
 *  "text:TAG:content"  →  first <TAG> whose innerText contains "content" (case-insensitive)
 *  anything else       →  document.querySelector(selector)
 *
 * The chatbot container is always excluded.
 */
function findElementBySelector(selector: string): HTMLElement | null {
  const chatbot = document.getElementById("ai-chatbot-container");

  if (selector.startsWith("text:")) {
    const withoutPrefix = selector.slice(5);          // e.g. "h3:Schema Forge"
    const colonIdx = withoutPrefix.indexOf(":");
    const tag    = colonIdx > 0 ? withoutPrefix.slice(0, colonIdx) : "*";
    const needle = colonIdx > 0 ? withoutPrefix.slice(colonIdx + 1).toLowerCase() : "";

    for (const el of document.querySelectorAll(tag || "*")) {
      if (chatbot?.contains(el)) continue;
      if (!(el instanceof HTMLElement)) continue;
      if (!el.innerText?.toLowerCase().includes(needle)) continue;

      // When the matched element is a heading inside a card (project, cert, etc.),
      // bubble up to the nearest card container so the spotlight covers the whole card.
      if (/^h[1-6]$/i.test(tag)) {
        const card = el.closest<HTMLElement>(
          '[class*="cursor-pointer"], [class*="rounded-xl"][class*="bg-card"], article',
        );
        return card ?? el;
      }
      return el;
    }
    return null;
  }

  try {
    for (const el of document.querySelectorAll(selector)) {
      if (!chatbot?.contains(el) && el instanceof HTMLElement) return el;
    }
  } catch {
    console.warn(`Spotlight: invalid selector "${selector}"`);
  }
  return null;
}

/** Recreate the AIAvatar look as a plain DOM element (no React needed). */
function createAvatarDOM(ringColor: string): HTMLElement {
  const root = document.createElement("div");
  Object.assign(root.style, {
    position:        "relative",
    display:         "flex",
    width:           "36px",
    height:          "36px",
    flexShrink:      "0",
    alignItems:      "center",
    justifyContent:  "center",
    overflow:        "hidden",
    borderRadius:    "10px",
    background:      `linear-gradient(135deg, ${ringColor}, ${ringColor.replace(")", " / 0.55)").replace("hsl(", "hsl(")})`,
    boxShadow:       "0 2px 10px rgba(0,0,0,0.4)",
  });

  // Radial glow overlay
  const glow = document.createElement("div");
  Object.assign(glow.style, {
    position:   "absolute",
    inset:      "0",
    background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.28), transparent 68%)",
  });

  // Eyes
  const eyeWrap = document.createElement("div");
  Object.assign(eyeWrap.style, {
    position: "relative",
    zIndex:   "10",
    display:  "flex",
    gap:      "4px",
  });
  for (let i = 0; i < 2; i++) {
    const eye = document.createElement("div");
    Object.assign(eye.style, {
      height:       "10px",
      width:        "6px",
      borderRadius: "9999px",
      background:   "rgba(255,255,255,0.9)",
      boxShadow:    "0 0 3px rgba(255,255,255,0.5)",
    });
    eyeWrap.appendChild(eye);
  }

  root.appendChild(glow);
  root.appendChild(eyeWrap);
  return root;
}

/** Stream words into a text container one by one, completing by `byMs`. */
function streamWords(textEl: HTMLElement, text: string, byMs: number): () => void {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return () => {};
  const delay = Math.min(120, byMs / words.length);
  let i = 0;
  const id = setInterval(() => {
    if (i < words.length) {
      textEl.textContent = words.slice(0, ++i).join(" ");
    } else {
      clearInterval(id);
    }
  }, delay);
  return () => clearInterval(id);
}

/**
 * Show a spotlight for exactly 5 seconds, then call onDone.
 * - Lens + box-shadow creates a full-page dark overlay with a cutout over the element.
 * - rAF loop keeps the lens locked to the element through scroll.
 * - Caption (if provided) appears at the bottom with an avatar and streams word-by-word.
 */
function applySpotlight(el: HTMLElement, _label: string, caption: string, onDone: () => void): void {
  const PADDING  = 14;
  const DURATION = 5000;

  el.scrollIntoView({ behavior: "smooth", block: "center" });

  const chatbotPanel = document.getElementById("ai-chatbot-container");
  if (chatbotPanel) {
    chatbotPanel.style.opacity       = "0";
    chatbotPanel.style.pointerEvents = "none";
    chatbotPanel.style.transition    = "opacity 0.3s ease";
  }

  const primary   = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
  const ringColor = `hsl(${primary})`;
  const glowColor = `hsl(${primary} / 0.45)`;

  // ── Lens ──────────────────────────────────────────────────────────────────
  const lens = document.createElement("div");
  Object.assign(lens.style, {
    position:      "fixed",
    zIndex:        "9998",
    borderRadius:  "12px",
    pointerEvents: "none",
    border:        `2px solid ${ringColor}`,
    background:    "transparent",
    boxShadow:     `0 0 0 9999px rgba(0,0,0,0.65), 0 0 32px 6px ${glowColor}`,
    opacity:       "0",
    transition:    "opacity 0.35s ease",
  });


  // ── Caption (avatar + streaming text) ─────────────────────────────────
  let captionWrap: HTMLDivElement | null = null;
  let captionText: HTMLDivElement | null = null;
  let stopStream = () => {};

  if (caption) {
    captionWrap = document.createElement("div");
    Object.assign(captionWrap.style, {
      position:      "fixed",
      bottom:        "32px",
      left:          "50%",
      transform:     "translateX(-50%)",
      zIndex:        "9999",
      maxWidth:      "560px",
      width:         "calc(100% - 48px)",
      background:    "rgba(10,10,10,0.92)",
      borderRadius:  "16px",
      border:        `1px solid ${ringColor}`,
      boxShadow:     `0 6px 28px rgba(0,0,0,0.55), 0 0 0 1px ${glowColor}`,
      display:       "flex",
      alignItems:    "flex-start",
      gap:           "12px",
      padding:       "14px 16px",
      opacity:       "0",
      transition:    "opacity 0.4s ease",
      pointerEvents: "none",
    });

    captionWrap.appendChild(createAvatarDOM(ringColor));

    captionText = document.createElement("div");
    Object.assign(captionText.style, {
      color:      "white",
      fontSize:   "14px",
      lineHeight: "1.65",
      flex:       "1",
      minWidth:   "0",
    });
    captionText.textContent = "";
    captionWrap.appendChild(captionText);
    document.body.appendChild(captionWrap);
  }

  document.body.appendChild(lens);

  // ── rAF tracking loop ─────────────────────────────────────────────────
  let tracking = true;
  function syncPositions() {
    if (!tracking) return;
    const r = el.getBoundingClientRect();
    lens.style.top    = `${r.top    - PADDING}px`;
    lens.style.left   = `${r.left   - PADDING}px`;
    lens.style.width  = `${r.width  + PADDING * 2}px`;
    lens.style.height = `${r.height + PADDING * 2}px`;
    requestAnimationFrame(syncPositions);
  }

  // ── Fade-in sequence ──────────────────────────────────────────────────
  requestAnimationFrame(() => {
    syncPositions();
    requestAnimationFrame(() => {
      lens.style.opacity = "1";
      if (captionWrap && captionText) {
        // Caption appears 400 ms after lens; streaming starts 200 ms after that
        setTimeout(() => {
          captionWrap!.style.opacity = "1";
          setTimeout(() => {
            // Stream words across ~70% of remaining time so there's reading time at the end
            stopStream = streamWords(captionText!, caption, DURATION * 0.65);
          }, 200);
        }, 400);
      }
    });
  });

  // ── Auto-dismiss after DURATION ───────────────────────────────────────
  setTimeout(() => {
    tracking = false;
    stopStream();
    lens.style.opacity = "0";
    if (captionWrap) captionWrap.style.opacity = "0";
    setTimeout(() => {
      lens.parentNode?.removeChild(lens);
      captionWrap?.parentNode?.removeChild(captionWrap);
      if (chatbotPanel) {
        chatbotPanel.style.opacity       = "";
        chatbotPanel.style.pointerEvents = "";
      }
      onDone();
    }, 380);
  }, DURATION);
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  // Always-current ref so the socket effect (empty deps) can call navigate
  // without being affected by React Router re-creating the navigate reference
  // on every route change — which would otherwise disconnect the socket.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const handleAction = useCallback((label: string) => {
    const nav = navigateRef.current;
    switch (label.toLowerCase()) {
      case "navigate_home":
      case "open_home":
        nav("/");
        break;
      case "navigate_about":
      case "open_about":
        nav("/about");
        break;
      case "navigate_projects":
      case "open_projects":
        nav("/projects");
        break;
      case "navigate_certificates":
      case "open_certificates":
        nav("/certificates");
        break;
      case "navigate_contact":
      case "open_contact":
        nav("/contact");
        break;
      default:
        console.warn("AI requested unknown action:", label);
    }
  }, []);

  const handleActionRef = useRef(handleAction);
  handleActionRef.current = handleAction;

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to AI server"));

    socket.on("token", (data: { token: string }) => {
      localStorage.setItem("ai_session_token", data.token);
    });

    socket.on("chunk", (data: { content: string }) => {
      setMessages((prev) => {
        const msgs = [...prev];
        const last = msgs[msgs.length - 1];
        if (last && last.role === "ai") {
          const cleaned = (last.content + data.content).replace(
            /<call_to_action\s+label="[^"]+"\s*\/>/g,
            "",
          );
          msgs[msgs.length - 1] = { ...last, content: cleaned };
        } else {
          msgs.push({ role: "ai", content: data.content });
        }
        return msgs;
      });
    });

    socket.on(
      "tool_call",
      (data: { tool: string; input: Record<string, unknown> }) => {
        if (
          data.tool === "trigger_ui_action" &&
          typeof data.input.action_label === "string"
        ) {
          handleActionRef.current(data.input.action_label);
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "tool",
            content: getToolLabel(data.tool, data.input),
            toolName: data.tool,
          },
        ]);
      },
    );

    socket.on("tour_update", (data: { steps: TourStep[] }) => {
      setTourSteps(data.steps);
    });

    // Provide full site tree + live DOM positions to the backend on request
    socket.on("request_site_structure", (callback?: (data: string) => void) => {
      if (typeof callback === "function") {
        const tree = getSiteTree();
        const positions = getPagePositions();
        callback(`${tree}\n\n---\n\n${positions}`);
      }
    });

    // Scroll the page to a pixel position from the top
    socket.on("scroll_page", (data: { position: number }) => {
      window.scrollTo({ top: data.position, behavior: "smooth" });
    });

    // Highlight a specific DOM element — holds for 5 s then ACKs the backend
    socket.on(
      "spotlight",
      (
        data: { selector: string; label: string; caption?: string },
        callback?: () => void,
      ) => {
        const el = findElementBySelector(data.selector);
        if (!el) {
          console.warn(`Spotlight: no element found for "${data.selector}"`);
          if (typeof callback === "function") callback();
          return;
        }
        applySpotlight(el, data.label, data.caption ?? "", () => {
          if (typeof callback === "function") callback();
        });
      },
    );

    socket.on("message_complete", () => setIsTyping(false));

    socket.on("agent_interrupt", (data: { message: string }) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "interrupt", content: data.message },
      ]);
    });

    socket.on("agent_error", (data: { message: string }) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: data.message },
      ]);
    });

    socket.on("request_dom_state", (callback?: (data: unknown) => void) => {
      if (typeof callback === "function") callback(inspectDOM());
    });

    socket.on(
      "execute_dom_action",
      (
        data: { refId: number; action: "click" | "fill"; arguments?: string },
        callback?: (data: unknown) => void,
      ) => {
        const result = executeDOMAction(data.refId, data.action, data.arguments);
        if (typeof callback === "function") callback(result);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, []); // intentionally empty — socket must never be recreated on navigation

  const sendMessage = (input: string) => {
    if (!input.trim() || !socketRef.current) return;
    const token = localStorage.getItem("ai_session_token");
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsTyping(true);
    socketRef.current.emit("message", { message: input, token });
  };

  return { messages, isTyping, sendMessage, tourSteps };
}
