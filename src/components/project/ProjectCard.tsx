import { useState } from "react";
import { m } from "framer-motion";
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
        <m.div
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden transition-all duration-300 shadow-lg cursor-pointer group rounded-xl bg-card hover:shadow-xl"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="overflow-hidden aspect-video">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-background/60 to-transparent group-hover:opacity-100" />
          </div>

          <div className="p-6">
            <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <p className="mb-4 text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full bg-secondary"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-3 py-1 text-sm rounded-full bg-secondary">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        </m.div>
      </FadeIn>

      <ProjectDialog
        project={project}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
