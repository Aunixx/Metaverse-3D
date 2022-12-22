import "./loader.scss";

export default function Loader() {
  return (
    <>
      <div className="loader">
        <h1 className="loaderHeading">Earthers, Welcome to Kiirus</h1>
        <p className="loaderParagraph">
          A planet that is envisioned as a hyper-realistic, 3D, video game
          paradise. Famous for the intergalactic hyper-racing event, Nitro
          League Tournaments. Be a part of Kiirus’s first official chance based
          gameplay on blockchain technology.
        </p>
        <span className="loaderHeading">Live - Race - Own</span>
        <span className="loaderText">Loading</span>
        <div className="progress-bar">
          <div className="progress-bar-value"></div>
        </div>
      </div>
    </>
  );
}
