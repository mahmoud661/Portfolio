import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../ui/theme-toggle";
import MobileMenu from "./mobile-menu";

const navVariants = {
  initial: {
    y: -50,
    x: "-50%",
    opacity: 0,
  },
  animate: {
    y: 0,
    x: "-50%",
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    y: -50,
    opacity: 0,
  },
};

function NavbarFixed({ visible }: { visible: boolean }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <motion.div
        initial="initial"
        animate={visible ? "animate" : "exit"}
        variants={navVariants}
        className="fixed z-[50] top-4 left-1/2 -translate-x-1/2 rounded-2xl p-1 bg-background/5 backdrop-blur-lg border border-border transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      >
        <div className="flex items-center md:hidden px-4 py-2 gap-2">
          <Link to="/" className="text-lg font-semibold">
            MZ
          </Link>
          <div className="flex-1" />
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <ul className="hidden md:flex items-center gap-2 text-sm font-medium font-jakarta">
          {navItems.map((item) => (
            <li key={item.path} className="group">
              <Link
                to={item.path}
                className={`relative p-4 block transition-all ${
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-fixed-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <button className="font-jakarta text-sm px-4 py-2 rounded-full text-background font-medium bg-foreground hover:bg-background hover:text-foreground border border-foreground transition-all duration-300">
              Resume
            </button>
          </li>
        </ul>
      </motion.div>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

export default NavbarFixed;