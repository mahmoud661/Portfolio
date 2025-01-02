import { motion } from "framer-motion";
import { Project } from "@/types";
import ProjectCard from "./ProjectCard";
import { FadeIn } from "@/components/animations/fade-in";

interface ProjectGridProps {
  projects: Project[];
  filter?: string;
}

export default function ProjectGrid({ projects, filter }: ProjectGridProps) {
  const filteredProjects = filter
    ? projects.filter(project => 
        project.technologies.some(tech => 
          tech.toLowerCase().includes(filter.toLowerCase())
        )
      )
    : projects;

  return (
    <FadeIn className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {filteredProjects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProjectCard project={project} index={index} />
        </motion.div>
      ))}
    </FadeIn>
  );
}