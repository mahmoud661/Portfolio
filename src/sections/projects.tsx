import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with React, Node.js, and MongoDB",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Redux"],
    github: "#",
    demo: "#",
    image: "/projects/ecommerce.jpg"
  },
  {
    title: "AI Image Generator",
    description: "An AI-powered image generation tool using DALL-E API",
    technologies: ["Python", "FastAPI", "React", "OpenAI"],
    github: "#",
    demo: "#",
    image: "/projects/ai-image.jpg"
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "TypeScript"],
    github: "#",
    demo: "#",
    image: "/projects/task-app.jpg"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-zinc-800">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-700">
              {/* Placeholder for project image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Project Preview
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Github size={20} />
                  <span>Code</span>
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ExternalLink size={20} />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}