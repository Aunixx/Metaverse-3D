import { Html } from "@react-three/drei";
import "./plotLead.scss";
import smallImg from "../../assets/small-land-deed.png";
import mediumImg from "../../assets/medium-land-deed.png";
import largeImg from "../../assets/large-land-deed.png";
import { MdOutlineClose } from "react-icons/md";

export const PlotLead = ({ plotLeads, setPlotLeads, currentPlot }) => {
  return (
    <>
      {plotLeads && (
        <Html wrapperClass="plotlead-wrapper">
          <div className="plotlead-content">
            <div className="plotlead">
              <div className="top-section">
                <div>
                  <span className="plotId">
                    #KC00{currentPlot.plotId}-
                    {currentPlot.size === "small"
                      ? "S"
                      : currentPlot.size === "medium"
                      ? "M"
                      : "L"}
                  </span>
                  {/* <div className="coordinates">
                    <span className="plotLong">
                      Longitude:{" "}
                      {(32.95 + (currentPlot.position.y * 3.475) / 100).toFixed(
                        4
                      )}
                      {"9\xB0"}
                    </span>
                    <span className="plotLong">
                      Latitude:{" "}
                      {(4.425 + (currentPlot.position.x * 3.475) / 100).toFixed(
                        4
                      )}
                      {"9\xB0"}
                    </span>
                  </div> */}
                </div>
                <button
                  className="close-btn"
                  onClick={() => setPlotLeads(false)}
                >
                  <MdOutlineClose color="white" />
                </button>
              </div>
              <img
                src={
                  currentPlot.size === "small"
                    ? smallImg
                    : currentPlot.size === "medium"
                    ? mediumImg
                    : largeImg
                }
              />
            </div>
          </div>
        </Html>
      )}
    </>
  );
};
