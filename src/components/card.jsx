import React from "react";
import "../crad.css";
import ScrollAnimation from "./scrollanimate";
import game1 from "../images/game1.gif";
import { useState,useEffect } from "react";
const Card = (props) => {
  const [selected, setSelected] = useState(false);

  function onClick() {
    setSelected(!selected);
  }

  const titlesToFilter = Array.isArray(props.tec) ? props.tec : [];
 
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [selected]);
  return (
    <div>
      {selected ? (
        <div>
          <div onClick={onClick} className={`container `}>
            <div className="canvas">
              <div className="tracker tr-1"></div>
              <div className="tracker tr-2"></div>
              <div className="tracker tr-3"></div>
              <div className="tracker tr-4"></div>
              <div className="tracker tr-5"></div>
              <div className="tracker tr-6"></div>
              <div className="tracker tr-7"></div>
              <div className="tracker tr-8"></div>
              <div className="tracker tr-9"></div>
              <div className="tracker tr-10"></div>
              <div className="tracker tr-11"></div>
              <div className="tracker tr-12"></div>
              <div className="tracker tr-13"></div>
              <div className="tracker tr-14"></div>
              <div className="tracker tr-15"></div>
              <div className="tracker tr-16"></div>
              <div className="tracker tr-17"></div>
              <div className="tracker tr-18"></div>
              <div className="tracker tr-19"></div>
              <div className="tracker tr-20"></div>
              <div className="tracker tr-21"></div>
              <div className="tracker tr-22"></div>
              <div className="tracker tr-23"></div>
              <div className="tracker tr-24"></div>
              <div className="tracker tr-25"></div>
              <div id="card" className="card">
                <div
                  className="circle"
                  style={{
                    background: `radial-gradient(${props.circleColor}, #0000007c)`,
                  }}
                ></div>
                <div
                  className="circle"
                  style={{
                    background: `radial-gradient(${props.circleColor}, #0000007c)`,
                  }}
                ></div>
                <div className={`  card-inner`}>
                  <img className="game_gif" src={props.image || game1} alt="" />
                  <h2>{props.title}</h2>
                  <div>{props.des_out}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="selected_card">
            <button onClick={onClick} className="close_button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="white"
                className="bi bi-arrow-left svgIcon"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>
            </button>
            <div className="card_inside_div">
              <div className="card_image_inside_div">
                <img
                  className="card_image_inside"
                  height={190}
                  src={props.image || game1}
                  alt=""
                />
              </div>
              <h1>{props.title}</h1>
              <div className="description">{props.des}</div>
              <div className="visitLink">{props.link}</div>
              <div className="technology skills">
                {titlesToFilter.map((item, index) => {
                  return (
                    <div className="skill" key={index}>
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ScrollAnimation direction={props.animDirection}>
          <div onClick={onClick} className={`container`}>
            <div className="canvas">
              <div className="tracker tr-1"></div>
              <div className="tracker tr-2"></div>
              <div className="tracker tr-3"></div>
              <div className="tracker tr-4"></div>
              <div className="tracker tr-5"></div>
              <div className="tracker tr-6"></div>
              <div className="tracker tr-7"></div>
              <div className="tracker tr-8"></div>
              <div className="tracker tr-9"></div>
              <div className="tracker tr-10"></div>
              <div className="tracker tr-11"></div>
              <div className="tracker tr-12"></div>
              <div className="tracker tr-13"></div>
              <div className="tracker tr-14"></div>
              <div className="tracker tr-15"></div>
              <div className="tracker tr-16"></div>
              <div className="tracker tr-17"></div>
              <div className="tracker tr-18"></div>
              <div className="tracker tr-19"></div>
              <div className="tracker tr-20"></div>
              <div className="tracker tr-21"></div>
              <div className="tracker tr-22"></div>
              <div className="tracker tr-23"></div>
              <div className="tracker tr-24"></div>
              <div className="tracker tr-25"></div>
              <div id="card" className="card">
                <div
                  style={{
                    background: `radial-gradient(${props.circleColor}, #0000007c)`,
                  }}
                  className="circle"
                ></div>

                <div
                  className="circle"
                  style={{
                    background: `radial-gradient(${props.circleColor}, #0000007c)`,
                  }}
                ></div>

                <div className={`card-inner`}>
                  <img
                    height={100}
                    className="game_gif"
                    src={props.image || game1}
                    alt=""
                  />
                  <h2>{props.title}</h2>
                  <div>{props.des_out}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      )}
    </div>
  );
};

export default Card;
