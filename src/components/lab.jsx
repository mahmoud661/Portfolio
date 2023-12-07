import React from "react";
import HoverMouseDiv from "./hoverMouseDiv";
const Lab = () => {
  return (
    <div className="section" id="lab">
      <div className="line">
        <div className="line_head_div_start">
          <div className="line_head"></div>
          <div className="line_text">Lab</div>
        </div>
      </div>
      <div className="lab_projects">
        <div className="labs">
          <div className="lab_title">web development</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <HoverMouseDiv
              title="toDo-list "
              backgroundColor="black"
              text="The To-Do List app is a task management tool designed to help users organize and prioritize their daily activities. With a simple interface, it allows users to create, edit, and check off tasks efficiently. "
            />
            <HoverMouseDiv
              title="Keeper "
              text="Keeper is a user-friendly note-taking app that allows easy creation, editing, and organization of digital notes."
              backgroundColor="black"
            />
            <HoverMouseDiv
              title="wheather_project"
              backgroundColor="black"
              text="The Weather Project is a weather forecasting application providing users with real-time weather updates"
            />
            <HoverMouseDiv
              title="postMe"
              text="Post Me is a social platform that allows users to share and post their content seamlessly. "
              backgroundColor="black"
            />
            <HoverMouseDiv
              title="Wiki API"
              text="An app leveraging a Wiki API enables users to explore and retrieve dynamic wiki content seamlessly."
              backgroundColor="black"
            />
          </div>
        </div>
        <div className="labs">
          <div className="lab_title">Games</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <HoverMouseDiv
              title="Quick Action project"
              text="Fast-paced 2D action game in Unreal Engine."
              backgroundColor="black"
            />
            <HoverMouseDiv
              title="Mash Runner Project"
              text="Mash Runner Project is an exciting Unreal Engine game combining fast-paced action with endless runner mechanics."
              backgroundColor="black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
