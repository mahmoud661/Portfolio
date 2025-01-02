import { motion } from "framer-motion";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  link: string;
}

const certificates: Certificate[] = [
  {
    title: "Advanced React and Redux",
    issuer: "Udemy",
    date: "2023",
    image: "/certificates/react.jpg",
    link: "#"
  },
  {
    title: "Machine Learning Specialization",
    issuer: "Coursera",
    date: "2023",
    image: "/certificates/ml.jpg",
    link: "#"
  },
  {
    title: "Full Stack Development",
    issuer: "FreeCodeCamp",
    date: "2022",
    image: "/certificates/fullstack.jpg",
    link: "#"
  }
];

export default function Certificates() {
  return (
    <section id="certificates" className="py-20 px-4 md:px-8 lg:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Certificates & Achievements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-700">
              {/* Placeholder for certificate image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Certificate Preview
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {cert.issuer}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {cert.date}
              </p>
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View Certificate →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}