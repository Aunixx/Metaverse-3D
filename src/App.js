import "./style.scss";

import { Canvas } from "@react-three/fiber";
import Globe from "./globe.js";
import { Suspense, useState, useEffect, useRef } from "react";
import { Html, useProgress, OrthographicCamera } from "@react-three/drei";
import Celeris from "./maps/celeris";
import Ourobora from "./maps/ourobora";
import KirrusMap from "./maps/kirrus";
import Loader from "./components/loader/loader";

export default function App() {
  const [isMapView, setIsMapView] = useState("");
  const [kirrusView, setKirrusView] = useState("globe");

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Canvas flat>
          {isMapView === "" && kirrusView === "globe" && (
            <fog
              attach="fog"
              args={
                window.innerWidth < 600
                  ? ["#cff4fe", 8, 20]
                  : ["#cff4fe", 2, 27.5]
              }
            />
          )}
          <color args={["black"]} attach="background" />
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
              <KirrusMap
                setKirrusView={setKirrusView}
                setIsMapView={setIsMapView}
              />
            </OrthographicCamera>
          )}
        </Canvas>
      </Suspense>
    </>
  );
}
