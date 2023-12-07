import React, { useState,useEffect } from "react";

const HoverMouseDiv = (props) => {

      const [hovered, setHovered] = useState(false);
      const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
      const [coords, setCoords] = useState({ x: 0, y: 0 });

      useEffect(() => {
        const handleWindowMouseMove = (event) => {
          setCoords({
            x: event.clientX,
            y: event.clientY,
          });
        };
        window.addEventListener("mousemove", handleWindowMouseMove);

        return () => {
          window.removeEventListener("mousemove", handleWindowMouseMove);
        };
      }, []);

const handleMouseEnter = () => {
  setHovered(true);
};

const handleMouseLeave = () => {
  setHovered(false);
};

const handleMouseMove = (e) => {
  setMousePosition(coords);
};

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <p
        className="hover_able_text"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {props.title}
      </p>
      <div
        className={`hoverd_text ${hovered ? "" : "hidden"}`}
        style={{
          left: `${mousePosition.x + 10}px`,
          top: `${mousePosition.y + 20}px`,
          backgroundColor:`${props.backgroundColor}`,
        }}
      >
        {props.text}
      </div>
    </div>
  );
};

export default HoverMouseDiv;
