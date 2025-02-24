import {  Suspense } from "react";
import React from "react";
import { Code2, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import TimelineItem from "@/components/about/timeline-item";
import { motion } from "framer-motion";
// Lazy load Particles component
const Particles = React.lazy(() => import("@/components/ui/particles"));

const journey = [
	{
		title: "Education: Bachelor of AI & Data Science",
		subtitle: "Al Hussain Bin Talal University",
		period: "2021 - 2025",
		description:
			"Currently a fourth-year IT student specializing in AI, data science, and full-stack MERN development.",
		icon: GraduationCap
	},
	{
		title: "Internship: Marketing Department",
		subtitle: "Pioneer Academy",
		period: "July 2023 - September 2023",
		description:
			"Focused on social media marketing, digital content creation, community management, and advertising.",
		icon: Briefcase
	},
	{
		title: "Internship: Jordan Webmaster",
		subtitle: "Web Development Internship",
		period: "July 2022 - September 2022",
		description:
			"Worked on web development tasks, contributing to both front-end and back-end projects.",
		icon: Briefcase
	},
	{
		title: "Internship: AI & Data Science",
		subtitle: "Estarta Solutions",
		period: "July 2024 - September 2024",
		description:
			"Developed machine learning applications (face recognition, auto-complete systems using CNN and NLP) and built responsive frontends with React.",
		icon: Code2
	}
];

const skills = [
	"JavaScript",
	"React.js",
	"TypeScript",
	"Node.js",
	"Express.js",
	"MongoDB",
	"Git & GitHub",
	"PostgreSQL",
	"FAST API",
	"TensorFlow",
	"Socket IO",
	"CNN",
	"RNN",
	"Machine Learning",
	"Vite",
	"NLP",
	"pandas",
	"numpy",
	"matplotlib",
	"NestJS",
	"Tailwind",
	"NoSQL",
	"Next.js",
	"UE5"
];

export default function About() {
  return (
    <main className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
      <Suspense fallback={null}>
        <Particles
          className="absolute inset-0"
          quantity={100}
          staticity={30}
          ease={50}
        />
      </Suspense>
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
             As an ambitious fourth-year IT student at Alhussain Bin Talal University, I excel in blending academic rigor with practical experience.
             My focus on AI, data science, and full-stack MERN development drives me to create innovative, intelligent solutions while delivering seamless user experiences.
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