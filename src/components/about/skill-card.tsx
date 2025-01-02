import { motion } from "framer-motion";
import { ScaleIn } from "@/components/animations/scale-in";
import { LucideIcon } from "lucide-react";

interface SkillCardProps {
  icon: LucideIcon;
  title: string;
  skills: string[];
  delay: number;
}

export default function SkillCard({ icon: Icon, title, skills, delay }: SkillCardProps) {
  return (
    <ScaleIn delay={delay}>
      <motion.div 
        className="bg-card p-6 rounded-xl border hover:shadow-lg"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-8 h-8" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <ul className="space-y-2">
          {skills.map((skill, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + delay }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              {skill}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </ScaleIn>
  );
}