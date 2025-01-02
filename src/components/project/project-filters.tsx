import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  technologies: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ProjectFilters({ 
  technologies, 
  activeFilter, 
  onFilterChange 
}: ProjectFiltersProps) {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onFilterChange("")}
        onMouseEnter={() => setHoveredFilter("all")}
        onMouseLeave={() => setHoveredFilter(null)}
        className={cn(
          "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
          activeFilter === "" 
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80"
        )}
      >
        All Projects
        {hoveredFilter === "all" && (
          <motion.span
            layoutId="filter-hover"
            className="absolute inset-0 rounded-full bg-primary/10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
      
      {technologies.map((tech) => (
        <motion.button
          key={tech}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(tech)}
          onMouseEnter={() => setHoveredFilter(tech)}
          onMouseLeave={() => setHoveredFilter(null)}
          className={cn(
            "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === tech 
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          {tech}
          {hoveredFilter === tech && (
            <motion.span
              layoutId="filter-hover"
              className="absolute inset-0 rounded-full bg-primary/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}