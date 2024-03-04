import React from "react";
import "../crad.css";
import Card from "./card";
import Conversa_main from "../images/projects/Conversa_main.png";
import TimeLessTales from "../images/projects/TimeLessTales.png";
import StayTuned from "../images/StayTuned.gif";
const Projects = () => {
  
  return (
    <div className="section" id="projects">
      <div className="line">
        <div className="line_head_div_start">
          <div className="line_head"></div>
          <div className="line_text">Projects</div>
        </div>
      </div>
      <div className="projects">
        <div className="Games">Games</div>
        <div className="game_div">
          <Card
            animDirection="_right"
            title="RetroRun"
            tec={["Unreal Engine 5", "PaperZD", "Aseprite", "C++"]}
            des_out="2D game platform"
            des="smaple 2D game platform ,where i used new plugin in unreal engin 5 to handel 2d assets."
            link={<p style={{ color: "#ff332f" }}>not available</p>}
          ></Card>
          <Card
            title="Project Eon"
            des_out="2D action game"
            tec={["Unreal Engine 5", "C++"]}
            image={StayTuned}
            link={
              <p style={{ color: "#ff332f" }}>
                not available yet stay stay tuned
              </p>
            }
          ></Card>
        </div>
      </div>
      <div className="projects">
        <div className="webApp">WebApp</div>
        <div className="game_div">
          <Card
            title="Conversa"
            des_out="Real-Time Chat"
            circleColor="#092d5cd0"
            image={Conversa_main}
            des="Conversa is a highly secure real-time chat application, featuring end-to-end encryption, robust user authentication, and secure communication protocols to ensure the privacy and integrity of user conversations."
            link={
              <a href="https://conversa-frontend.vercel.app/">
                visit Conversa from here
              </a>
            }
            tec={[
              "Node JS",
              "GitHub",
              "Express JS",
              "MongoDB",
              "NPM",
              "Bootstrap",
              "Socket.io",
              "React JS",
            ]}
          ></Card>
          <Card
            animDirection="_right"
            title="TimeLess Tales"
            des_out="A blog site"
            circleColor="#676767d0"
            image={TimeLessTales}
            link={
              <a href="https://timelesstales.cyclic.app/">
                visit TamlessTales from here
              </a>
            }
            des=" A blog site for Games stories, as this blog unfolds enchanting stories for gaming enthusiasts."
            tec={[
              "Node.js",
              "MongoDB",
              "Express",
              "CSS",
              "GitHub",
              "HTML",
              "EJS",
              "NPM",
            ]}
          ></Card>
        </div>
      </div>
    </div>
  );
};

export default Projects;
