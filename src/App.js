import "./style.css";

import { Canvas } from "@react-three/fiber";
import Globe from "./globe.js";
import { Suspense, useState } from "react";
import Map from "./map.js";
import { OrthographicCamera } from "@react-three/drei";
import { Html, OrbitControls } from "@react-three/drei";

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
  const [isMapView, setIsMapView] = useState(false);
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
          {isMapView ? (
            <OrthographicCamera
              makeDefault
              position={[0, 0, 8]}
              zoom={8}
              near={0}
              far={8}
            >
              <Map />
            </OrthographicCamera>
          ) : (
            <Globe setIsMapView={setIsMapView} />
          )}
        </Suspense>
      </Canvas>

      {/* <Canvas>
      </Canvas> */}
      {/* <Canvas>
        
      </Canvas> */}
    </>
  );
}
