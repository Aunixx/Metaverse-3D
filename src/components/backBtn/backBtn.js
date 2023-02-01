import { Html } from "@react-three/drei";
import { GlobeView } from "../../assets/svg";

export default function BackBtn({ setIsMapView, controls }) {
  return (
    <Html wrapperClass="changeViewWrapper">
      <div className="changeViewContent beforeUnset">
        <button
          onClick={() => {
            setIsMapView("");
          }}
        >
          <GlobeView color={"white"} />
        </button>
      </div>
    </Html>
  );
}
