import "./loader.scss";

export default function Loader() {
  return (
    <>
      <div className="loader loader2 loader3">
        <span className="loaderText">Loading</span>
        <div className="progress-bar">
          <div className="progress-bar-value"></div>
        </div>
      </div>
    </>
  );
}
