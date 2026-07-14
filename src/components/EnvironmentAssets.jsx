import React, { useMemo } from 'react';
import { usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';

// Synthwave Road with a glowing grid
export const Road = ({ position, length }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
    type: 'Static',
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, length]} />
      {/* Dark reflective road surface */}
      <meshStandardMaterial color="#050510" roughness={0.2} metalness={0.8} />
      
      {/* Emissive grid lines for synthwave aesthetic */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, length]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>
      
      {/* Left border */}
      <mesh position={[-15, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, length]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      
      {/* Right border */}
      <mesh position={[15, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, length]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
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
      {/* Emissive wireframe buildings for synthwave feel */}
      <meshStandardMaterial color="#0a0a1a" roughness={0.8} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...scale)]} />
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>
    </mesh>
  );
};

// Generates random buildings alongside a street chunk
export const CityBlock = ({ startZ, length }) => {
  // Generate stable random buildings based on position
  const buildings = useMemo(() => {
    const arr = [];
    const numBuildings = Math.floor(length / 25);
    const neonColors = ['#ff00ff', '#00ffff', '#ff0055', '#00ff88'];
    
    for (let i = 0; i < numBuildings; i++) {
      const z = startZ - i * 25 - 12.5;
      
      // Left side building
      const leftHeight = 15 + Math.random() * 40;
      arr.push({
        position: [-22, leftHeight / 2, z],
        scale: [10, leftHeight, 15],
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
      });
      
      // Right side building
      const rightHeight = 15 + Math.random() * 40;
      arr.push({
        position: [22, rightHeight / 2, z],
        scale: [10, rightHeight, 15],
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
      });
    }
    return arr;
  }, [startZ, length]);

  return (
    <group>
      <Road position={[0, 0, startZ - length / 2]} length={length} />
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} scale={b.scale} color={b.color} />
      ))}
    </group>
  );
};
