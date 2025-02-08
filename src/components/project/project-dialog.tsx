import { Project } from "@/types";
import { Dialog } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Github, ExternalLink, Play } from "lucide-react";
import { ScaleIn } from "@/components/animations/scale-in";
import { useState } from "react";

interface ProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDialog({ project, isOpen, onClose }: ProjectDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isVideo = project.media?.type === 'video';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <ScaleIn>
          <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden mb-6 group bg-black">
            {isVideo ? (
              isPlaying ? (
                <video
                  src={project.media?.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  preload="metadata"
                />
              ) : (
                <>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-16 h-16 text-white" />
                  </button>
                </>
              )
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </ScaleIn>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-secondary rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View Code</span>
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Live Demo</span>
            </a>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}