import { useThree, extend, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import map from "./assets/cardano-min.png";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { BackSide, CineonToneMapping } from "three";
import bumpMap from "./assets/cardano-bump.png";
import galaxyImg from "./assets/galax-6.png";
import { Perf } from "r3f-perf";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { useEffect } from "react";
import { GlobeView, MapView } from "./assets/svg";
import Lead from "./components/lead/lead";
import CelerisLand from "./assets/land-pic.svg";
import OuroboraLand from "./assets/land-pic.svg";
import ZoomInOut from "./components/zoomInOut/zoomInOut";

// extend({ OrbitControls });

export default function Globe({ setIsMapView, isMapView, setKirrusView }) {
  const { camera, gl } = useThree();
  const galaxyRef = useRef();
  const globeRef = useRef();
  const controls = useRef();
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
    gsap.from(camera.position, { z: 10, duration: 2 });
  }, []);

  let lat = 30;
  let lng = 10;
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

  useEffect(() => {
    gsap.to(camera, { zoom: cameraZoom, duration: 1 });
  }, [cameraZoom]);

  useFrame((state, delta) => {
    galaxyRef.current.rotation.y += 0.0001;
    globeGroupeRef.current.rotation.y -= rotation;
    state.camera.lookAt(globeRef.current.position);
    lightHolder.current.quaternion.copy(state.camera.quaternion);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.gl.toneMapping = CineonToneMapping;
    camera.updateProjectionMatrix();
    console.log(camera.zoom);
  });

  return (
    <>
      {/* <Perf /> */}
      <OrbitControls
        ref={controls}
        maxDistance={2}
        maxZoom={2.1}
        enablePan={false}
        minDistance={1.2}
        zoomSpeed={0.5}
        enableDamping={true}
      />
      <directionalLight args={[0xffffff, 0.01]} position={[8, 8, 0]} />
      <ambientLight args={[0xffffff, 0.01]} />
      <group ref={lightHolder}>
        <pointLight args={[0xffffff, 0.5]} position={[8, 8, 8]} />
      </group>
      <group ref={globeGroupeRef}>
        <mesh ref={globeRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            attach="material"
            map={texture}
            bumpMap={bump}
            bumpScale={0.09}
            // color={"red"}
          />
          <Html
            position={[pinPoint.x + 0.02, pinPoint.y, pinPoint.z]}
            occlude={[globeRef]}
            center
            wrapperClass="label"
            distanceFactor={1}
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
              onClick={() => {
                setIsMapView("Celeris");
              }}
            >
              {isLead.landName === "Celeris" ? (
                <Lead
                  landImg={isLead.landImg}
                  landName={isLead.landName}
                  landDescription={isLead.landDescription}
                  setIsMapView={setIsMapView}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseOver={handleMouseOver}
                />
              ) : (
                <>
                  <div class="midcircle"></div>
                  <div class="circles">
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                    <div class="circle3"></div>
                  </div>
                </>
              )}
            </div>
          </Html>
          <Html
            position={[pinPoint2.x + 0.02, pinPoint2.y, pinPoint2.z]}
            occlude={[globeRef]}
            center
            wrapperClass="label"
            distanceFactor={1}
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
              onClick={() => {
                setIsMapView("Ourobora");
              }}
            >
              {isLead.landName === "Ourobora" ? (
                <Lead
                  landImg={isLead.landImg}
                  landName={isLead.landName}
                  landDescription={isLead.landDescription}
                  setIsMapView={setIsMapView}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseOver={handleMouseOver}
                />
              ) : (
                <>
                  <div class="midcircle"></div>
                  <div class="circles">
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                    <div class="circle3"></div>
                  </div>
                </>
              )}
            </div>
          </Html>
        </mesh>
      </group>
      <mesh ref={galaxyRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshBasicMaterial
          attach="material"
          map={galaxy}
          side={BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
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
    </>
  );
}
