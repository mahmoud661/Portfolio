import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import NavbarDefault from "./NavbarDefault";
import NavbarFixed from "./NavbarFixed";

function Navbar() {
  const [isScrollPast, setIsScrollPast] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const threshold = 300;
    
    if (!isTransitioning) {
      if (scrollPosition >= threshold && !isScrollPast) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsScrollPast(true);
          setIsTransitioning(false);
        }, 1);
      } else if (scrollPosition < threshold && isScrollPast) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsScrollPast(false);
          setIsTransitioning(false);
        }, 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrollPast, isTransitioning]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isScrollPast ? <NavbarFixed key="navbar-fixed" /> : <NavbarDefault key="navbar-default" />}
      </AnimatePresence>
    </>
  );
}

export default Navbar;