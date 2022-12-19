import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";
import bumpMap from "../assets/cardano-bump.png";
import galaxyImg from "../assets/galax-6.png";
import map from "../assets/celeris.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useGesture, useDrag } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";
import { Html } from "@react-three/drei";

extend({ OrbitControls });

export default function Celeris({ setIsMapView }) {
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
    setZoomLevelWidth(100 - width);
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

  useFrame((state, delta) => {
    setPrevCameraZoom(cameraZoom);
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
        maxDistance={2000}
        enableRotate={false}
        maxZoom={42}
        panSpeed={0.5}
        zoomSpeed={0.5}
        minZoom={9}
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={true}
      />
      <a.mesh ref={globeRef} {...spring} {...bind()}>
        <Html>
          <button onClick={() => setIsMapView("")}>Back To Globe</button>
        </Html>
        <Html>
          <button
            onClick={() => (camera.zoom += 2)}
            disabled={camera.zoom === 42}
          >
            +
          </button>
          <button
            onClick={() => (camera.zoom != 8 ? (camera.zoom -= 2) : "")}
            disabled={camera.zoom === 8}
          >
            -
          </button>
        </Html>

        <planeGeometry args={[200, 200]} position={[0, 0, 0]} />
        <meshBasicMaterial attach="material" map={texture} />
      </a.mesh>
    </>
  );
}
