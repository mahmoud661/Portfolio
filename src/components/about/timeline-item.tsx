import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  technologies?: string[];
  icon: LucideIcon;
  index: number;
}

export default function TimelineItem({
  title,
  subtitle,
  period,
  description,
  technologies,
  icon: Icon,
  index,
}: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      {/* Connector Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary to-primary/20 hidden md:block" />

      {/* Content */}
      <div
        className={`grid items-center gap-8 ${
          isEven
            ? "md:grid-cols-[1fr,auto,1fr] [&>*]:md:col-start-[span_1]"
            : "md:grid-cols-[1fr,auto,1fr] [&>*]:md:col-start-[span_1]"
        } grid-cols-1`}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className={`bg-card border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 `}
        >
          <div
            className={`flex items-center gap-3 mb-4 ${
              " justify-start md:flex-row"
                
            }`}
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{description}</p>
          {technologies && (
            <div
              className={`flex flex-wrap gap-2 ${
                isEven ? "justify-end md:justify-start" : "justify-start"
              }`}
            >
              {technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-secondary rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Timeline Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 flex flex-col items-center gap-2"
        >
          <div className="w-4 h-4 rounded-full bg-primary" />
          <div className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {period}
          </div>
        </motion.div>

        {/* Empty Space */}
        <div className="hidden md:block" />
      </div>
    </div>
  );
}
