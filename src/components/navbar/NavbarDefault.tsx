import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../ui/theme-toggle";
import MobileMenu from "./mobile-menu";

function NavbarDefault({ className = "" }: { className?: string }) {
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`flex flex-col md:flex-row md:justify-between md:items-center px-4 md:px-10 pt-5 pb-2 bg-background border-b border-border ${className}`}
      >
        <div className="flex justify-between items-center mb-4 md:mb-0">
          <Link to="/" className="text-xl text-foreground font-semibold">
            MZ
          </Link>
          
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <ul className="hidden md:flex flex-col md:flex-row items-center gap-2 text-muted-foreground font-medium font-jakarta">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`relative p-3 block transition-colors hover:text-foreground ${
                  isActive(item.path) ? "text-foreground" : ""
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
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
          <li className="hidden md:block">
            <ThemeToggle />
          </li>
        </ul>

        <div className="hidden md:block">
          <a
            href="/src/assets/Mahmoud Zreiqi -CV.pdf"
            download
            className="font-jakarta text-sm px-4 py-2 rounded-full text-background font-medium bg-foreground border border-foreground hover:bg-background hover:text-foreground transition-colors"
          >
            Resume
          </a>
        </div>
      </motion.nav>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

export default NavbarDefault;