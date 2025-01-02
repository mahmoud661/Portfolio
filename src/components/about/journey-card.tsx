import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface JourneyCardProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  technologies?: string[];
  isLeft?: boolean;
  icon: LucideIcon;
}

export default function JourneyCard({
  title,
  subtitle,
  period,
  description,
  technologies,
  isLeft = true,
  icon: Icon
}: JourneyCardProps) {
  return (
    <div className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-1/2"
      >
        <div className="bg-card p-6 rounded-xl border hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Icon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {technologies && (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-secondary rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative"
      >
        <span className="text-xs text-primary-foreground font-medium">{period}</span>
        <div className="absolute top-1/2 w-8 h-px bg-border" style={{
          left: isLeft ? '100%' : 'auto',
          right: isLeft ? 'auto' : '100%'
        }} />
      </motion.div>
      <div className="w-1/2" />
    </div>
  );
}