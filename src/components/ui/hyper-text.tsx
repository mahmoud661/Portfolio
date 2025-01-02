"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string | string[];
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export default function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(
    typeof text === "string" ? text.split("") : text[0]?.split("") || []
  );
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);

  const triggerAnimation = () => {
    interations.current = 0;
    setTrigger(true);
    if (Array.isArray(text)) {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % text.length);
      setDisplayText(text[(currentTextIndex + 1) % text.length]?.split("") || []);
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (interations.current < displayText.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= interations.current
                  ? (Array.isArray(text) ? text[currentTextIndex][i] : text[i])
                  : alphabets[getRandomInt(26)],
            ),
          );
          interations.current = interations.current + 0.1;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (displayText.length * 10),
    );
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad, displayText, currentTextIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerAnimation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="overflow-hidden py-2 flex cursor-default scale-100"
      onMouseEnter={triggerAnimation}
    >
      <AnimatePresence>
        {displayText.map((letter, i) => (
          <motion.h1
            key={i}
            className={cn("font-mono", letter === " " ? "w-3" : "", className)}
            {...framerProps}
          >
            {letter?.toUpperCase()}
          </motion.h1>
        ))}
      </AnimatePresence>
    </div>
  );
}
