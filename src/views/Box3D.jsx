import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sky } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import "../styles/box3d.css";

function Box(props) {
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
  return (
    <mesh castShadow>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}

function Plane(props) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, 0]}
      color="white"
      receiveShadow
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <shadowMaterial attach="material" color="lightblue" opacity={0.3} />
    </mesh>
  );
}

function Box3D() {
  return (
    <Canvas>
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 0, -20]} intensity={0.5} />
      <pointLight position={[0, -10, 0]} intensity={1.5} />
      <ambientLight intensity={0.2} />

      <Physics>
        <Box />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -3, 0]}
          receiveShadow
        >
          <planeBufferGeometry attach="geometry" args={[100, 100]} />
          <shadowMaterial attach="material" opacity={0.3} />
        </mesh>
      </Physics>

      <OrbitControls />
    </Canvas>
  );
}

export default Box3D;
