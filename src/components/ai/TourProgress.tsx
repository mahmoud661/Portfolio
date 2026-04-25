import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import type { TourStep } from "./useAIChat";

function StepIcon({ status }: { status: TourStep["status"] }) {
  if (status === "completed") {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500">
        <Check size={9} className="text-white" strokeWidth={3} />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
      </span>
    );
  }
  return (
    <span className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/30" />
  );
}

export function TourProgress({ steps }: { steps: TourStep[] }) {
  const [expanded, setExpanded] = useState(false);

  const completed = steps.filter((s) => s.status === "completed").length;
  const current = steps.find((s) => s.status === "in_progress");
  const total = steps.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = completed === total;

  return (
    <div className="border-b border-border bg-muted/30">
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-muted/50 transition-colors"
      >
        {/* Label */}
        <span
          className={cn(
            "text-[11px] font-medium shrink-0",
            allDone ? "text-green-600 dark:text-green-400" : "text-primary",
          )}
        >
          {allDone ? "Tour complete" : `Tour · ${current?.title ?? "Starting…"}`}
        </span>

        {/* Progress bar */}
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <m.div
            className={cn(
              "h-full rounded-full",
              allDone ? "bg-green-500" : "bg-primary",
            )}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Counter */}
        <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
          {completed}/{total}
        </span>

        {/* Chevron */}
        <span className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>

      {/* Expandable step list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            key="steps"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-1">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <StepIcon status={step.status} />
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "text-xs leading-none",
                        step.status === "completed"
                          ? "text-muted-foreground line-through"
                          : step.status === "in_progress"
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                    {step.status === "in_progress" && (
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
