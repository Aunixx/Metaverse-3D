import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
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
import Terrain from "./assets/water-and-terrain.gltf";
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

import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

export function Ocean() {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg"
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(30000, 30000), []);
  const config = useMemo(
    () => ({
      textureWidth: 1024,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xeb8934,
      waterColor: 0x0064b5,
      distortionScale: 0,
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta)
  );
  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, 11, 0]}
    />
  );
}

extend({ OrbitControls });

export function TerrainModel(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(Terrain);
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        {/* <mesh
          name="water"
          // geometry={nodes.water.geometry}
          // material={materials.water}
          position={[0, -113.9, 22.3]}
          scale={[5, 5, 5]}
        >
          <boxGeometry args={[200, 50, 200]} />
          <meshBasicMaterial attach="material" color="#064273" />
        </mesh> */}
        <mesh
          name="Plane003"
          geometry={nodes.Plane003.geometry}
          material={materials["Material.002"]}
          position={[0, 0, 0]}
          scale={[0.1, 0.1, 0.1]}
        />
      </group>
    </group>
  );
}

export default function Map() {
  const terrainModel = useGLTF(Terrain);
  // const terrainWaterModel = useGLTF(Terrain);
  // const waterAnimations = useAnimations(animationAction, terrainModel.scene);

  // useLayoutEffect(() => {
  //   Object.assign(terrainModel.materials.water, {
  //     map: texture,
  //     color: "#FFFFFF",
  //   });
  // }, []);
  const manager = new THREE.LoadingManager();
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

  const { size, viewport } = useThree();
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
      {/* <Cloud
        opacity={0.5}
        speed={0.4} // Rotation speed
        width={100} // Width of the full cloud
        depth={0.5} // Z-dir depth
        segments={200}
      /> */}
      <Perf />
      {/* <directionalLight args={[0xffffff, 0.01]} position={[8, 8, 0]} /> */}
      <ambientLight args={[0xffffff, 0.5]} />

      {/* <pointLight args={[0xffffff, 0.4]} position={[8, 8, 8]} /> */}

      <orbitControls
        args={[camera, gl.domElement]}
        makeDefault
        ref={controls}
        // maxDistance={2000}
        enableRotate={true}
        // maxZoom={42}
        // minZoom={9}
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={true}
      />
      {/* <OrthographicCamera makeDefault={true}> */}

      {/* </OrthographicCamera> */}

      {/* <primitive ref={modelRef} object={dragonModel.scene} /> */}
      {/* <group ref={modelRef} receiveShadow> */}
      {/* <primitive
          object={terrainModel.scene}
          position={[0, 0, 0]}
          scale={0.1}
        /> */}
      {/* <TerrainModel />
        <Ocean /> */}
      <a.mesh ref={globeRef} {...spring} {...bind()}>
        <planeGeometry args={[200, 200]} position={[0, 0, 0]} />
        <meshBasicMaterial attach="material" map={texture} />
      </a.mesh>
      {/* </group> */}
    </>
  );
}
