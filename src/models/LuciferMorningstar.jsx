/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Nathang30 (https://sketchfab.com/Nathang30)
license: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
source: https://sketchfab.com/3d-models/lucifer-morningstar-f840410d898f4821861315ec9dfe52c1
title: Lucifer Morningstar
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import modelUrl from "../graphics/lucifer_morningstar.glb";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(modelUrl);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          userData={{ name: "Sketchfab_model" }}
        >
          <group
            name="Lucifer_objcleanermaterialmergergles"
            userData={{ name: "Lucifer .obj.cleaner.materialmerger.gles" }}
          >
            <group name="Object_5" userData={{ name: "Object_5" }} />
            <mesh
              name="Object_3"
              castShadow
              receiveShadow
              geometry={nodes.Object_3.geometry}
              material={materials["Material.003"]}
              userData={{ name: "Object_3" }}
            />
            <mesh
              name="Object_2"
              castShadow
              receiveShadow
              geometry={nodes.Object_2.geometry}
              material={materials["Material.002"]}
              userData={{ name: "Object_2" }}
            />
            <mesh
              name="Object_4"
              castShadow
              receiveShadow
              geometry={nodes.Object_4.geometry}
              material={materials["Material.004"]}
              userData={{ name: "Object_4" }}
            />
            <mesh
              name="Object_7"
              castShadow
              receiveShadow
              geometry={nodes.Object_7.geometry}
              material={materials["Material.001"]}
              userData={{ name: "Object_7" }}
            />
            <mesh
              name="Object_6"
              castShadow
              receiveShadow
              geometry={nodes.Object_6.geometry}
              material={materials["material_0.002"]}
              userData={{ name: "Object_6" }}
            />
          </group>
        </group>
        <group
          name="Light"
          position={[4.0762, 5.9039, -1.0055]}
          rotation={[1.8901, 0.8806, -2.0452]}
          userData={{ name: "Light" }}
        />
        <group
          name="Camera"
          position={[7.3589, 4.9583, 6.9258]}
          rotation={[1.2421, 0.33, -0.7597]}
          userData={{ name: "Camera" }}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          color="white"
          receiveShadow
        >
          <planeBufferGeometry attach="geometry" args={[5, 5]} />
          <meshLambertMaterial attach="material" color="white" />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(modelUrl);
