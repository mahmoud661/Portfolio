import { motion } from "framer-motion";
import { Code2, Palette, Terminal, Cpu } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

const skills = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Building responsive and performant web applications with modern technologies",
    gradient: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10"
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating intuitive and beautiful user interfaces with attention to detail",
    gradient: "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10"
  },
  {
    icon: Terminal,
    title: "Backend Development",
    description: "Developing robust and scalable server-side solutions",
    gradient: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10"
  },
  {
    icon: Cpu,
    title: "AI Integration",
    description: "Implementing machine learning and AI solutions for smart applications",
    gradient: "from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10"
  }
];

export default function FeaturedSkills() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What I Do Best
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Combining technical expertise with creative problem-solving to deliver
            exceptional digital solutions.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${skill.gradient} blur-xl transition-all duration-500 group-hover:scale-110`} />
                <div className="relative h-full p-6 rounded-3xl bg-background border transition-colors">
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground">{skill.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}