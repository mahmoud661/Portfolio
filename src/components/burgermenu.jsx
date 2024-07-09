import React, { useState } from "react";
import "../burger.css";

export default function Burger() {
  const [isChecked, setChecked] = useState(false);

  const handleLinkClick = () => {
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
          <label class="hamburger">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setChecked(!isChecked)}
            />
            <svg viewBox="0 0 32 32">
              <path
                class="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path class="line" d="M7 16 27 16"></path>
            </svg>
          </label>
          <div className="burger_navi">
            <div>
              <div className="navi_buttons">
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
