import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "../../lib/utils";
import { useAIChat } from "./useAIChat";
import { ChatMessages } from "./ChatMessages";
import { TourProgress } from "./TourProgress";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isTyping, sendMessage, tourSteps } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle AI Chat"
        aria-label="Toggle AI Chat"
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all z-50",
          isOpen ? "scale-0" : "scale-100",
        )}
      >
        <MessageCircle size={24} />
      </button>

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
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground shrink-0">
          <div>
            <h3 className="text-lg font-semibold">Portfolio AI Tour</h3>
            <p className="text-xs opacity-90">Ask me to show you around!</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            title="Close AI Chat"
            aria-label="Close AI Chat"
            className="p-1 transition-colors rounded-md hover:bg-primary/80"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tour progress — slides in when a tour is active */}
        <AnimatePresence initial={false}>
          {tourSteps.length > 0 && (
            <m.div
              key="tour"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="shrink-0 overflow-hidden"
            >
              <TourProgress steps={tourSteps} />
            </m.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          onContinue={() => sendMessage("Please continue from where you left off.")}
          onStop={() => sendMessage("Please stop and wait for my next message.")}
          messagesEndRef={messagesEndRef}
        />

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-border bg-card shrink-0"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 pr-12 text-sm border rounded-full border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              title="Send Message"
              aria-label="Send Message"
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute p-2 transition-colors rounded-full right-2 text-primary hover:bg-muted disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
