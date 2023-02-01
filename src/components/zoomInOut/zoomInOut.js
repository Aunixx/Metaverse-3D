import "./zoomInOut.scss";
import { Html } from "@react-three/drei";
import { Minus, Plus } from "../../assets/svg";

export default function ZoomInOut({ camera, minValue, maxValue, zoomValue }) {
  return (
    <Html wrapperClass="changeViewWrapper right">
      <div className="changeViewContent">
        <button
          onClick={() =>
            camera.zoom + zoomValue <= maxValue
              ? (camera.zoom += zoomValue)
              : (camera.zoom = maxValue)
          }
          disabled={camera.zoom === maxValue}
        >
          <Plus color={camera.zoom === maxValue ? "#A1A7B0" : "white"} />
        </button>
        <button
          onClick={() =>
            camera.zoom - zoomValue >= minValue
              ? (camera.zoom -= zoomValue)
              : (camera.zoom = minValue)
          }
          disabled={camera.zoom === minValue}
        >
          <Minus color={camera.zoom === minValue ? "#A1A7B0" : "white"} />
        </button>
      </div>
    </Html>
  );
}
