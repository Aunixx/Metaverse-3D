import "./style.scss";

import { Canvas } from "@react-three/fiber";
import Globe from "./globe.js";
import { Suspense, useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Html, OrbitControls } from "@react-three/drei";
import Celeris from "./map/celeris";
import Ourobora from "./map/ourobora";
import KirrusMap from "./map/kirrus";

export function Loader() {
  return (
    <Html>
      <div className="loader">
        <div className="triforce-container">
          <div className="triforce"></div>
        </div>
      </div>
    </Html>
  );
}

export default function App() {
  const [isMapView, setIsMapView] = useState("");
  const [kirrusView, setKirrusView] = useState("globe");
  const position = {
    position: [0, 0, 8],
    zoom: [8],
    bottom: [-80],
    top: [80],
    left: [-80],
    right: [80],
    zoomOut: [0],
  };

  return (
    <>
      <Canvas>
        <color args={["black"]} attach="background" />
        <Suspense fallback={<Loader />}>
          {isMapView === "Celeris" ? (
            <OrthographicCamera
              makeDefault
              position={[0, 0, 9]}
              zoom={9}
              near={0}
              far={9}
            >
              <Celeris setIsMapView={setIsMapView} isMapView={isMapView} />
            </OrthographicCamera>
          ) : isMapView === "Ourobora" ? (
            <OrthographicCamera
              makeDefault
              position={[0, 0, 9]}
              zoom={9}
              near={0}
              far={9}
            >
              <Ourobora setIsMapView={setIsMapView} isMapView={isMapView} />
            </OrthographicCamera>
          ) : isMapView === "" && kirrusView === "globe" ? (
            <Globe setIsMapView={setIsMapView} setKirrusView={setKirrusView} />
          ) : (
            <OrthographicCamera
              makeDefault
              position={[0, 0, 4]}
              zoom={4}
              near={0}
              far={4}
            >
              <KirrusMap setKirrusView={setKirrusView} />
            </OrthographicCamera>
          )}
        </Suspense>
      </Canvas>
    </>
  );
}
