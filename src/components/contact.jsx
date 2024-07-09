import React, { useState, useRef } from "react";
import Social from "./social";
import insta from "../images/instagram.svg";
import Lottie from "react-lottie";
import emailjs from "emailjs-com";
import EmailSendingAnimation from "../animation/EmailSending.json";
import "../contact.css";

const Contact = () => {
  const form = useRef();

  // const [animationTriggered, setAnimationTriggered] = useState(false);
  // const [hovered, setHovered] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: EmailSendingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSendButtonClick = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_0qx5z5f",
        "template_cf1js4i",
        form.current,
        "qoEKlQm9MZ-8noru1"
      )
      .then(
        (result) => {
          console.log(result.text);
          setIsStopped(true);
          setIsStopped(false);
         
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  // const handleAnimationComplete = () => {
  //   setAnimationTriggered(false); // Reset animation trigger
  // };

  // const handleMouseEnter = () => {
  //   setHovered(true);
  // };

  // const handleMouseLeave = () => {
  //   setHovered(false);
  // };

  return (
    <div className="section contact" id="contact">
      <div className="line">
        <div className="line_head_div_start">
          <div className="line_head"></div>
          <div className="line_text">Contact</div>
        </div>
      </div>

      <div className="SendingEmail">
        <div className="no-pointer-events">
          <Lottie
            options={defaultOptions}
            height={300}
            width={300}
            isStopped={isStopped}
            isPaused={isPaused}
          />
        </div>

        <div>
          <form
            ref={form}
            className="form-container"
            onSubmit={handleSendButtonClick}
          >
            <div className="form">
              <span className="heading">Get in touch</span>
              <input
                required
                placeholder="Name"
                type="text"
                name="user_name"
                className="input"
              />
              <input
                required
                placeholder="Email"
                id="mail"
                type="email"
                name="user_email"
                className="input"
              />
              <textarea
                required
                placeholder="Say Hello"
                rows="10"
                cols="30"
                id="message"
                name="message"
                className="textarea"
              ></textarea>
              <div className="button-container">
                <button type="submit" className="send-button">
                  Send
                </button>
                <div className="reset-button-container"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <h3>Social</h3>
      <div className="social_cont">
        <Social
          social_img={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-linkedin"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401m-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4" />
            </svg>
          }
          social_link="https://www.linkedin.com/in/mahmoud-zuriqi-228aa7248/?originalSubdomain=jo"
          social_name="linkedIn"
          color="#1da1f2"
        />
        <Social
          social_img={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-discord"
              viewBox="0 0 16 16"
            >
              <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
            </svg>
          }
          social_link="https://discordapp.com/users/doooo1153"
          social_name="Discord"
          color="#5865F2"
        />
        <Social
          social_img={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          }
          social_link="https://github.com/mahmoud661"
          social_name="GitHub"
          color="#24292e"
        />
        <Social
          social_img={<img src={insta} alt="instagram" />}
          social_link="https://www.instagram.com/_doo0o/"
          social_name="instagram"
          color="#ac3080"
        />
      </div>

      {/* <div
        className={hovered ? "one-div" : "one-div one-div_animation"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={hovered ? "social" : "social_card hidden"}></div>
      </div> */}
    </div>
  );
};

export default Contact;
