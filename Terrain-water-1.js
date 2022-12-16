import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";
import bumpMap from "./assets/cardano-bump.png";
import galaxyImg from "./assets/galax-6.png";
import map from "./assets/celeris.png";
import celeris from "./assets/celeris-vector.svg";
import ouroborus from "./assets/cardano-vector.svg";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RigidBody } from "@react-three/rapier";
import { useGesture, useDrag } from "react-use-gesture";
import Terrain from "./assets/terrain-1.gltf";
import TerrainWater from "./assets/terrain-water-1.gltf";
import Dragon from "./assets/dragon.fbx";
import { useSpring, a } from "@react-spring/three";
import { useControls } from "leva";
import { Triangle } from "react-loader-spinner";

import {
  Html,
  //   OrbitControls,
  PivotControls,
  TransformControls,
  PresentationControls,
  OrthographicCamera,
  Text,
  useFBX,
  useGLTF,
  useAnimations,
  Sky,
  Cloud,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import * as THREE from "three";

extend({ OrbitControls });

export default function Map() {
  const terrainModel = useGLTF(Terrain);
  const terrainWaterModel = useGLTF(TerrainWater);
  const waterAnimations = useAnimations(
    terrainWaterModel.animations,
    terrainWaterModel.scene
  );
  console.log(waterAnimations);

  useEffect(() => {
    const action = waterAnimations.actions.water;
    action.play();
  }, []);
  const manager = new THREE.LoadingManager();
  console.log(terrainWaterModel.materials.map);
  // manager.onStart = function (url, itemsLoaded, itemsTotal) {
  //   console.log(
  //     "Started loading file: " +
  //       url +
  //       ".\nLoaded " +
  //       itemsLoaded +
  //       " of " +
  //       itemsTotal +
  //       " files."
  //   );
  // };
  const gui = new GUI({ autoPlace: true });
  const { camera, gl } = useThree();
  const controls = useRef();
  const globeRef = useRef();
  const modelRef = useRef();
  const htmlRef = useRef();
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
  const aspect = size.width / viewport.width;
  const boundaries = [-20, 20, 20, -20];
  const [spring, api] = useSpring(() => ({
    // scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    // config: { friction: 10 },
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
    controls.current.update();
    setPrevCameraZoom(cameraZoom);
    setCameraZoom(camera.zoom);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  return (
    <>
      <Sky />

      <Perf />
      {/* <directionalLight args={[0xffffff, 0.01]} position={[8, 8, 0]} /> */}
      <ambientLight args={[0xffffff, 0.5]} />

      {/* <pointLight args={[0xffffff, 0.4]} position={[8, 8, 8]} /> */}

      <orbitControls
        args={[camera, gl.domElement]}
        makeDefault
        ref={controls}
        // maxDistance={2000}
        enableRotate={false}
        maxZoom={42}
        minZoom={9}
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={true}
      />
      {/* <OrthographicCamera makeDefault={true}> */}

      {/* </OrthographicCamera> */}

      {/* <primitive ref={modelRef} object={dragonModel.scene} /> */}
      {/* <group ref={modelRef} receiveShadow>
        <primitive
          object={terrainModel.scene}
          position={[0, 0, 0]}
          scale={0.1}
        />
        <primitive
          object={terrainWaterModel.scene}
          position={[0, -3, 0]}
          scale={0.1}
        />
      </group> */}
      <a.mesh ref={globeRef} {...spring} {...bind()}>
        <planeGeometry args={[200, 200]} position={[0, 0, 0]} />
        <meshBasicMaterial attach="material" map={texture} />
      </a.mesh>
    </>
  );
}
