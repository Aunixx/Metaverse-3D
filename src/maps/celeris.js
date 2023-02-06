import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { RGBA_ASTC_10x10_Format, TextureLoader } from "three";
import bumpMap from "../assets/cardano-bump.png";
import galaxyImg from "../assets/galax-6.png";
import map from "../assets/celeris_without_trees_min.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useGesture, useDrag } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";
import { Html } from "@react-three/drei";
import ZoomInOut from "../components/zoomInOut/zoomInOut";
import { GlobeView } from "../assets/svg";
import BackBtn from "../components/backBtn/backBtn";
import CelerisRoadsOnly from "../assets/roads-only.png";
import CelerisRoadandPlots from "../assets/roads_and_plots.png";
import CelerisPlotsOnly from "../assets/celeris_plots.svg";
import CelerisTraceMap from "../assets/celeris_trace_map.jpg";
import PlotRect from "../assets/Plot-Rectangle.svg";
import normalMap from "../assets/normal_map.png";
import { Perf } from "r3f-perf";
import gsap from "gsap";
import * as THREE from "three";
import { useControls } from "leva";
import { CelerisPlotting } from "../plots/celerisPlotting.jsx";
import { PlotFilter } from "../components/plotFilter/PlotFilter";
import { PlotLead } from "../components/plotLead/PlotLead";
import uuid from "react-uuid";

extend({ OrbitControls });

const CameraController = ({ mapRef }) => {
  const { camera, gl, viewport } = useThree();

  var _v = new THREE.Vector3();
  if (mapRef) {
    // gsap.to(camera.position, { y: 50, duration: 1 });
  }
  useEffect(() => {
    camera.position.set(0, 0, 0);
    camera.rotation.set(-1.56, 0, 0);
    const controls = new OrbitControls(camera, gl.domElement);
    camera.rotation.set(-1.56, 0, 0);
    gsap.to(camera.position, { y: 50, duration: 2 });
    controls.minDistance = 3.5;
    controls.maxDistance = 50;
    controls.autoRotate = false;
    controls.panSpeed = 2.5;
    controls.zoomSpeed = 2.5;
    controls.screenSpacePanning = false;
    controls.touches = { ONE: 2, TWO: 2 };
    controls.autoRotate = false;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.maxPolarAngle = 0;
    controls.addEventListener("change", function (e) {
      var minPan = new THREE.Vector3(
        -65 + e.target.object.position.y + 1,
        0,
        -104 + e.target.object.position.y + 1
      );
      var maxPan = new THREE.Vector3(
        65 - e.target.object.position.y - 1,
        0,
        110 - e.target.object.position.y - 1
      );
      if (e.target.object.position.y < controls.maxDistance) {
        camera.rotateX(Math.PI / e.target.object.position.y);
        // camera.rotateX(Math.PI / e.target.object.position.y < 0.5
        // ? Math.PI / e.target.object.position.y
        // : 0.5);
      }
      _v.copy(controls.target);
      controls.target.clamp(minPan, maxPan);
      _v.sub(controls.target);
      camera.position.sub(_v);
    });
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

function Instances({ count = 20000, temp = new THREE.Object3D() }) {
  const ref = useRef();
  const texture = useLoader(TextureLoader, map);
  const color = useMemo(() => new THREE.Color().setHex(0x00ff), []);
  useEffect(() => {
    // Set positions
    for (let i = 0; i < count; i++) {
      // if (CelerisPlotting[i].size === "small") {
      //   temp.scale.set(0.35, 0.35, 0.35);
      // } else if (CelerisPlotting[i].size === "medium") {
      //   temp.scale.set(0.67, 0.67, 0.67);
      // } else {
      //   temp.scale.set(1, 1, 1);
      // }
      // if (i % 4 === 1) {
      //   temp.position.set(
      //     CelerisPlotting[i].position.x,
      //     CelerisPlotting[i].position.y,
      //     0.003
      //   );
      //   color.r = Math.random() * 1;
      //   color.g = Math.random() * 1;
      //   color.b = Math.random() * 1;
      //   temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
      //   temp.opacity = 0.5;
      // } else if (i % 4 === 2) {
      //   temp.position.set(
      //     CelerisPlotting[i].position.x,
      //     CelerisPlotting[i].position.y,
      //     0.003
      //   );
      //   temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
      //   color.r = Math.random() * 1;
      //   color.g = Math.random() * 1;
      //   color.b = Math.random() * 1;
      // } else if (i % 4 === 3) {
      //   temp.position.set(
      //     CelerisPlotting[i].position.x,
      //     CelerisPlotting[i].position.y,
      //     0.003
      //   );
      //   color.r = Math.random() * 1;
      //   color.g = Math.random() * 1;
      //   color.b = Math.random() * 1;
      //   temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
      // } else if (i % 4 === 0) {
      //   temp.position.set(
      //     CelerisPlotting[i].position.x,
      //     CelerisPlotting[i].position.y,
      //     0.003
      //   );
      //   color.r = Math.random() * 1;
      //   color.g = Math.random() * 1;
      //   color.b = Math.random() * 1;
      //   temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
      // }
      if (i % 4 === 1) {
        temp.position.set(-Math.random() * 100, -Math.random() * 100, 0.003);
        color.r = Math.random() * 1;
        color.g = Math.random() * 1;
        color.b = Math.random() * 1;
      } else if (i % 4 === 2) {
        temp.position.set(-Math.random() * 100, Math.random() * 100, 0.003);
        color.r = Math.random() * 1;
        color.g = Math.random() * 1;
        color.b = Math.random() * 1;
      } else if (i % 4 === 3) {
        temp.position.set(Math.random() * 100, -Math.random() * 100, 0.003);
        color.r = Math.random() * 1;
        color.g = Math.random() * 1;
        color.b = Math.random() * 1;
      } else if (i % 4 === 0) {
        temp.position.set(Math.random() * 100, Math.random() * 100, 0.003);
        color.r = Math.random() * 1;
        color.g = Math.random() * 1;
        color.b = Math.random() * 1;
      }
      temp.updateMatrix();
      ref.current.setMatrixAt(i, temp.matrix);
      ref.current.setColorAt(i, color);
    }
    // Update the instance
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
  }, []);
  return (
    <instancedMesh
      ref={ref}
      args={[null, null, count]}
      onClick={(e) => {
        e.stopPropagation();
        const temp = new THREE.Object3D();
        for (let i = 0; i < CelerisPlotting.length; i++) {
          if (i === e.instanceId) {
            if (CelerisPlotting[i].size === "small") {
              temp.scale.set(0.35, 0.35, 10);
            } else if (CelerisPlotting[i].size === "medium") {
              temp.scale.set(0.7, 0.7, 15);
            } else {
              temp.scale.set(1, 1, 20);
            }
            temp.position.set(
              CelerisPlotting[i].position.x,
              CelerisPlotting[i].position.y,
              0.003
            );
            temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
            temp.updateMatrix();
            ref.current.setMatrixAt(i, temp.matrix);
            ref.current.instanceMatrix.needsUpdate = true;
          }
        }
        ref.current.updateMatrix();
        ref.current.setColorAt(e.instanceId, color);
        ref.current.instanceColor.needsUpdate = true;
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        const temp = new THREE.Object3D();
        const color = new THREE.Color().setHex(0x0300ff);

        for (let i = 0; i < CelerisPlotting.length; i++) {
          if (i === e.instanceId) {
            if (CelerisPlotting[i].size === "small") {
              temp.scale.set(0.35, 0.35, 10);
            } else if (CelerisPlotting[i].size === "medium") {
              temp.scale.set(0.7, 0.7, 15);
            } else {
              temp.scale.set(1, 1, 20);
            }
            // temp.scale.set(1.5, 1.5, 1.5);
            temp.position.set(
              CelerisPlotting[i].position.x,
              CelerisPlotting[i].position.y,
              0.003
            );
            temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
            temp.updateMatrix();
            ref.current.setMatrixAt(i, temp.matrix);
            ref.current.instanceMatrix.needsUpdate = true;
          }
        }
        ref.current.updateMatrix();
        // ref.current.setColorAt(e.instanceId, color);
        ref.current.instanceColor.needsUpdate = true;
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        const temp = new THREE.Object3D();
        for (let i = 0; i < CelerisPlotting.length; i++) {
          if (i === e.instanceId) {
            if (CelerisPlotting[i].size === "small") {
              // temp.scale.set(0.35, 0.35, 0.35);
              gsap.from(temp.scale, { x: 0.35, y: 0.35, z: 0.35, duration: 4 });
            } else if (CelerisPlotting[i].size === "medium") {
              temp.scale.set(0.7, 0.7, 0.7);
            } else {
              temp.scale.set(1, 1, 1);
            }
            temp.position.set(
              CelerisPlotting[i].position.x,
              CelerisPlotting[i].position.y,
              0.003
            );
            temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
            temp.updateMatrix();
            ref.current.setMatrixAt(i, temp.matrix);
            ref.current.instanceMatrix.needsUpdate = true;
          }
        }
        ref.current.updateMatrix();
        // ref.current.setColorAt(e.instanceId, color);
        ref.current.instanceColor.needsUpdate = true;
      }}
    >
      <boxGeometry args={[0.58, 0.58, 0.2]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}
export default function Celeris({ setIsMapView }) {
  const { camera, gl } = useThree();
  const [zoomIn, setZoomIn] = useState(8);
  const [zoomOut, setZoomOut] = useState(8);
  const controls = useRef();
  const globeRef = useRef();
  const plotGeometryRef = useRef();
  const plotMaterialRef = useRef();
  const plotMeshRef = useRef();
  const texture = useLoader(TextureLoader, map);
  const traceMap = useLoader(TextureLoader, CelerisTraceMap);
  const roadsOnly = useLoader(TextureLoader, CelerisRoadsOnly);
  const plotsOnly = useLoader(TextureLoader, CelerisPlotsOnly);
  const plotsAndRoads = useLoader(TextureLoader, CelerisRoadandPlots);
  const PlotRectangle = useLoader(TextureLoader, PlotRect);
  const bump = useLoader(TextureLoader, bumpMap);
  const galaxy = useLoader(TextureLoader, galaxyImg);
  const [htmlScale, setHtmlScale] = useState(0.1);
  const [cameraZoom, setCameraZoom] = useState();
  const [prevCameraZoom, setPrevCameraZoom] = useState();
  const [zoomLevelWidth, setZoomLevelWidth] = useState(0);
  const [zoomLevelHeight, setZoomLevelHeight] = useState(0);
  const [args, setArgs] = useState({ width: 200, height: 200 });
  const [items, setItems] = useState(Array(7000).fill(0));
  const [hovered, setHovered] = useState(false);

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

  const options = useMemo(() => {
    return {
      x: { value: 0, min: 0, max: 100, step: 0.01 },
      y: { value: 0, min: -100, max: 100, step: 0.01 },
      z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      rotateZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    };
  }, []);
  const [filters, setFilters] = useState("All");
  const [plotLeads, setPlotLeads] = useState(false);
  const [currentPlot, setCurrentPlot] = useState(null);
  const [plotCoordinates, setPlotCoordinates] = useState(null);
  // const pA = useControls("Polyhedron A", options);

  const HandlePlotCoordinates = (plot) => {
    if (!plot) {
      setPlotCoordinates(null);
    } else {
      setPlotCoordinates({
        long: (32.95 + (plot.position.y * 3.475) / 100).toFixed(4),
        lat: (7.425 + (plot.position.x * 3.475) / 100).toFixed(4),
      });
    }
  };

  useFrame((state, delta) => {
    setPrevCameraZoom(cameraZoom);
    setCameraZoom(camera.zoom);
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.updateProjectionMatrix();
  });
  const plotMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#FFF" }),
    []
  );
  const plotLargeGeometry = useMemo(
    () => new THREE.PlaneGeometry(0.58, 0.58),
    []
  );
  const plotMediumGeometry = useMemo(
    () => new THREE.PlaneGeometry(0.4, 0.4),
    []
  );
  const plotSmallGeometry = useMemo(
    () => new THREE.PlaneGeometry(0.2, 0.2),
    []
  );
  // const plotMesh = useMemo(
  //   () => new THREE.InstancedMesh(plotLargeGeometry, plotMaterial, 50),
  //   []
  // );
  return (
    <>
      <Perf />
      <ambientLight args={[0xffffff, 0.5]} />
      {/* <orbitControls
        args={[camera, gl.domElement]}
        makeDefault
        ref={controls}
        maxDistance={2000}
        enableRotate={false}
        maxZoom={150}
        panSpeed={0.5}
        zoomSpeed={10.5}
        minZoom={9}
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={true}
      /> */}
      <CameraController />
      <group ref={globeRef} rotation={[-1.56, 0, 0]}>
        {/* <a.group ref={globeRef} {...spring} {...bind()}> */}
        <mesh>
          <planeGeometry args={[200, 200]} position={[0, 0, 0]} />
          <meshStandardMaterial
            attach="material"
            map={texture}
            // bumpMap={normalMap}
            // bumpScale={5}
            // normalScale={0.5}
          />
        </mesh>
        {/* <mesh position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} position={[10, 10, 10]} />
          <meshBasicMaterial
            attach="material"
            map={traceMap}
            transparent={true}
            opacity={0.9}
          />
        </mesh> */}

        <mesh position={[12.5, -12.5, 0.002]}>
          <planeGeometry args={[25, 25]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={roadsOnly}
            transparent={true}
            opacity={1}
          />
        </mesh>

        {/*
        <mesh position={[12.5, -12.5, 0.001]}>
          <planeGeometry args={[25, 25]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={plotsOnly}
            transparent={true}
            opacity={0.2}
          />
        </mesh> */}
        <mesh position={[12.5, -12.5, 0.002]}>
          <planeGeometry args={[25, 25]} />
          <meshBasicMaterial
            attach="material"
            map={plotsAndRoads}
            transparent={true}
            opacity={0.2}
          />
        </mesh>
        {/* <planeGeometry
          // args={[plot.args.width, plot.args.height]}
          ref={plotMaterialRef}
        />
        <meshBasicMaterial
          attach="material"
          color={"#FFF"}
          transparent={true}
          opacity={1}
          ref={plotMaterialRef}
        /> */}
        <Instances />

        {/* <mesh
          material={plotMaterial}
          geometry={plotLargeGeometry}
          position={[2, 2, 0]}
        /> */}

        {/* {CelerisPlotting?.map((plot, index) => {
          if (filters === "All") {
            return (
              <mesh
                position={[plot.position.x, plot.position.y, 0.003]}
                key={plot.plotId}
                rotation={[0, 0, plot.rotationZ]}
                onClick={() => {
                  setPlotLeads(true);
                  setCurrentPlot(plot);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  HandlePlotCoordinates(plot);
                  e.object.scale.set(1.3, 1.3, 1.3);
                  e.object.position.z = 0.1;
                  e.object.material.opacity = 0.9;
                  document.querySelector("#root").style.cursor = "pointer";
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  e.object.scale.set(1, 1, 1);
                  e.object.material.opacity = 1;
                  e.object.position.z = 0.003;
                  HandlePlotCoordinates(null);
                  document.querySelector("#root").style.cursor = "grab";
                }}
                geometry={
                  plot.size === "large"
                    ? plotLargeGeometry
                    : plot.size === "medium"
                    ? plotMediumGeometry
                    : plotSmallGeometry
                }
                material={plotMaterial}
              />
            );
          } else if (filters.toUpperCase() === plot.size.toUpperCase()) {
            return (
              <mesh
                position={[plot.position.x, plot.position.y, 0.003]}
                key={plot.plotId}
                rotation={[0, 0, plot.rotationZ]}
                onClick={() => {
                  setPlotLeads(true);
                  setCurrentPlot(plot);
                }}
                onPointerEnter={(e) => {
                  console.log(e.object.material);
                  e.stopPropagation();
                  e.object.scale.set(1.3, 1.3, 1.3);
                  e.object.position.z = 0.1;
                  e.object.material.opacity = 0.9;
                  HandlePlotCoordinates(plot);
                  document.querySelector("#root").style.cursor = "pointer";
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  e.object.scale.set(1, 1, 1);
                  e.object.material.opacity = 1;
                  e.object.position.z = 0.003;
                  HandlePlotCoordinates(null);
                  document.querySelector("#root").style.cursor = "grab";
                }}
              >
                <planeGeometry args={[plot.args.width, plot.args.height]} />
                <meshBasicMaterial
                  attach="material"
                  color={"#FFF"}
                  transparent={true}
                  opacity={1}
                />
              </mesh>
            );
          }
        })} */}
        {/* <mesh position={[Math.random(), -Math.random(), 0.0]}>
          {items.map((item, index) => (
            <>
              <planeGeometry args={[0.58, 0.58]} />
              <meshBasicMaterial
                attach="material
                // map={plotsOnly}
                color={"#FFF"}
                transparent={true}
                opacity={1}
              />
            </>
          ))}
        </mesh> */}
        {plotCoordinates && (
          <Html wrapperClass="plotCoordinatesWrapper">
            <div className="coordinates">
              <span className="plotLat plotCoordinates">
                {plotCoordinates?.lat} {"\xB0"}
                {plotCoordinates?.lat > 0 ? " E" : " W"}
              </span>
              <span className="plotLong plotCoordinates">
                {plotCoordinates?.long}
                {"\xB0"}
                {plotCoordinates?.lat > 0 ? " N" : " S"}
              </span>
            </div>
          </Html>
        )}
        {/* <mesh position={[pA.x, pA.y, 0.003]} rotation={[0, 0, -pA.rotateZ]}>
          <planeGeometry args={[0.4, 0.4]} position={[0, 0, 0]} />
          <meshBasicMaterial
            attach="material"
            // map={plotsOnly}
            color={"#fff"}
            transparent={true}
            opacity={1}
          />
        </mesh> */}
      </group>
      {/* </a.group> */}

      <PlotFilter filters={filters} setFilters={setFilters} />
      <PlotLead
        setPlotLeads={setPlotLeads}
        plotLeads={plotLeads}
        currentPlot={currentPlot}
      />
      <BackBtn setIsMapView={setIsMapView} />
      <ZoomInOut camera={camera} zoomValue={9} minValue={9} maxValue={45} />
    </>
  );
}
