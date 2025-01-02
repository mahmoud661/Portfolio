import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin} from "lucide-react";

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="text-gray-600 dark:text-gray-400" />
          <a
            href="mailto:mahmoudzuriqi8@gmail.com"
            className="hover:text-primary"
          >
            mahmoudzuriqi8@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="text-gray-600 dark:text-gray-400" />
          <a href="tel:+962776230806" className="hover:text-primary">
            +962776230806
          </a>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-gray-600 dark:text-gray-400" />
          <span>Jordan</span>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <a
          href="https://github.com/mahmoud661"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <Github size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/mahmoudzuriqi/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <Linkedin size={24} />
        </a>
      </div>
    </motion.div>
  );
}