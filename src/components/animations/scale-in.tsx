import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScaleInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export function ScaleIn({ children, delay = 0, className, ...props }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay 
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}