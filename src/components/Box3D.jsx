import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane } from "@react-three/cannon";

function Box(props) {
  const mesh = useRef();
  const [state, setState] = useState({ isHovered: false, isActive: false });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.position.y =
      mesh.current.position.y + Math.sin(time * 2) / 100;
    mesh.current.rotation.y = mesh.current.rotation.x += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={state.isHovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setState({ ...state, isActive: !state.isActive })}
      onPointerOver={(e) => setState({ ...state, isHovered: true })}
      onPointerOut={(e) => setState({ ...state, isHovered: false })}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshLambertMaterial
        attach="material"
        color={state.isActive ? "#820263" : "#D90368"}
      />
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
      <meshLambertMaterial attach="material" color="white" />
    </mesh>
  );
}

function Box3D() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[2, 2, 2]} angle={0.15} penumbra={1} />
      <pointLight position={[4, 4, 4]} />

      <Physics>
        <Stars />
        <Box position={[0, 0, 0]} />
        <Plane />
      </Physics>

      <OrbitControls />
    </Canvas>
  );
}

export default Box3D;
