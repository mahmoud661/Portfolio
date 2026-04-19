import { m } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import MobileMenu from "./mobile-menu";
import CV from "../../assets/Mahmoud Zreiqi -CV.pdf";

const handleDownload = async () => {
  const response = await fetch(CV);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Mahmoud-Zreiqi-CV.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

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
      <m.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`flex flex-col md:flex-row md:items-center px-4 md:px-10 pt-5 pb-4 bg-background border-b border-border ${className}`}
      >
        <div className="flex justify-between items-center w-full md:w-auto md:flex-1 mb-4 md:mb-0">
          <Link to="/" className="text-xl text-foreground font-semibold">
            MZ
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <AnimatedThemeToggler />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <ul className="hidden md:flex md:flex-none items-center justify-center gap-1 text-sm text-muted-foreground font-medium font-jakarta">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`relative px-4 py-2 block transition-colors hover:text-foreground ${
                  isActive(item.path) ? "text-foreground" : ""
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <m.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
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
        </ul>

        <div className="hidden md:flex md:flex-1 items-center justify-end gap-3">
          <AnimatedThemeToggler />
          <button
            onClick={handleDownload}
            className="font-jakarta text-sm px-5 py-2 rounded-full text-background font-medium bg-foreground border border-foreground hover:bg-background hover:text-foreground transition-colors"
          >
            Resume
          </button>
        </div>
      </m.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

export default NavbarDefault;
