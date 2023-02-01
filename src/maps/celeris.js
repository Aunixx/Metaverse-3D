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
    controls.minDistance = 5;
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
        camera.rotateX(
          Math.PI / e.target.object.position.y < 0.5
            ? Math.PI / e.target.object.position.y
            : 0.5
        );
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
  const [items, setItems] = useState(Array(10000).fill(0));
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

  return (
    <>
      {/* <Perf /> */}
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
        {CelerisPlotting?.map((plot, index) => {
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
        })}
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

// import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { TextureLoader } from "three";
// import bumpMap from "../assets/cardano-bump.png";
// import galaxyImg from "../assets/galax-6.png";
// import map from "../assets/celeris.png";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { useGesture, useDrag } from "react-use-gesture";
// import { useSpring, a } from "@react-spring/three";
// import { Html, useGLTF, Sky, useAnimations } from "@react-three/drei";
// import { Perf } from "r3f-perf";
// import ZoomInOut from "../components/zoomInOut/zoomInOut";
// import { CelerisSvg, GlobeView } from "../assets/svg";
// import BackBtn from "../components/backBtn/backBtn";
// import Terrain from "../assets/celeris-terrain-2.glb";
// import CelerisBump from "../assets/cardano-bump.png";
// import * as THREE from "three";
// import waterNorm from "../assets/water_normal10.jpg";
// import { gsap } from "gsap";
// import CelerisPlots from "../assets/celeris-plotting-2.svg";
// // import CelerisPlots from "../assets/celeris-plotting-2.svg";

// extend({ OrbitControls });
// export function Ocean() {
//   const ref = useRef();
//   const gl = useThree((state) => state.gl);
//   const waterNormals = useLoader(THREE.TextureLoader, waterNorm);
//   waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
//   const geom = useMemo(() => new THREE.PlaneGeometry(190, 150), []);
//   const config = useMemo(
//     () => ({
//       textureWidth: 2048,
//       textureHeight: 2048,
//       waterNormals,
//       sunDirection: new THREE.Vector3(),
//       sunColor: 0xffffff,
//       waterColor: 0xffffff,
//       distortionScale: 5,
//       fog: true,
//       format: gl.encoding,
//       wireframe: true,
//       transparent: true,
//       scale: 200,
//     }),
//     [waterNormals]
//   );
//   // console.log(ref.current.material);
//   useEffect(() => {
//     if (ref) {
//       ref.current.material.transparent = true;
//       ref.current.material.opacity = 0.2;
//       ref.current.material.fragmentShader = `uniform sampler2D mirrorSampler;
//       uniform float alpha;
//       uniform float time;
//       uniform float size;
//       uniform float distortionScale;
//       uniform sampler2D normalSampler;
//       uniform vec3 sunColor;
//       uniform vec3 sunDirection;
//       uniform vec3 eye;
//       uniform vec3 waterColor;
//       varying vec4 mirrorCoord;
//       varying vec4 worldPosition;
//       vec4 getNoise( vec2 uv ) {
//         vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
//         vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
//         vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
//         vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
//         vec4 noise = texture2D( normalSampler, uv0 ) +
//           texture2D( normalSampler, uv1 ) +
//           texture2D( normalSampler, uv2 ) +
//           texture2D( normalSampler, uv3 );
//         return noise * 0.5 - 1.0;
//       }

//       void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
//         vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
//         float direction = max( 0.0, dot( eyeDirection, reflection ) );
//         specularColor += pow( direction, shiny ) * sunColor * spec;
//         diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
//       }

//       #include <common>
//       #include <packing>
//       #include <bsdfs>
//       #include <fog_pars_fragment>
//       #include <logdepthbuf_pars_fragment>
//       #include <lights_pars_begin>
//       #include <shadowmap_pars_fragment>
//       #include <shadowmask_pars_fragment>

//       void main() {

//         #include <logdepthbuf_fragment>
//         vec4 noise = getNoise( worldPosition.xz * size );
//         vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

//         vec3 diffuseLight = vec3(0.0);
//         vec3 specularLight = vec3(0.0);

//         vec3 worldToEye = eye-worldPosition.xyz;
//         vec3 eyeDirection = normalize( worldToEye );
//         sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

//         float distance = length(worldToEye);

//         vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
//         vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

//         float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
//         float rf0 = 0.3;
//         float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
//         vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
//         vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.05 ) + reflectionSample * 2.0 + reflectionSample * specularLight ), reflectance);
//         vec3 outgoingLight = albedo;
//         gl_FragColor = vec4( outgoingLight, 0.15 );

//         #include <tonemapping_fragment>
//         #include <fog_fragment>
//       }`;

//       ref.current.material.vertexShader = `
// 				uniform mat4 textureMatrix;
// 				uniform float time;

// 				varying vec4 mirrorCoord;
// 				varying vec4 worldPosition;

// 				#include <common>
// 				#include <fog_pars_vertex>
// 				#include <shadowmap_pars_vertex>
// 				#include <logdepthbuf_pars_vertex>

// 				void main() {
// 					mirrorCoord = modelMatrix * vec4( position, 0.1 );
// 					worldPosition = mirrorCoord.xyzw;
// 					mirrorCoord = textureMatrix * mirrorCoord;
// 					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
// 					gl_Position = projectionMatrix * mvPosition;

// 				#include <beginnormal_vertex>
// 				#include <defaultnormal_vertex>
// 				#include <logdepthbuf_vertex>
// 				#include <fog_vertex>
// 				#include <shadowmap_vertex>
// 			}`;
//     }
//   }, [ref]);
//   // console.log(ref.current.material);

//   useFrame(
//     (state, delta) => (ref.current.material.uniforms.time.value += delta * 0.5)
//   );
//   return (
//     <water
//       ref={ref}
//       args={[geom, config]}
//       rotation-x={-Math.PI / 2}
//       position={[0, -2.3, 20]}
//     />
//   );
// }

// const CameraController = ({ mapRef }) => {
//   const { camera, gl, viewport } = useThree();
//   var _v = new THREE.Vector3();
//   if (mapRef) {
//     // gsap.to(camera.position, { y: 50, duration: 1 });
//   }
//   useEffect(() => {
//     const controls = new OrbitControls(camera, gl.domElement);
//     // camera.rotation.set(mapRef.current.rotation);
//     gsap.to(camera.position, { y: 50, duration: 1 });
//     controls.minDistance = 3;
//     controls.maxDistance = 50;
//     controls.autoRotate = false;
//     controls.panSpeed = 2.5;
//     controls.zoomSpeed = 2.5;
//     controls.screenSpacePanning = false;
//     controls.touches = { ONE: 2, TWO: 2 };
//     controls.mouseButtons = {
//       LEFT: THREE.MOUSE.PAN,
//       MIDDLE: THREE.MOUSE.DOLLY,
//       RIGHT: THREE.MOUSE.ROTATE,
//     };
//     controls.maxPolarAngle = 0;
//     controls.addEventListener("change", function (e) {
//       var minPan = new THREE.Vector3(
//         -65 + e.target.object.position.y + 1,
//         0,
//         -50 + e.target.object.position.y + 1
//       );
//       var maxPan = new THREE.Vector3(
//         65 - e.target.object.position.y - 1,
//         0,
//         110 - e.target.object.position.y - 1
//       );
//       if (e.target.object.position.y < controls.maxDistance) {
//         camera.rotateX(
//           Math.PI / e.target.object.position.y < 0.5
//             ? Math.PI / e.target.object.position.y
//             : 0.5
//         );
//       }
//       _v.copy(controls.target);
//       controls.target.clamp(minPan, maxPan);
//       _v.sub(controls.target);
//       camera.position.sub(_v);
//     });
//     return () => {
//       controls.dispose();
//     };
//   }, [camera, gl]);
//   return null;
// };

// export default function Celeris({ setIsMapView }) {
//   const terrainModel = useGLTF(Terrain);
//   const { camera, gl } = useThree();
//   // const animations = useAnimations(terrainModel.animations, terrainModel.scene);
//   // const controls = useRef();
//   const globeRef = useRef();
//   const [args, setArgs] = useState({ width: 200, height: 200 });
//   const [ry, setRy] = useState(0);

//   useEffect(() => {
//     if (window.innerWidth < 1025 && window.innerWidth > 768) {
//       setArgs({ width: 150, height: 150 });
//     } else if (window.innerWidth < 768) {
//       setArgs({ width: 100, height: 100 });
//     }
//     // animations.actions.KeyAction.play();
//   }, []);
//   function location(p) {
//     let lat = (90 - p.lat) * (Math.PI / 180);
//     let lng = (p.lng + 180) * (Math.PI / 180);
//     let x = -(Math.sin(lat) * Math.cos(lng));
//     let z = Math.sin(lat) * Math.sin(lng);
//     let y = Math.cos(lat);
//     return {
//       x,
//       y,
//       z,
//     };
//   }

//   let lat = 0;
//   let lng = 0;
//   let pin = { lat, lng };
//   let pinPoint = location(pin);
//   lat = -43;
//   lng = -27;
//   let pin2 = { lat, lng };
//   let pinPoint2 = location(pin2);

//   // useEffect(() => {
//   //   if (globeRef) {
//   //     // globeRef.current.position.lookAt(camera.position);
//   //   }
//   // }, [globeRef]);
//   useFrame((state, delta) => {
//     state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   });

//   return (
//     <>
//       <Perf />
//       <fog
//         attach="fog"
//         args={
//           window.innerWidth < 600 ? ["#cff4fe", 5, 1000] : ["#cff4fe", 5, 10000]
//         }
//         side={THREE.BackSide}
//       />
//       {/* <pointLight args={[0xffffff, 0.1, 10000]} position={[0, 10, -10]} /> */}
//       {/* <pointLightHelper /> */}
//       <ambientLight args={[0xffffff, 0.9]} />
//       <CameraController mapRef={globeRef} />
//       {/* <Sky /> */}
//       <group ref={globeRef}>
//         <Html distanceFactor={10.5}>
//           {/* <img src={"../assets/celeris-plotting-map.jpg"} /> */}
//           <CelerisSvg />
//         </Html>
//         <Ocean />
//         <primitive
//           object={terrainModel.scene}
//           scale={(0.1, 0.1, 0.1)}
//           roughness={1}
//           metalness={0}
//           fog={false}
//         />
//       </group>
//       <BackBtn setIsMapView={setIsMapView} />
//       <ZoomInOut camera={camera} zoomValue={9} minValue={9} maxValue={45} />
//     </>
//   );
// }
