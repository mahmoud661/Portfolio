import { cn } from "@/lib/utils";
import React from "react";

interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  duration?: number;
}

export function Fade({ 
  children, 
  show = true, 
  duration = 200,
  className,
  ...props 
}: FadeProps) {
  return (
    <div
      className={cn(
        "transition-opacity",
        show ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}