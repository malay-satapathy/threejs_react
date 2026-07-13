import React, { useMemo } from 'react';
import { usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';

// Road texture/material generator
export const Road = ({ position, length }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
    type: 'Static',
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, length]} />
      <meshStandardMaterial color="#333333" />
      {/* Center line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, length]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </mesh>
  );
};

export const Sidewalk = ({ position, length, side }) => {
  const xOffset = side === 'left' ? -12 : 12;
  const [ref] = useBox(() => ({
    position: [position[0] + xOffset, 0.25, position[2]],
    args: [4, 0.5, length],
    type: 'Static',
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[4, 0.5, length]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );
};

export const Building = ({ position, scale, color }) => {
  const [ref] = useBox(() => ({
    position,
    args: scale,
    type: 'Static',
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
};

// Generates random buildings alongside a street chunk
export const CityBlock = ({ startZ, length }) => {
  // Generate stable random buildings based on position
  const buildings = useMemo(() => {
    const arr = [];
    const numBuildings = Math.floor(length / 20);
    for (let i = 0; i < numBuildings; i++) {
      const z = startZ - i * 20 - 10;
      // Left side
      const leftHeight = 10 + Math.random() * 30;
      arr.push({
        position: [-20, leftHeight / 2, z],
        scale: [12, leftHeight, 15],
        color: new THREE.Color().setHSL(Math.random(), 0.3, 0.5),
      });
      // Right side
      const rightHeight = 10 + Math.random() * 30;
      arr.push({
        position: [20, rightHeight / 2, z],
        scale: [12, rightHeight, 15],
        color: new THREE.Color().setHSL(Math.random(), 0.3, 0.5),
      });
    }
    return arr;
  }, [startZ, length]);

  return (
    <group>
      <Road position={[0, 0, startZ - length / 2]} length={length} />
      <Sidewalk position={[0, 0, startZ - length / 2]} length={length} side="left" />
      <Sidewalk position={[0, 0, startZ - length / 2]} length={length} side="right" />
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} scale={b.scale} color={b.color} />
      ))}
    </group>
  );
};
