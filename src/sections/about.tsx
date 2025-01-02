import { motion } from "framer-motion";

export default function About() {
  const skills = [
    "JavaScript/TypeScript",
    "React.js",
    "Node.js",
    "Python",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Git",
    "TailwindCSS"
  ];

  return (
    <section id="about" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-zinc-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                I'm a passionate Full Stack Developer with expertise in building
                scalable web applications and solving complex problems.
              </p>
              <p>
                With 5+ years of experience in software development, I've worked
                with various technologies and frameworks to create efficient and
                user-friendly solutions.
              </p>
              <p>
                I'm particularly interested in AI/ML applications and creating
                intuitive user experiences that make a difference.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.1,
                    type: "spring",
                  }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}