import "./loader.scss";

export default function Loader() {
  return (
    <>
      <div className="loader">
        <span className="loaderText">Loading</span>
        <div className="progress-bar">
          <div className="progress-bar-value"></div>
        </div>
      </div>
    </>
  );
}
