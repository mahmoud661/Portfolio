import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  }),
  exit: { opacity: 0, x: 20 },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 z-[9999] h-full w-[75%] max-w-sm bg-background border-l border-border p-6"
          >
            <div className="flex justify-end mb-8">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
            
            <nav className="space-y-6">
              <ul className="space-y-4">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.path}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuItemVariants}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`block py-2 text-lg transition-colors hover:text-foreground ${
                        location.pathname === item.path
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-full text-background font-medium bg-foreground border border-foreground hover:bg-background hover:text-foreground transition-all"
              >
                Resume
              </motion.button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}