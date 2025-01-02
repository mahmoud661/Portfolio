import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/project/ProjectCard";
import { FadeIn } from "@/components/animations/fade-in";
import ShinyButton from "@/components/ui/shiny-button";

export default function FeaturedProjects() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work, demonstrating my expertise in building
            modern web applications.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {projects.slice(0, 2).map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/projects">
            <ShinyButton className="group">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </ShinyButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}