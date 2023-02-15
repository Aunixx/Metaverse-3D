import "./style.scss";

import { Canvas, useThree, useLoader } from "@react-three/fiber";
import Globe from "./globe.jsx";
import { Suspense, useState, useEffect, useRef, useLayoutEffect } from "react";
import { Html, useProgress, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import Celeris from "./maps/celeris";
import Ourobora from "./maps/ourobora";
import KirrusMap from "./maps/kirrus.jsx";
import Loader from "./components/loader/loader";
import Typewriter from "typewriter-effect";
import TypeWriterEffect from "react-typewriter-effect";
import Araba from "./assets/space-sound.mp3";
import { gsap } from "gsap";

new Typewriter("#typewriter", {
  strings: ["Hello", "World"],
  autoStart: true,
});

function PreLoader({ preloaderHandler }) {
  return (
    <Html wrapperClass="preloaderWrapper">
      <TypeWriterEffect
        textStyle={{
          fontFamily: "var(--Magitral-Book)",
          textTransform: "uppercase",
          marginBottom: "24px !important",
        }}
        startDelay={0}
        cursorColor="#FFFFFF00"
        text="Earthers, Welcome to Kiirus"
        typeSpeed={30}
      />

      <button classname="mainExploreBtn" onClick={() => preloaderHandler()}>
        Explore
      </button>
    </Html>
  );
}
function Sound({ url, preloader, soundOn, kirrusView }) {
  console.log(kirrusView);
  const sound = useRef();
  const { camera } = useThree();
  const [listener] = useState(() => new THREE.AudioListener());
  const buffer = useLoader(THREE.AudioLoader, url);

  useEffect(() => {
    sound.current.setBuffer(buffer);
    sound.current.setRefDistance(1);
    sound.current.setLoop(true);
    sound.current.play();
    if (preloader === true || kirrusView !== "globe") {
      sound.current.pause();
    } else if (soundOn === false) {
      sound.current.pause();
    } else {
      sound.current.play();
    }
    camera.add(listener);
    return () => camera.remove(listener);
  }, [soundOn, kirrusView]);
  return <positionalAudio ref={sound} args={[listener]} />;
}

export default function App() {
  const [isMapView, setIsMapView] = useState("");
  const [kirrusView, setKirrusView] = useState("globe");
  const [preloader, setPreloader] = useState(true);
  let [soundOn, setSoundOn] = useState(false);

  function preloaderHandler() {
    setPreloader(false);
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Canvas>
          {preloader && <PreLoader preloaderHandler={preloaderHandler} />}
          {/* {isMapView === "" && kirrusView === "globe" && (
            <fog
              attach="fog"
              args={
                window.innerWidth < 600
                  ? ["#cff4fe", 8, 20]
                  : ["#cff4fe", 2, 27.5]
              }
            />
          )} */}
          <Sound
            url={Araba}
            preloader={preloader}
            soundOn={soundOn}
            kirrusView={kirrusView}
          />
          <color args={["black"]} attach="background" />
          {isMapView === "Celeris" ? (
            <>
              {/* <OrthographicCamera
                makeDefault
                position={[0, 0, 9]}
                zoom={9}
                near={0}
                far={9}
              > */}
              <Celeris setIsMapView={setIsMapView} isMapView={isMapView} />
              {/* </OrthographicCamera> */}
            </>
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
            <Globe
              setIsMapView={setIsMapView}
              setKirrusView={setKirrusView}
              setPreloader={setPreloader}
              preloader={preloader}
              setSoundOn={setSoundOn}
              kirrusView={kirrusView}
              soundOn={soundOn}
            />
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
