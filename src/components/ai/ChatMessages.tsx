import ReactMarkdown from "react-markdown";
import { cn } from "../../lib/utils";
import type { Message } from "./useAIChat";

export function ChatMessages({
  messages,
  isTyping,
  messagesEndRef,
}: {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  return (
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
              : "bg-muted text-foreground mr-auto rounded-bl-sm prose prose-sm dark:prose-invert max-w-none",
          )}
        >
          {msg.role === "user" ? (
            msg.content
          ) : (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          )}
        </div>
      ))}
      {isTyping && (
        <div className="bg-muted text-foreground mr-auto rounded-2xl rounded-bl-sm px-4 py-2 max-w-[85%]">
          <div className="flex space-x-1 items-center h-5">
            <div className="w-2 h-2 rounded-full bg-current opacity-40 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current opacity-40 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-current opacity-40 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
