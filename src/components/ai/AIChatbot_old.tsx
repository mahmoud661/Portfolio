import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "../../lib/utils";
import { inspectDOM, executeDOMAction } from "../../lib/dom-inspector";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:8000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to AI server");
    });

    socket.on("token", (data: { token: string }) => {
      localStorage.setItem("ai_session_token", data.token);
    });

    socket.on("chunk", (data: { content: string }) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];

        if (lastMsg && lastMsg.role === "ai") {
          let updatedContent = lastMsg.content + data.content;

          // Action parsing logic across the entire message to catch split chunks
          const actionRegex = /<call_to_action\s+label="([^"]+)"\s*\/>/g;
          let match;
          while ((match = actionRegex.exec(updatedContent)) !== null) {
            handleAction(match[1]);
          }

          // Remove the parsed tags so they aren't rendered or re-executed
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

    socket.on("message_complete", () => {
      setIsTyping(false);
    });

    socket.on("request_dom_state", (callback?: (data: any) => void) => {
      console.log("Backend agent requested DOM state...");
      const domState = inspectDOM();
      if (typeof callback === "function") {
        callback(domState);
      }
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
        if (typeof callback === "function") {
          callback(result);
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  // Note: Using navigate from the router hook to drive the site UI
  const handleAction = (label: string) => {
    console.log("Executing UI Action:", label);
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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const token = localStorage.getItem("ai_session_token");

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsTyping(true);

    socketRef.current.emit("message", {
      message: input,
      token: token,
    });

    setInput("");
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all z-50",
          isOpen ? "scale-0" : "scale-100",
        )}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div
        id="ai-chatbot-container"
        className={cn(
          "fixed bottom-6 right-6 w-80 sm:w-96 rounded-2xl shadow-2xl bg-card border border-border flex flex-col overflow-hidden transition-all duration-300 z-50",
          isOpen
            ? "scale-100 opacity-100 h-[32rem]"
            : "scale-95 opacity-0 h-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
          <div>
            <h3 className="text-lg font-semibold">Portfolio AI Tour</h3>
            <p className="text-xs opacity-90">Ask me to show you around!</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 transition-colors rounded-md hover:bg-primary/80"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="mt-4 text-sm text-center text-muted-foreground">
              Hi! I can show you my projects, certificates, or take you to the
              contact page. Where would you like to go?
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto rounded-br-sm"
                  : "bg-muted text-foreground mr-auto rounded-bl-sm",
              )}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <div className="prose-sm prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="bg-muted text-foreground mr-auto rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[85%]">
              <span className="animate-pulse">...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={sendMessage}
          className="flex gap-2 p-3 border-t bg-card border-border"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. Take me to the projects..."
            className="flex-1 px-4 py-2 text-sm bg-transparent border rounded-full border-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 transition-colors rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}

