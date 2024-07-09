import Head from "../components/head";
import Projects from "../components/projects";
import Lab from "../components/lab";
import Contact from "../components/contact";
import About from "../components/about";
import "../App.css";
import { useEffect, useState } from "react";
import Burger from "../components/burgermenu";
import Certificates from "../components/Certificates";
function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollValue) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setScrollValue(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollValue]);

  return (
    <div>
      <div className="scrollbar" id="style-1">
        <div className="force-overflow"></div>
      </div>
      <div className={`Bar ${scrolled ? "scrolled" : ""}`}>
        <div className="Bar_title">
          <span style={{ color: "#801f1d" }}>{"<"}</span>
          {"Doooo"}
          <span style={{ color: "#801f1d" }}>{"/>"}</span>
        </div>
        <div className="navigation">
          <a href="#start">Start</a>
          <a href="#About">About</a>

          <a href="#projects">Projects</a>

          <a href="#lab">Lab</a>
          <a href="#contact">Contact</a>
        </div>
        <Burger />
      </div>

      <Head></Head>
      <About></About>
      <Projects></Projects>
      <Lab></Lab>
      <Certificates></Certificates>
      <Contact></Contact>
    </div>
  );
}

export default Home;
