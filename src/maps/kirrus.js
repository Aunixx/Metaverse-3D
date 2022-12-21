import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";
import bumpMap from "../assets/cardano-bump.png";
import galaxyImg from "../assets/galax-6.png";
import map from "../assets/cardano-min.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useGesture, useDrag } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { GlobeView, MapView } from "../assets/svg";
import CelerisLand from "../assets/land-pic.svg";
import OuroboraLand from "../assets/land-pic.svg";
import ZoomInOut from "../components/zoomInOut/zoomInOut";
import Lead from "../components/lead/lead";

extend({ OrbitControls });

export default function KirrusMap({ setIsMapView, setKirrusView }) {
  const { camera, gl } = useThree();
  const [zoomIn, setZoomIn] = useState(8);
  const [zoomOut, setZoomOut] = useState(8);
  const controls = useRef();
  const globeRef = useRef();
  const texture = useLoader(TextureLoader, map);
  const bump = useLoader(TextureLoader, bumpMap);
  const galaxy = useLoader(TextureLoader, galaxyImg);
  const [htmlScale, setHtmlScale] = useState(0.1);
  const [cameraZoom, setCameraZoom] = useState();
  const [prevCameraZoom, setPrevCameraZoom] = useState();
  const [zoomLevelWidth, setZoomLevelWidth] = useState(0);
  const [zoomLevelHeight, setZoomLevelHeight] = useState(0);
  const [isLead, setIsLead] = useState({
    landImg: "",
    landName: "",
    landDescription: "",
    isViewLead: "",
  });
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

  let lat = 0;
  let lng = 0;
  let pin = { lat, lng };
  let pinPoint = location(pin);
  lat = -43;
  lng = -27;
  let pin2 = { lat, lng };
  let pinPoint2 = location(pin2);

  const { size, viewport } = useThree();
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  }));

  useEffect(() => {
    const width = viewport.getCurrentViewport().width / 2;
    const height = viewport.getCurrentViewport().height / 2;
    setZoomLevelWidth(200 - width);
    setZoomLevelHeight(100 - height);
  }, [cameraZoom]);

  const bind = useDrag(
    ({ offset: [ox, oy] }) =>
      api.start({
        position: [ox, -oy, 0],
      }),
    {
      bounds: {
        left: -zoomLevelWidth,
        right: zoomLevelWidth,
        top: -zoomLevelHeight,
        bottom: zoomLevelHeight,
      },
      preventDefault: true,
    }
  );
  const handleMouseOver = (landName, landImg, landDescription, isViewLead) => {
    setIsLead({ landName, landImg, landDescription, isViewLead });
  };
  const handleMouseLeave = (isViewLead) => {
    setIsLead({ isViewLead: isViewLead });
  };
  useFrame((state, delta) => {
    setCameraZoom(camera.zoom);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <ambientLight args={[0xffffff, 0.5]} />
      <orbitControls
        args={[camera, gl.domElement]}
        makeDefault
        ref={controls}
        maxDistance={1000}
        enableRotate={false}
        maxZoom={44}
        panSpeed={0.5}
        zoomSpeed={0.5}
        minZoom={4}
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={true}
      />
      <a.group ref={globeRef} {...spring} {...bind()}>
        <Html
          position={[11, 33, pinPoint2.z]}
          occlude={[globeRef]}
          center
          wrapperClass="labelPoint"
          distanceFactor={0.2}
          sprite={true}
        >
          <div
            class="circlewrapper"
            onMouseOver={() =>
              handleMouseOver(
                "Celeris",
                CelerisLand,
                "Celeris is a small island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef that has rising stones forming the cardano sea.",
                true
              )
            }
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
          position={[-32, -48, pinPoint.z]}
          occlude={[globeRef]}
          center
          wrapperClass="labelPoint"
          distanceFactor={0.2}
          sprite={true}
        >
          <div
            class="circlewrapper"
            onMouseOver={() =>
              handleMouseOver(
                "Ourobora",
                OuroboraLand,
                "Ourobora is a small island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef that has rising stones forming the cardano sea.",
                true
              )
            }
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
        <a.mesh>
          <planeGeometry args={[400, 200]} position={[0, 0, 0]} />
          <meshBasicMaterial attach="material" map={texture} />
        </a.mesh>
      </a.group>
      <Html wrapperClass="changeViewWrapper">
        <div className="changeViewContent">
          <button
            onClick={() => {
              setKirrusView("globe");
              controls.current.reset();
            }}
          >
            <GlobeView color={"#A1A7B0"} />
          </button>
          <button
            onClick={() => {
              setKirrusView("map");
            }}
          >
            <MapView color={"white"} />
          </button>
        </div>
      </Html>
      <ZoomInOut camera={camera} zoomValue={8} minValue={4} maxValue={44} />
    </>
  );
}