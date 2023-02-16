import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import React from "react";
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
import { CelerisPlottingScript } from "../plots/CelerisPlottingScript";
import { ZavosPlotting } from "../plots/ZavosPlotting_all";
import HitoshikaPlotsPNG from "../assets/hitoshika-plots.png";
import HitoshikaRoadsPNG from "../assets/hitoshika-roads.png";
import XerostiaPlotsPNG from "../assets/xerostia-plots.png";
import XerostiaRoadsPNG from "../assets/xerostia-roads.png";
import KhenonPlotsPNG from "../assets/khenon-plots.png";
import KhenonRoadsPNG from "../assets/khenon-roads.png";
import AzraqPlotsPNG from "../assets/azraq-land.png";
import AzraqRoadsPNG from "../assets/azraq-roads.png";
import { ZavosInstances } from "../instances/ZavosInstance";
import { HitoshikaInstances } from "../instances/HitoshikaInstance";
import { XerostiaInstances } from "../instances/XerostiaInstance";
import { KhenonInstances } from "../instances/KhenonInstance";
import { AzraqInstances } from "../instances/AzraqInstance";

extend({ OrbitControls });

const CameraController = ({ mapRef }) => {
  const { camera, gl, viewport } = useThree();

  var _v = new THREE.Vector3();
  if (mapRef) {
    // gsap.to(camera.position, { y: 50, duration: 1 });
  }
  camera.far = 2000;
  useEffect(() => {
    camera.position.set(0, 0, 0);
    camera.rotation.set(-1.57, 0, 0);
    const controls = new OrbitControls(camera, gl.domElement);
    camera.rotation.set(-1.57, 0, 0);
    gsap.to(camera.position, { y: 1900, duration: 2 });
    controls.minDistance = 5;
    controls.maxDistance = 1900;
    controls.autoRotate = false;
    controls.panSpeed = 2.5;
    controls.zoomSpeed = 2.5;
    controls.screenSpacePanning = false;
    controls.touches = { ONE: 1, TWO: 1 };
    controls.autoRotate = false;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.maxPolarAngle = 0;

    controls.addEventListener("change", function (e) {
      var minPan = new THREE.Vector3(
        -2900 + e.target.object.position.y + 1,
        0,
        -4440 + e.target.object.position.y + 1
      );
      var maxPan = new THREE.Vector3(
        2900 - e.target.object.position.y - 1,
        0,
        4440 - e.target.object.position.y - 1
      );
      if (e.target.object.position.y < controls.maxDistance) {
        camera.rotateX(Math.PI / e.target.object.position.y);
        // camera.rotateX(
        //   Math.PI / e.target.object.position.y < 0.5
        //     ? Math.PI / e.target.object.position.y
        //     : 0.5
        // );
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
  const hitoshikaPlots = useLoader(TextureLoader, HitoshikaPlotsPNG);
  const hitoshikaRoads = useLoader(TextureLoader, HitoshikaRoadsPNG);
  const xerostiaPlots = useLoader(TextureLoader, XerostiaPlotsPNG);
  const xerostiaRoads = useLoader(TextureLoader, XerostiaRoadsPNG);
  const khenonPlots = useLoader(TextureLoader, KhenonPlotsPNG);
  const khenonRoads = useLoader(TextureLoader, KhenonRoadsPNG);
  const azraqPlots = useLoader(TextureLoader, AzraqPlotsPNG);
  const azraqRoads = useLoader(TextureLoader, AzraqRoadsPNG);
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
      x: { value: 0, min: -10000, max: 10000, step: 0.01 },
      y: { value: 0, min: -10000, max: 10000, step: 0.01 },
      z: { value: 0, min: -100, max: 100, step: 0.01 },
      rotateZ: { value: 0, min: -100, max: 100, step: 0.01 },
    };
  }, []);
  const [filters, setFilters] = useState("All");
  const [plotLeads, setPlotLeads] = useState(false);
  const [currentPlot, setCurrentPlot] = useState(null);
  const [plotCoordinates, setPlotCoordinates] = useState(null);
  const pA = useControls("Polyhedron A", options);

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
      <group ref={globeRef} rotation={[-1.57, 0, 0]}>
        {/* <a.group ref={globeRef} {...spring} {...bind()}> */}
        <ZavosInstances />
        <HitoshikaInstances />
        <XerostiaInstances />
        <KhenonInstances />
        <AzraqInstances />
        <mesh receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[8000, 8000]} position={[0, 0, 0]} />
          <meshStandardMaterial
            attach="material"
            map={texture}
            // bumpMap={normalMap}
            // bumpScale={5}
            // normalScale={0.5}
          />
        </mesh>
        {/* <mesh position={[0, 0, 1]}>
          <planeGeometry args={[4000, 4000]} />
          <meshBasicMaterial
            attach="material"
            map={traceMap}
            transparent={true}
            opacity={0.9}
          />
        </mesh> */}
        <mesh position={[-500, -1000, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={hitoshikaRoads}
            transparent={true}
            opacity={1}
          />
        </mesh>
        {/* <mesh position={[-500, -1000, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={hitoshikaPlots}
            transparent={true}
            opacity={0.5}
          />
        </mesh> */}
        <mesh position={[1500, -500, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={xerostiaRoads}
            transparent={true}
            opacity={1}
          />
        </mesh>
        {/* <mesh position={[1500, -500, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={xerostiaPlots}
            transparent={true}
            opacity={0.5}
          />
        </mesh> */}
        <mesh position={[-1500, -1000, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={khenonRoads}
            transparent={true}
            opacity={1}
          />
        </mesh>
        {/* <mesh position={[-1500, -1000, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={khenonPlots}
            transparent={true}
            opacity={0.5}
          />
        </mesh> */}

        <mesh position={[500, -500, 4]}>
          <planeGeometry args={[1000, 1000]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={roadsOnly}
            transparent={true}
            opacity={1}
          />
        </mesh>
        <mesh position={[1250, 1250, 4]}>
          <planeGeometry args={[1500, 1500]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={azraqPlots}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
        <mesh position={[1250, 1250, 4]}>
          <planeGeometry args={[1500, 1500]} position={[0, 0, 1]} />
          <meshBasicMaterial
            attach="material"
            map={azraqRoads}
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
        {/* <mesh position={[500, -500, 4]}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial
            attach="material"
            map={plotsAndRoads}
            transparent={true}
            opacity={0.2}
          />
        </mesh> */}

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
        <mesh position={[pA.x, pA.y, 5]} rotation={[0, 0, pA.rotateZ]}>
          <planeGeometry args={[23, 23]} position={[0, 0, 0]} />
          <meshBasicMaterial
            attach="material"
            // map={plotsOnly}
            color={"#fff"}
            transparent={true}
            opacity={1}
          />
        </mesh>
        {/* <mesh position={[pA.x, pA.y, 3]} rotation={[0, 0, pA.rotateZ]}>
          <planeGeometry args={[23, 23]} position={[0, 0, 0]} />
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
      {/* <ZoomInOut camera={camera} zoomValue={9} minValue={9} maxValue={45} /> */}
    </>
  );
}
