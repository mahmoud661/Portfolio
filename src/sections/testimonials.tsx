import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

const testimonials = [
  {
    quote: "An exceptional developer who consistently delivers high-quality work. Their attention to detail and problem-solving skills are outstanding.",
    author: "Sarah Johnson",
    role: "Product Manager",
    company: "Tech Innovations Inc."
  },
  {
    quote: "Working with them was a great experience. They brought creative solutions to complex problems and delivered beyond our expectations.",
    author: "Michael Chen",
    role: "CTO",
    company: "StartUp Labs"
  },
  {
    quote: "Their technical expertise and professional approach made our project a success. Would definitely recommend and work with them again.",
    author: "Emily Rodriguez",
    role: "Project Lead",
    company: "Digital Solutions"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it - here's what others have to say about
            working with me.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 blur-xl transition-all duration-500 group-hover:scale-110" />
              <div className="relative h-full p-8 rounded-3xl bg-background border">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-lg mb-6 text-muted-foreground">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}