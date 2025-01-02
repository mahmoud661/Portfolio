import { motion } from "framer-motion";
import { Code2, Brain, Rocket, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import TimelineItem from "@/components/about/timeline-item";
import Particles from "@/components/ui/particles";

const journey = [
  {
    title: "Senior Full Stack Developer",
    subtitle: "Tech Corp",
    period: "2022 - Present",
    description: "Leading development teams and architecting scalable solutions. Implementing best practices and mentoring junior developers.",
    technologies: ["React", "Node.js", "AWS", "MongoDB"],
    icon: Briefcase
  },
  {
    title: "Master's in Computer Science",
    subtitle: "Tech University",
    period: "2020 - 2022",
    description: "Specialized in Artificial Intelligence and Machine Learning. Conducted research on neural networks and deep learning.",
    icon: GraduationCap
  },
  {
    title: "Full Stack Developer",
    subtitle: "Digital Solutions",
    period: "2018 - 2020",
    description: "Built end-to-end applications and mentored junior developers. Improved system performance by 40%.",
    technologies: ["React", "Express", "PostgreSQL", "Docker"],
    icon: Code2
  },
  {
    title: "Bachelor's in Software Engineering",
    subtitle: "Engineering College",
    period: "2014 - 2018",
    description: "Focus on Software Development and System Design. Led multiple successful project teams.",
    icon: Brain
  }
];

const skills = [
  "JavaScript/TypeScript",
  "React.js",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "Machine Learning"
];

export default function About() {
  return (
    <main className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
      <Particles
        className="absolute inset-0"
        quantity={100}
        staticity={30}
        ease={50}
      />
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Hero Section */}
        <FadeIn>
          <section className="text-center max-w-3xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-block p-4 bg-primary/10 rounded-full"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Journey
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A passionate developer with {new Date().getFullYear() - 2018}+ years of experience,
              dedicated to crafting exceptional digital experiences through clean code and innovative solutions.
            </motion.p>
          </section>
        </FadeIn>

        {/* Skills Cloud */}
        <section className="mb-24">
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                }}
                className="px-4 py-2 bg-card border rounded-full text-sm font-medium hover:bg-primary/10 hover:border-primary/20 transition-colors duration-300"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-24">
          {journey.map((item, index) => (
            <TimelineItem
              key={item.title}
              {...item}
              index={index}
            />
          ))}
        </section>
      </div>
    </main>
  );
}