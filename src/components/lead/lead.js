import { AiOutlineClose } from "react-icons/ai";
import "./lead.scss";

export default function Lead({
  landImg,
  landName,
  landDescription,
  setIsMapView,
  handleMouseLeave,
  handleMouseOver,
  controls,
}) {
  return (
    <div className="leadContent">
      <div
        className="imageSection"
        onMouseLeave={() => handleMouseLeave(0.0007, false)}
        onMouseOver={() =>
          handleMouseOver(
            0,
            "Ourobora",
            OuroboraLand,
            "Ourobora is a small island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef that has rising stones forming the cardano sea.",
            true
          )
        }
        onTouchStart={() => handleMouseLeave(0.0007, false)}
      >
        <img src={landImg} />
      </div>
      <div
        className="contentSection"
        onMouseLeave={() => handleMouseLeave(0.0007, false)}
        onTouchStart={() => handleMouseLeave(0.0007, false)}
        onMouseOver={() =>
          handleMouseOver(
            0,
            "Ourobora",
            OuroboraLand,
            "Ourobora is a small island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef that has rising stones forming the cardano sea.",
            true
          )
        }
      >
        <button
          className="cross-btn"
          onClick={() => handleMouseLeave(0.0007, false)}
        >
          <AiOutlineClose />
        </button>
        <h2 className="landName">{landName}</h2>
        <img src={landImg} className="img-mob" />
        <h5 className="description">Description</h5>
        <p className="paragraph">{landDescription}</p>
        <div className="btnSection">
          <button
            onClick={() => {
              setIsMapView(landName);
              controls.reset();
            }}
            onTouchStart={() => setIsMapView(landName)}
            className="exploreBtn"
          >
            Explore
          </button>
          <button className="buyBtn">Buy on opensea</button>
        </div>
      </div>
    </div>
  );
}
