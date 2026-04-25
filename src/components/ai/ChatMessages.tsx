import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { m } from "framer-motion";
import { cn } from "../../lib/utils";
import type { Message } from "./useAIChat";

const ENTRY = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
} as const;

const TOOL_ICONS: Record<string, string> = {
  trigger_ui_action: "→",
  inspect_react_dom: "◎",
  execute_react_dom_action: "↗",
  manage_tour: "▸",
  write_todos: "✓",
};

export function ChatMessages({
  messages,
  isTyping,
  onContinue,
  onStop,
  messagesEndRef,
}: {
  messages: Message[];
  isTyping: boolean;
  onContinue: () => void;
  onStop: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  const lastMsg = messages[messages.length - 1];
  const isStreaming = isTyping && lastMsg?.role === "ai";
  const showDots = isTyping && !isStreaming;

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {messages.length === 0 && (
        <div className="mt-4 text-sm text-center text-muted-foreground">
          Hi! I can show you my projects, certificates, or take you to the
          contact page. Where would you like to go?
        </div>
      )}

      {messages.map((msg, i) => {
        const isLastAI = isStreaming && i === messages.length - 1;

        if (msg.role === "tool") {
          const icon = TOOL_ICONS[msg.toolName] ?? "·";
          return (
            <m.div
              key={i}
              {...ENTRY}
              className="flex items-center gap-1.5 mr-auto py-0.5"
            >
              <span className="text-[10px] text-primary/70 font-mono leading-none">
                {icon}
              </span>
              <span className="text-xs text-muted-foreground/80 italic">
                {msg.content}
              </span>
            </m.div>
          );
        }

        if (msg.role === "interrupt") {
          return (
            <m.div
              key={i}
              {...ENTRY}
              className="mr-auto w-[90%] rounded-2xl rounded-bl-sm overflow-hidden border border-border bg-card shadow-sm text-sm"
            >
              <p className="px-4 pt-3 pb-2 text-foreground leading-snug">
                {msg.content}
              </p>
              <div className="flex border-t border-border">
                <button
                  type="button"
                  onClick={onStop}
                  disabled={isTyping}
                  className="flex-1 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/60 transition-colors disabled:opacity-40"
                >
                  Stop
                </button>
                <div className="w-px bg-border" />
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={isTyping}
                  className="flex-1 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </m.div>
          );
        }

        if (msg.role === "system") {
          return (
            <m.div
              key={i}
              {...ENTRY}
              className="w-full rounded-lg px-3 py-2 text-xs bg-muted/60 border border-border text-muted-foreground italic"
            >
              {msg.content}
            </m.div>
          );
        }

        if (msg.role === "user") {
          return (
            <m.div
              key={i}
              {...ENTRY}
              className="max-w-[85%] ml-auto rounded-2xl rounded-br-sm px-4 py-2 text-sm bg-primary text-primary-foreground"
            >
              {msg.content}
            </m.div>
          );
        }

        // AI message
        return (
          <m.div
            key={i}
            {...ENTRY}
            className={cn(
              "max-w-[85%] mr-auto rounded-2xl rounded-bl-sm px-4 py-2 text-sm bg-muted text-foreground",
              isLastAI && "pb-3",
            )}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-pre:my-2 prose-code:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {msg.content}
              </ReactMarkdown>
            </div>
            {isLastAI && (
              <span className="block mt-1 h-[2px] w-4 rounded-full bg-primary/40 animate-pulse" />
            )}
          </m.div>
        );
      })}

      {showDots && (
        <m.div
          {...ENTRY}
          className="bg-muted text-foreground mr-auto rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]"
        >
          <div className="flex space-x-1 items-center h-4">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce [animation-delay:0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce [animation-delay:0.3s]" />
          </div>
        </m.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
