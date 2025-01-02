import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import TimelineCard from "./timeline-card";
import { FadeIn } from "@/components/animations/fade-in";

interface TimelineSectionProps {
  icon: LucideIcon;
  title: string;
  items: Array<{
    title: string;
    subtitle: string;
    period: string;
    description: string;
    technologies?: string[];
  }>;
}

export default function TimelineSection({ icon: Icon, title, items }: TimelineSectionProps) {
  return (
    <section>
      <FadeIn className="flex items-center gap-3">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </FadeIn>
      
      <div className="mt-12 relative">
        <div className="absolute left-0 top-0 h-full w-px bg-border md:left-1/2 hidden md:block" />
        <div className="space-y-8 md:space-y-0">
          {items.map((item, index) => (
            <TimelineCard
              key={index}
              index={index}
              title={item.title}
              subtitle={item.subtitle}
              period={item.period}
              description={item.description}
              technologies={item.technologies}
            />
          ))}
        </div>
      </div>
    </section>
  );
}