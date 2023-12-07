import React, { useState } from "react";
import "../burger.css";

export default function Burger() {
  const [isChecked, setChecked] = useState(false);

  const handleLinkClick = () => {
    // Set the checkbox state to unchecked when a link is clicked
    setChecked(false);
  };

  return (
    <div className="burger_div">
      <label className="burger">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setChecked(!isChecked)}
        />
        <div className="checkmark">
          <span></span>
          <span></span>
          <span></span>
          <div className="burger_navi">
            <div>
              <div className="navi_buttons">
                {/* Add onClick event handler to each link */}
                <a href="#start" onClick={handleLinkClick}>
                  Start
                </a>
                <a href="#About" onClick={handleLinkClick}>
                  About
                </a>
                <a href="#projects" onClick={handleLinkClick}>
                  Projects
                </a>
                <a href="#lab" onClick={handleLinkClick}>
                  Lab
                </a>
                <a href="#contact" onClick={handleLinkClick}>
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}
