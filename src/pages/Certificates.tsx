import { motion } from "framer-motion";
import CertificateCard from "@/components/certificate/CertificateCard";
import { certificates } from "@/data/certificates";
import Particles from "@/components/ui/particles";
export default function Certificates() {
  return (
    <main className=" py-20 px-4 md:px-8 lg:px-16">
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        refresh
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Certificates & Achievements
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-16">
          A collection of professional certifications and achievements that
          demonstrate my commitment to continuous learning and growth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <CertificateCard key={index} certificate={cert} index={index} />
          ))}
        </div>
      </motion.div>
    </main>
  );
}