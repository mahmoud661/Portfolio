import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ProjectHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        <Sparkles className="w-8 h-8 text-primary" />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
        Featured Projects
      </h1>
      <p className="text-lg text-muted-foreground">
        Explore my latest works and creative endeavors. Each project represents a unique challenge 
        and demonstrates my commitment to crafting exceptional digital experiences.
      </p>
    </motion.div>
  );
}