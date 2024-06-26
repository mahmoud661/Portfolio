import data from "../images/certificates/CertificateData";
import "../Certificate.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import ScrollAnimation from "./scrollanimate";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

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
                <ScrollAnimation
                  direction={index % 2 === 0 ? "_right" : ""}
                  key={index}
                >
                  <div className="certificate">
                    <PhotoView src={item}>
                      <LazyLoadImage
                        src={item}
                        alt="certificate"
                        className="cer_image"
                        effect="blur"
                      />
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
