import { useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import ProjectDialog from "./project-dialog";
import { FadeIn } from "@/components/animations/fade-in";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <FadeIn delay={index * 0.1}>
        <motion.div
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-secondary rounded-full"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-3 py-1 text-sm bg-secondary rounded-full">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </FadeIn>

      <ProjectDialog
        project={project}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}