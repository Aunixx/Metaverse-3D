import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";
import bumpMap from "../assets/cardano-bump.png";
import galaxyImg from "../assets/galax-6.png";
import map from "../assets/celeris.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useGesture, useDrag } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";
import { Html, useGLTF, Sky } from "@react-three/drei";
import ZoomInOut from "../components/zoomInOut/zoomInOut";
import { GlobeView } from "../assets/svg";
import BackBtn from "../components/backBtn/backBtn";
import Terrain from "../assets/celeris-terrain-2.glb";
import CelerisBump from "../assets/cardano-bump.png";
import * as THREE from "three";

extend({ OrbitControls });

export default function Celeris({ setIsMapView }) {
  const terrainModel = useGLTF(Terrain);
  console.log(terrainModel.scene);
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
  const [args, setArgs] = useState({ width: 200, height: 200 });
  const [ry, setRy] = useState(0);

  useEffect(() => {
    if (window.innerWidth < 1025 && window.innerWidth > 768) {
      setArgs({ width: 150, height: 150 });
    } else if (window.innerWidth < 768) {
      setArgs({ width: 100, height: 100 });
    }
  }, []);
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
    setZoomLevelWidth(args.width / 2 - width);
    setZoomLevelHeight(args.height / 2 - height);
  }, [cameraZoom]);
  // console.log(globeRef.current.rotation.set(0.3, -0.1, -1.2));
  // console.log();
  useEffect(() => {
    if (globeRef) {
      controls.current.reset();
      globeRef.current.position.set(0, 0, -22);
      // globeRef.current.rotation.set(0, -0.1, 0);
      console.log(globeRef.current.rotation, "rotation");
    }
  }, []);
  useEffect(() => {
    if (camera.zoom > 20) {
      console.log("Nothing");
    }
  }, [camera.zoom]);

  const bind = useDrag(
    ({ offset: [ox, oy] }) =>
      api.start({
        position: [ox, -oy, 0],
        rotation: [0, 0, 0],
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

  console.log(controls);
  useFrame((state, delta) => {
    setPrevCameraZoom(cameraZoom);
    setCameraZoom(camera.zoom);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.updateProjectionMatrix();
  });

  return (
    <>
      <fog
        attach="fog"
        args={
          window.innerWidth < 600 ? ["#cff4fe", 1, 20] : ["#cff4fe", 5, 1000]
        }
        side={THREE.BackSide}
      />
      <ambientLight args={[0xffffff, 1]} />
      <orbitControls
        args={[camera, gl.domElement]}
        makeDefault
        ref={controls}
        maxDistance={90}
        enableRotate={true}
        maxZoom={45}
        panSpeed={0.5}
        zoomSpeed={0.5}
        minZoom={40}
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={true}
        maxPolarAngle={0}
      />
      <Sky />
      {/* <a.mesh ref={globeRef} {...spring} {...bind()}>
        <planeGeometry args={[args.width, args.height]} position={[0, 0, 0]} />
        <meshStandardMaterial
          attach="material"
          map={texture}
          // displacementMap={}
          // displacementScale={1}
        />
      </a.mesh> */}
      <primitive
        ref={globeRef}
        // {...spring}
        // {...bind()}
        object={terrainModel.scene}
        scale={(0.1, 0.1, 0.1)}
        // rotation={(0, 0, 0)}
        fog={false}
      />
      <BackBtn setIsMapView={setIsMapView} controls={controls} />
      <ZoomInOut camera={camera} zoomValue={9} minValue={9} maxValue={45} />
      <mesh position={[21.97, -10.459, 0.0]}>
        <planeGeometry args={[0.58, 0.58]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[22.59, -10.459, 0.0]}>
        <planeGeometry args={[0.58, 0.58]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[23.21, -10.459, 0.0]}>
        <planeGeometry args={[0.58, 0.58]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[23.82, -10.459, 0.0]}>
        <planeGeometry args={[0.58, 0.58]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh
        position={[24.44, -10.459, 0.0]}
        onClick={() => alert("Hello")}
        onPointerOver={() =>
          (document.querySelector("#root").style.cursor = "pointer")
        }
        onPointerOut={() =>
          (document.querySelector("#root").style.cursor = "grab")
        }
      >
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[23.725, -9.786, 0.0]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[14.572, -13.431, 0.0]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[14.792, -13.431, 0.0]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[15.012, -13.431, 0.0]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[15.598, -13.431, 0.0]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[15.818, -13.431, 0.0]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[15.012, -13.431, 0.0]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[16.29, -13.27, 0.0]} rotation={[0, 0, 0.79]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[16.46, -13.1, 0.0]} rotation={[0, 0, 0.79]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[16.625, -12.925, 0.0]} rotation={[0, 0, 0.79]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[15.98, -12.85, 0.0]} rotation={[0, 0, 0.79]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[16.15, -12.68, 0.0]} rotation={[0, 0, 0.79]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[16.32, -12.51, 0.0]} rotation={[0, 0, 0.79]}>
        <planeGeometry args={[0.2, 0.2]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#fff"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.62, -11.35, 0.0]} rotation={[0, 0, -0.33]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[22.2, -11.55, 0.0]} rotation={[0, 0, -0.33]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.4, -11.95, 0.0]} rotation={[0, 0, -0.37]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.98, -12.17, 0.0]} rotation={[0, 0, -0.37]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[23.46, -0.66, 0.0]} rotation={[0, 0, -0.25]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[22.75, -0.6, 0.0]} rotation={[0, 0, -1.54]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[22.08, -0.66, 0.0]} rotation={[0, 0, -1.4]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.38, -0.95, 0.0]} rotation={[0, 0, -0.93]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[20.85, -1.45, 0.0]} rotation={[0, 0, -0.62]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[20.55, -2.14, 0.0]} rotation={[0, 0, -0.12]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[20.58, -2.9, 0.0]} rotation={[0, 0, -1.3]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[20.82, -3.55, 0.0]} rotation={[0, 0, -1.11]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.2, -4.11, 0.0]} rotation={[0, 0, -0.9]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[23.3, -1.49, 0.0]} rotation={[0, 0, -0.15]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[22.63, -1.46, 0.0]} rotation={[0, 0, -1.52]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.93, -1.62, 0.0]} rotation={[0, 0, -1.18]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.43, -2.2, 0.0]} rotation={[0, 0, -0.39]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.47, -2.95, 0.0]} rotation={[0, 0, -1.2]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[21.88, -3.57, 0.0]} rotation={[0, 0, -0.77]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh position={[22.45, -3.97, 0.0]} rotation={[0, 0, -0.67]}>
        <planeGeometry args={[0.58, 0.58]} position={[0, 0, 0]} />
        <meshBasicMaterial
          attach="material"
          // map={plotsOnly}
          color={"#FFF"}
          transparent={true}
          opacity={1}
        />
      </mesh>
    </>
  );
}
