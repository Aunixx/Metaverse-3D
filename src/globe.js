import { useThree, extend, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import map from "./assets/cardano-min.png";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { BackSide, CineonToneMapping } from "three";
import bumpMap from "./assets/cardano-bump.png";
import galaxyImg from "./assets/galax-6.png";
import { Perf } from "r3f-perf";
import { Html, OrbitControls, PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect } from "react";
import { GlobeView, MapView } from "./assets/svg";
import Lead from "./components/lead/lead";
import CelerisLand from "./assets/celeris-min.png";
import OuroboraLand from "./assets/ourobora-min.png";
import ZoomInOut from "./components/zoomInOut/zoomInOut";
import Araba from "./assets/space-sound.mp3";
import { StyledLoadbarSound } from "./components/sound/soundStyled";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CelerisPlots from "./assets/celeris-plotting.svg";
import StarsBG from "./assets/Stars-background.png";

export default function Globe({
  setIsMapView,
  isMapView,
  setKirrusView,
  setPreloader,
  preloader,
  soundOn,
  setSoundOn,
  kirrusView,
}) {
  const { camera, gl } = useThree();
  const galaxyRef = useRef();
  const globeRef = useRef();
  const controls = useRef();
  const atmosphereRef = useRef();
  const globeGroupeRef = useRef();
  const [isLead, setIsLead] = useState({
    landImg: "",
    landName: "",
    landDescription: "",
    isViewLead: "",
  });
  const lightHolder = useRef();
  const [rotation, setRotation] = useState(0.0007);
  const [btnOneActive, setBtnOneActive] = useState(true);
  const [btnTwoActive, setBtnTwoActive] = useState(false);
  let [cameraZoom, setCameraZoom] = useState(1);
  // let [soundOn, setSoundOn] = useState(false);
  let [galaxyArgs, setGalaxyArgs] = useState([0.9, 64, 64]);
  const manager = new THREE.LoadingManager();
  const texture = useLoader(TextureLoader, map);
  const bump = useLoader(TextureLoader, bumpMap);
  const galaxy = useLoader(TextureLoader, galaxyImg);

  function location(p) {
    let lat = (90 - p.lat) * (Math.PI / 180);
    let lng = (p.lng + 180) * (Math.PI / 180);
    let x = -(Math.sin(lat) * Math.cos(lng));
    let z = Math.sin(lat) * Math.sin(lng);
    let y = Math.cos(lat);
    return {
      x,
      y,
      z,
    };
  }

  useEffect(() => {
    // camera.lookAt(globeGroupeRef.current.position);
    camera.rotation.set(1, 1, 1);

    camera.zoom = 8;
    globeGroupeRef.current.position.y = -1.1;
    globeGroupeRef.current.rotation.z = 5;
    if (!preloader) {
      galaxyRef.current.position.z = -10;
      gsap.to(galaxyRef.current.position, { z: 0, duration: 0.05 });
    }
    if (!preloader) {
      camera.zoom = 1;
      globeGroupeRef.current.position.y = 0;
      globeGroupeRef.current.rotation.z = 0;
      if (kirrusView === "globe") {
        setSoundOn(true);
      } else {
        setSoundOn(!soundOn);
      }
      // gsap.from(globeGroupeRef.current.position, { y: -1.1, duration: 2.5 });
      gsap.from(camera, { zoom: 8, duration: 3.5 });

      gsap.from(globeGroupeRef.current.position, {
        y: -1.1,
        duration: 1.5,
      });
      setGalaxyArgs([10, 64, 64]);
    }
  }, [!preloader]);

  let lat = 32.95;
  let lng = 7.425;
  let pin = { lat, lng };
  let pinPoint = location(pin);
  lat = -43;
  lng = -27;
  let pin2 = { lat, lng };
  let pinPoint2 = location(pin2);

  const handleMouseOver = (
    rotation,
    landName,
    landImg,
    landDescription,
    isViewLead
  ) => {
    setRotation(rotation);
    setIsLead({ landName, landImg, landDescription, isViewLead });
  };
  const handleMouseLeave = (rotation, isViewLead) => {
    setRotation(rotation);
    setIsLead({ isViewLead: isViewLead });
  };

  useFrame((state, delta) => {
    if (!preloader) {
      galaxyRef.current.rotation.y += 0.000075;
    }
    globeRef.current.rotation.y -= rotation;
    state.camera.lookAt(0, 0, 0);
    lightHolder.current.quaternion.copy(state.camera.quaternion);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.gl.toneMapping = CineonToneMapping;
    camera.updateProjectionMatrix();
  });

  return (
    <>
      {preloader ? (
        <fog
          attach="fog"
          args={
            window.innerWidth < 600 ? ["#cff4fe", 8, 20] : ["#cff4fe", 2, 27.5]
          }
        />
      ) : (
        <fog
          attach="fog"
          args={
            window.innerWidth < 600 ? ["#cff4fe", 8, 20] : ["#cff4fe", 7, 15]
          }
          side={THREE.BackSide}
        />
      )}
      {/* <Sound
        url={Araba}
        preloader={preloader}
        soundOn={soundOn}
        isMapView={isMapView}
      /> */}
      {
        <OrbitControls
          ref={controls}
          maxDistance={
            window.innerWidth < 600 && window.innerWidth > 450
              ? 2.5
              : window.innerWidth < 450
              ? 3.1
              : 2
          }
          maxZoom={2.1}
          enablePan={false}
          enableZoom={!preloader}
          enableRotate={!preloader}
          minDistance={
            window.innerWidth < 600 && window.innerWidth > 450
              ? 1.8
              : window.innerWidth < 450
              ? 2
              : 1.2
          }
          zoomSpeed={0.5}
          enableDamping={true}
        />
      }
      {preloader ? (
        <>
          {/* <directionalLight args={[0xffffff, 0.9]} position={[8, 8, 0]} /> */}
          <ambientLight args={[0xffffff, 0.1]} />
          <group ref={lightHolder}>
            <pointLight args={[0xffffff, 1.1]} position={[0, -0.005, -0.01]} />
          </group>
        </>
      ) : (
        <>
          <ambientLight args={[0xffffff, 0.01]} />
          <group ref={lightHolder}>
            <pointLight args={[0xffffff, 0.5]} position={[8, 8, 8]} />
          </group>
        </>
      )}
      <group ref={globeGroupeRef}>
        <mesh ref={globeRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            attach="material"
            map={texture}
            bumpMap={bump}
            bumpScale={preloader ? 0.04 : 0.09}
          />
          {!preloader && (
            <>
              {/* <Html
                position={[pinPoint.x + 0.02, pinPoint.y, pinPoint.z]}
                center
                wrapperClass="label"
                distanceFactor={1.5}
                sprite={true}
                scale={10}
              >
                <img src={CelerisPlots} />
              </Html> */}
              <Html
                className="pinPointWrapper"
                position={[pinPoint.x, pinPoint.y, pinPoint.z]}
                occlude={[globeRef]}
                center
                wrapperClass="label"
                distanceFactor={1.5}
                sprite={true}
              >
                <div className="pinPoint"></div>
              </Html>
              <Html
                position={[pinPoint.x + 0.01, pinPoint.y, pinPoint.z]}
                occlude={[globeRef]}
                center
                wrapperClass="label"
                distanceFactor={1.5}
                sprite={true}
              >
                <div
                  class="circlewrapper"
                  onMouseOver={() =>
                    handleMouseOver(
                      0,
                      "Celeris",
                      CelerisLand,
                      "Celeris is a small island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef that has rising stones forming the cardano sea.",
                      true
                    )
                  }
                  // onMouseLeave={() => handleMouseLeave(0.0007)}
                >
                  <div class="midcircle"></div>
                  <div class="circles">
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                    <div class="circle3"></div>
                  </div>
                </div>
              </Html>
              {isLead.landName === "Celeris" && (
                <Html
                  position={[pinPoint.x + 0.01, pinPoint.y, pinPoint.z]}
                  occlude={[globeRef]}
                  center
                  wrapperClass="locationCard"
                  sprite={true}
                  scale={0.6}
                >
                  <Lead
                    landImg={isLead.landImg}
                    landName={isLead.landName}
                    landDescription={isLead.landDescription}
                    setIsMapView={setIsMapView}
                    handleMouseLeave={handleMouseLeave}
                    handleMouseOver={handleMouseOver}
                    controls={controls.current}
                  />
                </Html>
              )}
              <Html
                position={[pinPoint2.x + 0.01, pinPoint2.y, pinPoint2.z]}
                occlude={[globeRef]}
                center
                wrapperClass="label"
                distanceFactor={1.5}
                sprite={true}
              >
                <div
                  class="circlewrapper"
                  onMouseOver={() =>
                    handleMouseOver(
                      0,
                      "Ourobora",
                      OuroboraLand,
                      "Ourobora is a small island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef that has rising stones forming the cardano sea.",
                      true
                    )
                  }
                  // onMouseLeave={() => handleMouseLeave(0.0007)}
                >
                  <div class="midcircle"></div>
                  <div class="circles">
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                    <div class="circle3"></div>
                  </div>
                </div>
              </Html>
              {isLead.landName === "Ourobora" && (
                <Html
                  position={[pinPoint2.x + 0.01, pinPoint2.y, pinPoint2.z]}
                  occlude={[globeRef]}
                  center
                  wrapperClass="locationCard"
                  // distanceFactor={1.5}
                  sprite={true}
                >
                  <Lead
                    landImg={isLead.landImg}
                    landName={isLead.landName}
                    landDescription={isLead.landDescription}
                    setIsMapView={setIsMapView}
                    handleMouseLeave={handleMouseLeave}
                    handleMouseOver={handleMouseOver}
                  />
                </Html>
              )}
            </>
          )}
        </mesh>
        {preloader && (
          <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
              vertexShader={`
            
            varying vec3 vertexNormal;
              void main(){
                vertexNormal = normalize(normalMatrix * normal);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
              fragmentShader={`
            varying vec3 vertexNormal;
                void main(){
                    float intensity = pow(0.4 - dot(vertexNormal, vec3(0, 0, 1.0)), 8.5);
                    gl_FragColor = vec4(0.455,0.8,0.957, 1.0) * intensity;
                    // gl_FragColor = vec4(0.353,0.737,0.847, 1.0) * intensity;
                    // gl_FragColor = vec4(0.11,0.639,0.925, 1.0) * intensity;
                    // gl_FragColor = vec4(0.137,0.537,0.855, 1.0) * intensity;
                    // gl_FragColor = vec4(0.059,0.369,0.612, 1.0) * intensity;
                    // gl_FragColor = vec4(0.4, 0.6, 1.0, 1.0) * intensity;
                }
              `}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
      {!preloader && (
        <mesh ref={galaxyRef}>
          <sphereGeometry args={galaxyArgs} />
          <meshBasicMaterial
            attach="material"
            map={galaxy}
            side={BackSide}
            transparent
            opacity={1}
          />
        </mesh>
      )}
      <Html wrapperClass="changeViewWrapper">
        <div className="changeViewContent">
          <button
            onClick={() => {
              setKirrusView("globe");
            }}
          >
            <GlobeView color={btnOneActive ? "white" : "#A1A7B0"} />
          </button>
          <button
            onClick={() => {
              setKirrusView("map");
              controls.current.reset();
            }}
          >
            <MapView color={btnTwoActive ? "white" : "#A1A7B0"} />
          </button>
        </div>
      </Html>
      <Html wrapperClass="soundBtnWrapper">
        <button className="soundBtn" onClick={() => setSoundOn(!soundOn)}>
          <StyledLoadbarSound
            animation={soundOn ? 1.3 : 0}
            height={soundOn ? 12 : 6}
          />
        </button>
      </Html>
    </>
  );
}
