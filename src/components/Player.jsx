import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { usePlayerControls } from '../utils/usePlayerControls';
import Model from '../models/LuciferMorningstar';
import CameraFollow from './CameraFollow';

const SPEED = 10;
const JUMP_FORCE = 8;

const Player = () => {
  const { forward, backward, left, right, jump } = usePlayerControls();
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [1], // radius 1 sphere
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const modelRef = useRef();

  useFrame((state, delta) => {
    // Movement Logic
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Jump Logic (only if touching the ground, simplified check)
    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    // Natural Bobbing & Leaning effect when moving
    if (modelRef.current) {
      const speed = Math.sqrt(direction.x ** 2 + direction.z ** 2);
      const time = state.clock.getElapsedTime();

      if (speed > 0.1) {
        // Bobbing
        modelRef.current.position.y = Math.sin(time * 15) * 0.1 - 1; // offset by -1 to align with sphere bottom
        // Leaning into turns
        modelRef.current.rotation.z = THREE.MathUtils.lerp(
          modelRef.current.rotation.z,
          direction.x * -0.05,
          0.1
        );
        // Leaning forward
        modelRef.current.rotation.x = THREE.MathUtils.lerp(
          modelRef.current.rotation.x,
          direction.z * -0.05,
          0.1
        );
      } else {
        // Idle
        modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, -1, 0.1);
        modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, 0, 0.1);
        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0, 0.1);
      }
      
      // Keep model rotated to face back (default model orientation might be facing +Z)
      modelRef.current.rotation.y = Math.PI;
    }
  });

  return (
    <>
      <CameraFollow targetRef={ref} />
      <mesh ref={ref}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial visible={false} />
        <group ref={modelRef}>
          <Model scale={[1, 1, 1]} />
        </group>
      </mesh>
    </>
  );
};

export default Player;
