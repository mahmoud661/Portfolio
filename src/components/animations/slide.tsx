import { cn } from "@/lib/utils";
import React from "react";

type Direction = "left" | "right" | "up" | "down";

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  direction?: Direction;
  duration?: number;
  distance?: number;
}

export function Slide({
  children,
  show = true,
  direction = "right",
  duration = 200,
  distance = 20,
  className,
  ...props
}: SlideProps) {
  const getTransform = (dir: Direction) => {
    switch (dir) {
      case "left":
        return `translateX(-${distance}px)`;
      case "right":
        return `translateX(${distance}px)`;
      case "up":
        return `translateY(-${distance}px)`;
      case "down":
        return `translateY(${distance}px)`;
    }
  };

  return (
    <div
      className={cn(
        "transition-all",
        show ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transform: show ? "translate(0)" : getTransform(direction),
        transitionDuration: `${duration}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}