import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { usePlayerControls } from '../utils/usePlayerControls';
import Model from '../models/LuciferMorningstar';
import CameraFollow from './CameraFollow';

const SPEED = 14;
const JUMP_FORCE = 12;

const Player = () => {
  const { forward, backward, left, right, jump } = usePlayerControls();
  
  // Dynamic box with locked rotation to prevent rolling.
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [1.2, 2.4, 1.2], 
    fixedRotation: true,
    material: { friction: 0 }, // We'll control stopping manually
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const modelRef = useRef();
  const currentRotation = useRef(Math.PI); // Track current visual rotation

  useFrame((state, delta) => {
    // Movement Logic
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    direction.subVectors(frontVector, sideVector);

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(SPEED);
    }

    // Use impulses to reach target velocity without overriding Y axis collision resolution
    const currentVelX = velocity.current[0];
    const currentVelZ = velocity.current[2];
    
    // We want to reach direction.x and direction.z instantly (snappy controls)
    const impulseX = (direction.x - currentVelX);
    const impulseZ = (direction.z - currentVelZ);
    
    api.applyImpulse([impulseX, 0, impulseZ], [0, 0, 0]);

    // Jump Logic
    // We check if Y velocity is near zero to allow jumping (simple ground check)
    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.applyImpulse([0, JUMP_FORCE, 0], [0, 0, 0]);
    }

    // Procedural Animation (Grounded feel)
    if (modelRef.current) {
      const speed = Math.sqrt(direction.x ** 2 + direction.z ** 2);
      const time = state.clock.getElapsedTime();

      let targetRotationY = currentRotation.current; 
      
      if (speed > 0.1) {
        // Find rotation based on input direction
        targetRotationY = Math.atan2(direction.x, direction.z);
        currentRotation.current = targetRotationY;
        
        // Exaggerated bobbing to simulate running stride
        const bobOffset = Math.abs(Math.sin(time * 12)) * 0.4;
        modelRef.current.position.y = THREE.MathUtils.lerp(
          modelRef.current.position.y,
          -1.2 + bobOffset, // Base offset to touch ground + bob
          0.3
        );
        
        // Lean into the run
        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0.2, 0.1);
        
        // Slight side-to-side sway based on stride
        modelRef.current.rotation.z = Math.sin(time * 6) * 0.05;
      } else {
        // Idle state: drop to base height and stand straight
        modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, -1.2, 0.2);
        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0, 0.2);
        modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, 0, 0.2);
      }
      
      // Smoothly rotate character model (slerp)
      const currentQuat = modelRef.current.quaternion.clone();
      const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotationY);
      currentQuat.slerp(targetQuat, 12 * delta);
      modelRef.current.quaternion.copy(currentQuat);
    }
    
    if (typeof window !== 'undefined' && ref.current) {
        window.playerY = ref.current.position.y;
    }
  });

  return (
    <>
      <CameraFollow targetRef={ref} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial visible={false} />
        <group ref={modelRef}>
          {/* Adjust model scale if needed. Assuming 1 is okay, but if it's too small/big, change here */}
          <Model scale={[1.2, 1.2, 1.2]} />
        </group>
      </mesh>
    </>
  );
};

export default Player;
