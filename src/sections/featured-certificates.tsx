import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { certificates } from "@/data/certificates";
import CertificateCard from "@/components/certificate/CertificateCard";
import { FadeIn } from "@/components/animations/fade-in";
import ShinyButton from "@/components/ui/shiny-button";

export default function FeaturedCertificates() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Award className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Certifications & Achievements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and achievements that demonstrate my
            commitment to continuous learning and growth.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certificates.slice(0, 3).map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CertificateCard certificate={cert} index={index} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/certificates">
            <ShinyButton className="group">
              View All Certificates
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </ShinyButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}