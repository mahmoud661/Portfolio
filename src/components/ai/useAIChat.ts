import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { inspectDOM, executeDOMAction } from "../../lib/dom-inspector";

export type Message = { role: "user" | "ai"; content: string };

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to AI server"));

    socket.on("token", (data: { token: string }) => {
      localStorage.setItem("ai_session_token", data.token);
    });

    socket.on("chunk", (data: { content: string }) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];

        if (lastMsg && lastMsg.role === "ai") {
          let updatedContent = lastMsg.content + data.content;

          const actionRegex = /<call_to_action\s+label="([^"]+)"\s*\/>/g;
          let match;
          while ((match = actionRegex.exec(updatedContent)) !== null) {
            handleAction(match[1]);
          }

          updatedContent = updatedContent.replace(actionRegex, "");
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            content: updatedContent,
          };
        } else {
          newMessages.push({ role: "ai", content: data.content });
        }
        return newMessages;
      });
    });

    socket.on("message_complete", () => setIsTyping(false));

    socket.on("request_dom_state", (callback?: (data: any) => void) => {
      console.log("Backend agent requested DOM state...");
      if (typeof callback === "function") callback(inspectDOM());
    });

    socket.on(
      "execute_dom_action",
      (
        data: { refId: number; action: "click" | "fill"; arguments?: string },
        callback?: (data: any) => void,
      ) => {
        console.log("Executing DOM action:", data);
        const result = executeDOMAction(
          data.refId,
          data.action,
          data.arguments,
        );
        if (typeof callback === "function") callback(result);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleAction = (label: string) => {
    switch (label.toLowerCase()) {
      case "navigate_home":
      case "open_home":
        navigate("/");
        break;
      case "navigate_about":
      case "open_about":
        navigate("/about");
        break;
      case "navigate_projects":
      case "open_projects":
        navigate("/projects");
        break;
      case "navigate_certificates":
      case "open_certificates":
        navigate("/certificates");
        break;
      case "navigate_contact":
      case "open_contact":
        navigate("/contact");
        break;
      default:
        console.warn("AI requested unknown action:", label);
    }
  };

  const sendMessage = (input: string) => {
    if (!input.trim() || !socketRef.current) return;
    const token = localStorage.getItem("ai_session_token");
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsTyping(true);
    socketRef.current.emit("message", { message: input, token });
  };

  return { messages, isTyping, sendMessage };
}
