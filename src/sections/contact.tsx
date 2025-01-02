import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import ShinyButton from "@/components/ui/shiny-button";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 lg:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Get In Touch
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <a href="mailto:contact@example.com" className="hover:text-primary">
                contact@example.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gray-600 dark:text-gray-400" />
              <a href="tel:+1234567890" className="hover:text-primary">
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-600 dark:text-gray-400" />
              <span>New York, NY</span>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <Twitter size={24} />
            </a>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          <ShinyButton className="w-full">Send Message</ShinyButton>
        </motion.form>
      </div>
    </section>
  );
}