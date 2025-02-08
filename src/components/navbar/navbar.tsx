import { useEffect, useState } from "react";
import NavbarDefault from "./NavbarDefault";
import NavbarFixed from "./NavbarFixed";

function Navbar() {
  const [isScrollPast, setIsScrollPast] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const threshold = 300;
    setIsScrollPast(scrollPosition >= threshold);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="relative">
        <NavbarDefault className={isScrollPast ? "invisible" : "visible"} />
        <NavbarFixed visible={isScrollPast} />
      </div>
    </>
  );
}

export default Navbar;