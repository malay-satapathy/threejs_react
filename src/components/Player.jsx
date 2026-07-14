import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { usePlayerControls } from '../utils/usePlayerControls';
import Model from '../models/LuciferMorningstar';
import CameraFollow from './CameraFollow';

const SPEED = 12;
const JUMP_FORCE = 10;

const Player = () => {
  const { forward, backward, left, right, jump } = usePlayerControls();
  
  // Use a physics sphere but LOCK the rotation so the model doesn't tumble!
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [1], // radius 1 sphere
    fixedRotation: true, // CRITICAL FIX: prevents the sphere from rolling like a ball
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

    // Jump Logic (only if roughly on the ground)
    if (jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    // Natural Bobbing & Leaning effect when moving
    if (modelRef.current) {
      const speed = Math.sqrt(direction.x ** 2 + direction.z ** 2);
      const time = state.clock.getElapsedTime();

      // Determine target rotation based on movement direction
      // Default model orientation might require offsetting. If the model looks backwards, add Math.PI
      let targetRotationY = Math.PI; 
      
      if (speed > 0.1) {
        // Calculate the angle the player is moving towards
        targetRotationY = Math.atan2(direction.x, direction.z);
        
        // Bobbing (smoother)
        modelRef.current.position.y = THREE.MathUtils.lerp(
          modelRef.current.position.y,
          (Math.sin(time * 10) * 0.15) - 1, // Offset by -1 to align with sphere bottom
          0.2
        );
        
        // Leaning slightly forward when running
        modelRef.current.rotation.x = THREE.MathUtils.lerp(
          modelRef.current.rotation.x,
          0.1, // lean forward
          0.1
        );
      } else {
        // Idle
        modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, -1, 0.1);
        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0, 0.1);
      }
      
      // Smoothly rotate the model to face the movement direction
      // We use a quaternion slerp for smooth, shortest-path rotation
      const currentQuat = modelRef.current.quaternion.clone();
      const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotationY);
      currentQuat.slerp(targetQuat, 10 * delta);
      modelRef.current.quaternion.copy(currentQuat);
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
