import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";

interface TimelineCardProps {
  index: number;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  technologies?: string[];
}

export default function TimelineCard({ 
  index, 
  title, 
  subtitle, 
  period, 
  description, 
  technologies 
}: TimelineCardProps) {
  const isEven = index % 2 === 0;

  return (
    <FadeIn delay={index * 0.2}>
      <div 
        className={`relative md:w-1/2 ${
          isEven ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'
        } pl-8 mb-8 md:mb-0`}
      >
        <motion.div 
          className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-foreground md:left-0"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.div 
          className="bg-card p-6 rounded-xl border space-y-3"
          whileHover={{ x: isEven ? -5 : 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{subtitle} • {period}</p>
          </div>
          <p className="text-muted-foreground">{description}</p>
          {technologies && (
            <div className="flex flex-wrap gap-2">
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
      </div>
    </FadeIn>
  );
}