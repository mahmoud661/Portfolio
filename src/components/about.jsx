import HoverMouseDiv from "./hoverMouseDiv";
import webMaster from "../images/webmaster.png";
import pioneers from "../images/pioneers.svg"
import skills from "../images/skills/skills";
import ScrollAnimation from "./scrollanimate";
const About = () => {
  
  
 



  return (
    <div className="section" style={{ backgroundColor: "#202020" }} id="About">
      <div className="line">
        <div className="line_head_div_start">
          <div className="line_head"></div>
          <div className="line_text">About</div>
        </div>
      </div>
      <div className="about">
      <ScrollAnimation><p>
          Hello! I'm Mahmoud Zuriqi, a passionate Data Science and AI student
          currently pursuing my education at{" "}
          <a href="https://www.ahu.edu.jo/Homeen.aspx" target="blank">
            Al-Hussin Bin Talal University
          </a>{" "}
          in Ma'an-Jordan. I was born on July 13, 2003, and I am enthusiastic
          about the transformative potential of technology in our rapidly
          evolving world.
        </p></ScrollAnimation>
        
        <p className="about_title">Experience:-</p>
        <div className="experience">
       <div>
            <HoverMouseDiv
              backgroundColor="white"
              title={
                <a target="blank" href="https://www.webmaster.com.jo/">
                  Jordan WebMaster
                </a>
              }
              text={
                <img width={250} height={150} src={webMaster} alt="webmaster" />
              }
            />

            <span className="experience_date">
              Trainee July 2022 - September 2022
            </span>
          </div>
          
          <ScrollAnimation><p className="experience_details">
            I had the privilege of being a trainee at Jordan WebMaster, where I
            had the opportunity to apply my theoretical knowledge in a
            real-world setting. This experience allowed me to sharpen my skills
            and gain valuable insights into the practical aspects in web
            development.
          </p></ScrollAnimation>
          
        </div>
        <div className="experience">
       <div>
            <HoverMouseDiv
              backgroundColor="white"
              title={
                <a target="blank" href="https://www.pioneersacademy.com/">
                  Pioneer Acadimy
                </a>
              }
              text={
                <img
                  width={250}
                  height={150}
                  src={pioneers}
                  alt="pioneers Academy"
                />
              }
            />

            <span className="experience_date">
              {" "}
              Trainee July 2023 - September 2023
            </span>
          </div>
          
          <ScrollAnimation><p className="experience_details">
            At Pioneer Academy, I focused on Social Media Marketing, digital
            content creation, community management, and advertising. I honed
            skills in strategy, content creation, and learned about the
            advertising industry's dynamics.
          </p></ScrollAnimation>
          
        </div>
        <p className="about_title">Skills:-</p>
        <div className="skills">
          {skills.map((item,index) => {
            return (
              <ScrollAnimation
                key={index}
                direction={index % 2 === 0 ? "_right" : ""}
              >
                <div className="skill">
                  <img
                    className="skill_img"
                    src={item.image}
                    alt={item.title}
                  />
                  <span>{item.title}</span>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
        {/* <p style={{ color: "#922321", fontSize:"16px" }}>the campanies that I trained in </p> */}
      </div>
    </div>
  );
};

export default About;
