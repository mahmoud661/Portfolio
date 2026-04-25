import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { m } from "framer-motion";
import { cn } from "../../lib/utils";
import { AIAvatar } from "./AIAvatar";
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
  get_site_structure: "◈",
  plan_tour: "◆",
  scroll_page: "↕",
  spotlight_element: "◉",
};

// True if this AI message is the last one before the next user message (or end).
// Only this message gets the avatar; prior AI messages in the same turn get a spacer.
function isLastAIBeforeUser(messages: Message[], i: number): boolean {
  for (let j = i + 1; j < messages.length; j++) {
    if (messages[j].role === "user") return true;
    if (messages[j].role === "ai") return false;
  }
  return true;
}

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

        /* ── Tool activity line ── */
        if (msg.role === "tool") {
          const icon = TOOL_ICONS[msg.toolName] ?? "·";
          return (
            <m.div
              key={i}
              {...ENTRY}
              className="flex items-center gap-1.5 pl-10 py-0.5"
            >
              <span className="text-[10px] text-primary/60 font-mono">{icon}</span>
              <span className="text-xs text-muted-foreground/70 italic">
                {msg.content}
              </span>
            </m.div>
          );
        }

        /* ── System notice ── */
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

        /* ── Interrupt card ── */
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

        /* ── User message ── */
        if (msg.role === "user") {
          return (
            <m.div
              key={i}
              {...ENTRY}
              className="max-w-[80%] ml-auto rounded-2xl rounded-br-sm px-4 py-2 text-sm bg-primary text-primary-foreground"
            >
              {msg.content}
            </m.div>
          );
        }

        /* ── AI message — no bubble, text on background ── */
        const showAvatar = isLastAIBeforeUser(messages, i);

        return (
          <m.div
            key={i}
            {...ENTRY}
            className="flex items-end gap-2.5 mr-auto max-w-[90%]"
          >
            {/* Avatar on last AI of a turn, spacer on earlier ones */}
            {showAvatar ? (
              <div className="shrink-0">
                <AIAvatar isThinking={isLastAI} />
              </div>
            ) : (
              <div className="w-8 shrink-0" />
            )}

            <div className={cn("text-sm text-foreground min-w-0", isLastAI && "pb-1")}>
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-pre:my-2 prose-code:text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
              {isLastAI && (
                <span className="block mt-1 h-[2px] w-4 rounded-full bg-primary/40 animate-pulse" />
              )}
            </div>
          </m.div>
        );
      })}

      {/* Typing dots — avatar in thinking state */}
      {showDots && (
        <m.div {...ENTRY} className="flex items-center gap-2.5 mr-auto">
          <div className="shrink-0">
            <AIAvatar isThinking />
          </div>
          <div className="flex space-x-1 items-center h-4">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.3s]" />
          </div>
        </m.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
