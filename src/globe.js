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

// extend({ OrbitControls });

export default function Globe({ setIsMapView }) {
  const { camera, gl } = useThree();
  const galaxyRef = useRef();
  const globeRef = useRef();
  const globeGroupeRef = useRef();
  const lightHolder = useRef();
  const [rotation, setRotation] = useState(0.0007);
  // const [bigText, setBigText] = useState(null);
  const manager = new THREE.LoadingManager();

  // const texture = new THREE.TextureLoader().load(map);
  // const bump = new THREE.TextureLoader().load(bumpMap);
  // const galaxy = new THREE.TextureLoader().load(galaxyImg);

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

  let lat = 30;
  let lng = 10;
  let pin = { lat, lng };
  let pinPoint = location(pin);
  lat = -43;
  lng = -27;
  let pin2 = { lat, lng };
  let pinPoint2 = location(pin2);

  useFrame((state, delta) => {
    galaxyRef.current.rotation.y += 0.0001;
    globeGroupeRef.current.rotation.y -= rotation;
    state.camera.lookAt(globeRef.current.position);
    lightHolder.current.quaternion.copy(state.camera.quaternion);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.gl.toneMapping = CineonToneMapping;
  });

  return (
    <>
      <Perf />
      <OrbitControls
        // args={[camera, gl.domElement]}
        maxDistance={1.8}
        maxZoom={1.3}
        minDistance={1.3}
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
            distanceFactor={1.5}
            sprite={true}
          >
            <div
              class="circlewrapper"
              onMouseOver={() => setRotation(0)}
              onMouseLeave={() => setRotation(0.0007)}
              onClick={() => setIsMapView(true)}
            >
              <div class="midcircle"></div>
              <div class="circles">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
              </div>
              <h1 className="bigtext bigtext1">Celeris</h1>
            </div>
          </Html>
          <Html
            position={[pinPoint2.x + 0.02, pinPoint2.y, pinPoint2.z]}
            occlude={[globeRef]}
            center
            wrapperClass="label"
            distanceFactor={1.5}
            sprite={true}
          >
            <div
              class="circlewrapper"
              onMouseOver={() => setRotation(0)}
              onMouseLeave={() => setRotation(0.0007)}
            >
              <div class="midcircle"></div>
              <div class="circles">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
              </div>
              <h1 className="bigtext bigtext2">Ourobora</h1>
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
    </>
  );
}
