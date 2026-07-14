import React from 'react';
import { useBox } from '@react-three/cannon';

// Typical Indian Urban Building (bright, varied colors, flat roofs)
export const IndianBuilding = ({ position, width, depth, height, color }) => {
  const [ref] = useBox(() => ({
    position: [position[0], height / 2, position[2]],
    args: [width, height, depth],
    type: 'Static',
  }));

  return (
    <group>
      {/* Main Building Block */}
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      
      {/* Flat Roof detail (Parapet wall) */}
      <mesh position={[position[0], height + 0.5, position[2]]} castShadow>
        <boxGeometry args={[width, 1, depth]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[position[0], height + 0.5, position[2]]} receiveShadow>
        <boxGeometry args={[width - 0.5, 1.1, depth - 0.5]} />
        <meshStandardMaterial color="#333333" roughness={1} />
      </mesh>

      {/* Basic Doors/Windows pattern based on height/width */}
      <group position={[position[0], 0, position[2]]}>
        <mesh position={[0, 2, depth / 2 + 0.05]}>
          <boxGeometry args={[width * 0.3, 4, 0.1]} />
          <meshStandardMaterial color="#4d2b18" />
        </mesh>
      </group>
    </group>
  );
};

// A small Chai/Snack Stall
export const ChaiStall = ({ position, rotation = [0, 0, 0] }) => {
  const [ref] = useBox(() => ({
    position: [position[0], 1.5, position[2]],
    args: [3, 3, 2],
    type: 'Static',
  }));

  return (
    <group position={position} rotation={rotation}>
      {/* Base Counter */}
      <mesh ref={ref} position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 2]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      {/* Blue Tarpaulin Awning */}
      <mesh position={[0, 3.5, 0.5]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 3]} />
        <meshStandardMaterial color="#2255ff" roughness={0.7} />
      </mesh>
      {/* Poles */}
      <mesh position={[-1.4, 1.5, 1.8]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh position={[1.4, 1.5, 1.8]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#999" />
      </mesh>
    </group>
  );
};

// Streetlight (Emissive only to save WebGL texture units)
export const IndianStreetlight = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 10, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Arm */}
      <mesh position={[-1.5, 9.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Light Bulb - Emissive only */}
      <mesh position={[-3, 9.7, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#ffeedd" emissive="#ffddaa" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

// Banyan Tree (Stylized)
export const BanyanTree = ({ position }) => {
  const [ref] = useBox(() => ({
    position: [position[0], 2, position[2]],
    args: [1, 4, 1],
    type: 'Static',
  }));

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh ref={ref} position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 4, 7]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
      </mesh>
      {/* Leaves / Canopy */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3.5, 7, 7]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 4.5, 1.5]} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 7, 7]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.8} />
      </mesh>
      <mesh position={[-1.5, 4.5, -1.5]} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 7, 7]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.8} />
      </mesh>
    </group>
  );
};
