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

/**
 * Show a spotlight for exactly 5 seconds, then call onDone.
 *
 * Design: a "lens" div sits at the element's position. Its enormous box-shadow
 * darkens the entire page except for the lens area, creating a proper spotlight
 * cutout. A rAF loop keeps it locked to the element even if the page scrolls.
 * No element styles are modified — everything is done with separate overlay divs.
 */
function applySpotlight(el: HTMLElement, label: string, onDone: () => void): void {
  const PADDING  = 14;
  const DURATION = 5000;

  el.scrollIntoView({ behavior: "smooth", block: "center" });

  // Hide the chatbot panel so it doesn't overlap the spotlight
  const chatbotPanel = document.getElementById("ai-chatbot-container");
  if (chatbotPanel) {
    chatbotPanel.style.opacity       = "0";
    chatbotPanel.style.pointerEvents = "none";
    chatbotPanel.style.transition    = "opacity 0.3s ease";
  }

  const primary   = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
  const ringColor = `hsl(${primary})`;
  const glowColor = `hsl(${primary} / 0.45)`;

  // Lens — transparent rect that "cuts out" a hole in the page-wide shadow
  const lens = document.createElement("div");
  Object.assign(lens.style, {
    position:      "fixed",
    zIndex:        "9998",
    borderRadius:  "12px",
    pointerEvents: "none",
    border:        `2px solid ${ringColor}`,
    background:    "transparent",
    // Huge shadow darkens everything outside the lens; inner glow highlights the edges
    boxShadow:     `0 0 0 9999px rgba(0,0,0,0.62), 0 0 32px 6px ${glowColor}`,
    opacity:       "0",
    transition:    "opacity 0.35s ease",
  });

  // Badge — always dark background + white text so it's legible in any theme
  const badge = document.createElement("div");
  Object.assign(badge.style, {
    position:      "fixed",
    zIndex:        "9999",
    pointerEvents: "none",
    background:    "rgba(15, 15, 15, 0.92)",
    color:         "white",
    fontSize:      "12px",
    fontWeight:    "700",
    letterSpacing: "0.02em",
    padding:       "6px 14px",
    borderRadius:  "9999px",
    whiteSpace:    "nowrap",
    border:        `1px solid ${ringColor}`,
    boxShadow:     `0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px ${glowColor}`,
    opacity:       "0",
    transition:    "opacity 0.35s ease",
  });
  badge.textContent = label;

  document.body.appendChild(lens);
  document.body.appendChild(badge);

  // rAF loop — tracks the element every frame so the spotlight stays locked
  // even if smooth-scroll is still animating or the user scrolls manually
  let tracking = true;
  function syncPositions() {
    if (!tracking) return;
    const r  = el.getBoundingClientRect();
    const bh = badge.offsetHeight || 30;
    const bw = badge.offsetWidth  || 100;

    lens.style.top    = `${r.top  - PADDING}px`;
    lens.style.left   = `${r.left - PADDING}px`;
    lens.style.width  = `${r.width  + PADDING * 2}px`;
    lens.style.height = `${r.height + PADDING * 2}px`;

    const belowY = r.bottom + PADDING + 8;
    const aboveY = r.top    - PADDING - bh - 8;
    badge.style.top  = `${belowY + bh < window.innerHeight - 8 ? belowY : aboveY}px`;
    badge.style.left = `${Math.max(8, Math.min(r.left + r.width / 2 - bw / 2, window.innerWidth - bw - 8))}px`;

    requestAnimationFrame(syncPositions);
  }

  // Two-frame render: position first, then fade in (avoids flash at 0,0)
  requestAnimationFrame(() => {
    syncPositions();
    requestAnimationFrame(() => {
      lens.style.opacity  = "1";
      badge.style.opacity = "1";
    });
  });

  // After DURATION: fade out, clean up DOM, call onDone to unblock the agent
  setTimeout(() => {
    tracking = false;
    lens.style.opacity  = "0";
    badge.style.opacity = "0";
    setTimeout(() => {
      lens.parentNode?.removeChild(lens);
      badge.parentNode?.removeChild(badge);
      // Restore the chatbot panel
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
      (data: { selector: string; label: string }, callback?: () => void) => {
        const el = findElementBySelector(data.selector);
        if (!el) {
          console.warn(`Spotlight: no element found for "${data.selector}"`);
          if (typeof callback === "function") callback();
          return;
        }
        applySpotlight(el, data.label, () => {
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
