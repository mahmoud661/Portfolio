import data from "../images/certificates/CertificateData";
import "../Certificate.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import ScrollAnimation from "./scrollanimate";
export default function Certificates() {
  return (
    <div className="section">
      <div className="line">
        <div className="line_head_div_start">
          <div className="line_head"></div>
          <div className="line_text">Certificates</div>
        </div>
      </div>
      <div className="certificates">
        <div className="certificates_container">
          <PhotoProvider>
            {data.map((item, index) => {
              return (
                <ScrollAnimation direction={index % 2 === 0 ? "_right" : ""}>
                  <div key={index} className="certificate">
                    <PhotoView src={item}>
                      <img src={item} alt="certificate" className="cer_image" />
                    </PhotoView>
                  </div>
                </ScrollAnimation>
              );
            })}
          </PhotoProvider>
        </div>
      </div>
    </div>
  );
}
