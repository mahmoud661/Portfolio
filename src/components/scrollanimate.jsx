// ScrollAnimation.js
import React, { useRef, useEffect, useCallback } from "react";
import "../ScrollAnimation.css";

const ScrollAnimation = ({ children, direction }) => {
  const targetRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      } else {
        entry.target.classList.remove("animate");
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    const currentTarget = targetRef.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersection]);

  return (
    <div
      className={`scroll-animation-container${direction || ""}`}
      ref={targetRef}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
