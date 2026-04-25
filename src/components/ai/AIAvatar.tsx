import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function AIAvatar({ isThinking = false, className }: { isThinking?: boolean; className?: string }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [lookDirection, setLookDirection] = useState({ x: 0, y: 0 });
  const [isFocusedOnEditor, setIsFocusedOnEditor] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const isChatInput = target.closest(".chat-input-area");
      if (
        (target.tagName === "TEXTAREA" ||
          target.getAttribute("contenteditable") === "true") &&
        !isChatInput
      ) {
        setIsFocusedOnEditor(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement;
        const isChatInput = active?.closest(".chat-input-area");
        const isEditor =
          active?.tagName === "TEXTAREA" ||
          active?.getAttribute("contenteditable") === "true";
        if (!isEditor || isChatInput) setIsFocusedOnEditor(false);
      }, 100);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  useEffect(() => {
    if (isThinking) return;

    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      blinkRef.current = setTimeout(blinkLoop, Math.random() * 3000 + 2000);
    };

    const lookLoop = () => {
      if (isFocusedOnEditor) {
        setLookDirection({ x: -2.5, y: 0.5 });
        return;
      }
      const x = Math.random() > 0.6 ? (Math.random() > 0.5 ? 2 : -2) : 0;
      const y = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      setLookDirection({ x, y });
      setTimeout(() => {
        if (Math.random() > 0.5) setLookDirection({ x: 0, y: 0 });
      }, 1500);
      lookRef.current = setTimeout(lookLoop, Math.random() * 4000 + 2000);
    };

    const blinkRef = { current: setTimeout(blinkLoop, 2000) };
    const lookRef = { current: setTimeout(lookLoop, 1000) };

    if (isFocusedOnEditor) setLookDirection({ x: -2.5, y: 0.5 });

    return () => {
      clearTimeout(blinkRef.current);
      clearTimeout(lookRef.current);
    };
  }, [isThinking, isFocusedOnEditor]);

  return (
    <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-md ring-1 ring-white/10 select-none${className ? ` ${className}` : ""}`}>
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_70%)]" />
      <motion.div
        className="relative z-10 flex gap-[4px]"
        animate={
          isThinking
            ? { x: [0, 2, -2, 0], y: [-2.5, -3, -3, -2.5] }
            : { x: lookDirection.x, y: lookDirection.y }
        }
        transition={
          isThinking
            ? { repeat: Infinity, duration: 2.5, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }
            : { type: "spring", stiffness: 120, damping: 15 }
        }
      >
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="h-2.5 w-1.5 rounded-full bg-primary-foreground shadow-[0_0_2px_rgba(255,255,255,0.5)]"
            animate={
              isThinking
                ? { scaleY: [1, 0.6, 0.6, 1], opacity: 0.9 }
                : { scaleY: isBlinking ? 0.1 : 1, opacity: 1 }
            }
            transition={
              isThinking
                ? { repeat: Infinity, duration: 2.5, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }
                : { duration: 0.1 }
            }
          />
        ))}
      </motion.div>
    </div>
  );
}
