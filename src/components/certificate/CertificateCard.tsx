import { motion } from "framer-motion";
import { Certificate } from "@/types";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ExternalLink } from "lucide-react";
import "../../index.css"
interface CertificateCardProps {
  certificate: Certificate;
  index: number;
}

export default function CertificateCard({
  certificate,
  index,
}: CertificateCardProps) {
  const isPdf = certificate.image.toLowerCase().endsWith(".pdf");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-[var(--transition-length)] delay-[var(--delay)]"
    >
      <div className="aspect-video overflow-hidden relative ">
        {isPdf ? (
          <div className="w-full h-full bg-gray-200 dark:bg-zinc-700 ">
            {/* React PDF viewer */}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div className=" scale-125">
                <Viewer fileUrl={certificate.image} />
              </div>
            </Worker>
          </div>
        ) : (
          <img
            src={certificate.image}
            alt={certificate.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {certificate.title}
        </h3>
       
      
        <a
          href={certificate.image}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <span>View Full PDF</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
