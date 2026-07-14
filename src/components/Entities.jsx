import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Autorickshaw (Yellow and Green blocky vehicle)
export const Autorickshaw = ({ initialPosition, waypoints, speed = 4 }) => {
  const groupRef = useRef();
  const currentWaypoint = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !waypoints || waypoints.length === 0) return;

    const target = waypoints[currentWaypoint.current];
    const targetVec = new THREE.Vector3(target[0], 0, target[2]);
    const currentPos = groupRef.current.position.clone();
    currentPos.y = 0; // Ignore Y for distance

    const dist = currentPos.distanceTo(targetVec);

    if (dist < 0.5) {
      currentWaypoint.current = (currentWaypoint.current + 1) % waypoints.length;
    } else {
      const dir = targetVec.sub(currentPos).normalize();
      
      // Move forward
      groupRef.current.position.add(dir.multiplyScalar(speed * delta));
      
      // Look at target smoothly
      const lookTarget = groupRef.current.position.clone().add(dir);
      groupRef.current.lookAt(lookTarget);
    }
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Chassis Bottom (Green) */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.6, 2.2]} />
        <meshStandardMaterial color="#228b22" roughness={0.8} />
      </mesh>
      {/* Cabin (Yellow) */}
      <mesh position={[0, 1.2, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.2, 1.8]} />
        <meshStandardMaterial color="#ffd700" roughness={0.6} />
      </mesh>
      {/* Roof (Black canvas) */}
      <mesh position={[0, 1.85, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.1, 2.0]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      {/* Front Wheel */}
      <mesh position={[0, 0.25, 1.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Back Wheels */}
      <mesh position={[-0.7, 0.25, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.7, 0.25, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

// Procedural Cow (White and Black blocky animal)
export const Cow = ({ initialPosition, radius = 5, speed = 1 }) => {
  const groupRef = useRef();
  
  // Random roaming logic
  const targetPos = useRef(new THREE.Vector3(
    initialPosition[0] + (Math.random() - 0.5) * radius,
    initialPosition[1],
    initialPosition[2] + (Math.random() - 0.5) * radius
  ));
  
  const idleTimer = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (idleTimer.current > 0) {
      idleTimer.current -= delta;
      return;
    }

    const currentPos = groupRef.current.position.clone();
    currentPos.y = initialPosition[1]; // keep flat
    const dist = currentPos.distanceTo(targetPos.current);

    if (dist < 0.2) {
      // Pick new target or idle
      if (Math.random() > 0.5) {
        idleTimer.current = 2 + Math.random() * 4; // Idle for 2-6 seconds
      } else {
        targetPos.current.set(
          initialPosition[0] + (Math.random() - 0.5) * radius * 2,
          initialPosition[1],
          initialPosition[2] + (Math.random() - 0.5) * radius * 2
        );
      }
    } else {
      const dir = targetPos.current.clone().sub(currentPos).normalize();
      groupRef.current.position.add(dir.multiplyScalar(speed * delta));
      
      // Look at target smoothly
      const lookTarget = groupRef.current.position.clone().add(dir);
      groupRef.current.lookAt(lookTarget);
    }
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.7, 1.6]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      {/* Black spot */}
      <mesh position={[0, 0.81, 0.2]} castShadow>
        <boxGeometry args={[0.82, 0.5, 0.6]} />
        <meshStandardMaterial color="#222222" roughness={1} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.5, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.3, 0.4, 0.6]} castShadow><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#ddd" /></mesh>
      <mesh position={[0.3, 0.4, 0.6]} castShadow><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#ddd" /></mesh>
      <mesh position={[-0.3, 0.4, -0.6]} castShadow><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#ddd" /></mesh>
      <mesh position={[0.3, 0.4, -0.6]} castShadow><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#ddd" /></mesh>
    </group>
  );
};
