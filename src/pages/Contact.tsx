import { motion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Particles from "@/components/ui/particles";
export default function Contact() {
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
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Get In Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-16">
          Have a question or want to work together? Feel free to reach out!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ContactInfo />
          <ContactForm />
        </div>
      </motion.div>
    </main>
  );
}