import { ZavosPlotting } from "../plots/ZavosPlotting_all";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

export function ZavosInstances({ count = 20000, temp = new THREE.Object3D() }) {
  const ref = useRef();
  const color = useMemo(() => new THREE.Color().setHex(0x00ff), []);

  useEffect(() => {
    for (let i = 0; i < ZavosPlotting.length; i++) {
      if (ZavosPlotting[i].type === "Small") {
        temp.scale.set(0.35, 0.35, 0.35);
      } else if (ZavosPlotting[i].type === "Medium") {
        temp.scale.set(0.67, 0.67, 0.67);
      } else if (ZavosPlotting[i].type === "XL") {
        temp.scale.set(2, 2, 2);
      } else if (ZavosPlotting[i].type === "XXL") {
        temp.scale.set(2.9, 2.9, 2.9);
      } else {
        temp.scale.set(1, 1, 1);
      }
      temp.position.set(
        ZavosPlotting[i].position.x - 2000,
        -(ZavosPlotting[i].position.y - 2000),
        4.1
      );
      if (ZavosPlotting[i].commercial === true) {
        color.r = Math.random() * 1;
        color.g = Math.random() * 1;
        color.b = Math.random() * 1;
      } else {
        color.r = 2;
        color.g = 2;
        color.b = 2;
      }
      temp.rotation.set(0, 0, -ZavosPlotting[i].rotation.radian);
      temp.updateMatrix();
      ref.current.setMatrixAt(i, temp.matrix);
      ref.current.setColorAt(i, color);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
  }, []);
  return (
    <instancedMesh
      ref={ref}
      args={[null, null, ZavosPlotting.length]}
      // onClick={(e) => {
      //   e.stopPropagation();
      //   const temp = new THREE.Object3D();
      //   for (let i = 0; i < CelerisPlottingScript.length; i++) {
      //     if (i === e.instanceId) {
      //       console.log(CelerisPlottingScript[i]);
      //       if (CelerisPlottingScript[i].name.includes("small")) {
      //         temp.scale.set(0.35, 0.35, 5);
      //       } else if (CelerisPlottingScript[i].name.includes("Medium")) {
      //         temp.scale.set(0.7, 0.7, 5);
      //       } else {
      //         temp.scale.set(1, 1, 5);
      //       }
      //       temp.position.set(
      //         CelerisPlottingScript[i].position.x,
      //         CelerisPlottingScript[i].position.y,
      //         0.003
      //       );
      //       temp.rotation.set(0, 0, CelerisPlottingScript[i].rotation.radian);
      //       temp.updateMatrix();
      //       ref.current.setMatrixAt(i, temp.matrix);
      //       ref.current.instanceMatrix.needsUpdate = true;
      //     }
      //   }
      //   ref.current.updateMatrix();
      //   // ref.current.setColorAt(e.instanceId, color);
      //   ref.current.instanceColor.needsUpdate = true;
      // }}
      // onPointerEnter={(e) => {
      //   e.stopPropagation();
      //   const temp = new THREE.Object3D();
      //   const color = new THREE.Color().setHex(0x0300ff);

      //   for (let i = 0; i < CelerisPlottingScript.length; i++) {
      //     if (i === e.instanceId) {
      //       if (CelerisPlottingScript[i].name.includes("small")) {
      //         temp.scale.set(0.35, 0.35, 10);
      //       } else if (CelerisPlottingScript[i].name.includes("Medium")) {
      //         temp.scale.set(0.7, 0.7, 15);
      //       } else {
      //         temp.scale.set(1, 1, 20);
      //       }
      //       // temp.scale.set(1.5, 1.5, 1.5);
      //       temp.position.set(
      //         CelerisPlottingScript[i].position.x,
      //         CelerisPlottingScript[i].position.y,
      //         0.003
      //       );
      //       temp.rotation.set(0, 0, CelerisPlottingScript[i].rotation.radian);
      //       temp.updateMatrix();
      //       ref.current.setMatrixAt(i, temp.matrix);
      //       ref.current.instanceMatrix.needsUpdate = true;
      //     }
      //   }
      //   ref.current.updateMatrix();
      //   // ref.current.setColorAt(e.instanceId, color);
      //   ref.current.instanceColor.needsUpdate = true;
      //   document.querySelector("#root").style.cursor = "pointer";
      // }}
      // onPointerLeave={(e) => {
      //   e.stopPropagation();
      //   const temp = new THREE.Object3D();
      //   for (let i = 0; i < CelerisPlotting.length; i++) {
      //     if (i === e.instanceId) {
      //       if (CelerisPlotting[i].size === "small") {
      //         // temp.scale.set(0.35, 0.35, 0.35);
      //         gsap.from(temp.scale, { x: 0.35, y: 0.35, z: 0.35, duration: 4 });
      //       } else if (CelerisPlotting[i].size === "medium") {
      //         temp.scale.set(0.7, 0.7, 0.7);
      //       } else {
      //         temp.scale.set(1, 1, 1);
      //       }
      //       temp.position.set(
      //         CelerisPlotting[i].position.x,
      //         CelerisPlotting[i].position.y,
      //         0.003
      //       );
      //       temp.rotation.set(0, 0, CelerisPlotting[i].rotationZ);
      //       temp.updateMatrix();
      //       ref.current.setMatrixAt(i, temp.matrix);
      //       ref.current.instanceMatrix.needsUpdate = true;
      //     }
      //   }
      //   ref.current.updateMatrix();
      //   // ref.current.setColorAt(e.instanceId, color);
      //   ref.current.instanceColor.needsUpdate = true;
      //   document.querySelector("#root").style.cursor = "grab";
      // }}
    >
      <planeGeometry args={[23, 23]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}