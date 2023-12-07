import Word from "./switchingwords";
const Head = () => {
 

  return (
    <div className="section" id="start">
      <div
        className="line"
        style={{
          height: "70%",
          top: "30%",
        }}
      >
        <div className="line_head_div_start" style={{ top: "-3%" }}>
          <div className="line_head"></div>
          <div className="line_text">start</div>
        </div>
        <a href="#About" className="mouse">
          <div className="scroll"></div>
        </a>
      </div>
      <div className="headD1">
        <div className="content start_anim">
          <div className="start_sent_div">
            <p className="start_sent">
              Hi, My name is{" "}
              <span
                className="start_anim_word userName"
                style={{ color: "#801f1d" }}
              >
                Mahmoud Zuriqi
              </span>
            </p>
            <span className="start_sent">
              and I <span className="design_word">design</span> and develop
            </span>
            {" "}
            <Word />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Head;
