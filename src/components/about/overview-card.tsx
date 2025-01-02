import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function OverviewCard({ icon: Icon, title, description, index }: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card hover:bg-card/50 border rounded-xl p-6 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="mb-4 size-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}