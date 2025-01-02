import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import ProjectHeader from "@/components/project/project-header";
import ProjectFilters from "@/components/project/project-filters";
import ProjectGrid from "@/components/project/project-grid";
import Particles from "@/components/ui/particles";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("");

  const technologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet);
  }, []);

  return (
    <main className="relative min-h-screen py-20 px-4 md:px-8 lg:px-16">
      <Particles
        className="absolute inset-0"
        quantity={150}
        staticity={50}
        ease={50}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <ProjectHeader />
        
        <ProjectFilters
          technologies={technologies}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <ProjectGrid 
          projects={projects}
          filter={activeFilter}
        />
      </div>
    </main>
  );
}