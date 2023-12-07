import "../social.css"
export default function Social(props){

return (
  <div className="tooltip-container">
    <div
      style={{ color: props.color, borderColor: props.color }}
      className="text_social"
    >
      <a
        target="blank"
        style={{ color: props.color, borderColor: props.color }}
        className="icon_social"
        href={props.social_link}
      >
        <div
          style={{ color: props.color, borderColor: props.color }}
          className="layer_social"
        >
          <span style={{ color: props.color, borderColor: props.color }}></span>
          <span style={{ color: props.color, borderColor: props.color }}></span>
          <span style={{ color: props.color, borderColor: props.color }}></span>
          <span style={{ color: props.color, borderColor: props.color }}></span>
          <span
            style={{ color: props.color, borderColor: "#ffffff00" }}
            className="fab fa-linkedin"
          >
            {props.social_img}
          </span>
        </div>
        <div
          style={{ color: props.color, borderColor: props.color }}
          className="text_social"
        >
          {props.social_name}
        </div>
      </a>
    </div>
  </div>
);

}