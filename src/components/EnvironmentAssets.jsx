import React, { useMemo } from 'react';
import { usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';

// Realistic Road with Asphalt and dashed lines
export const Road = ({ position, length }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
    type: 'Static',
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[24, length]} />
      <meshStandardMaterial color="#2c2c2c" roughness={0.9} />
      
      {/* Center Dashed Line */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, length]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        {/* We can use a basic striped effect by just placing multiple smaller planes or using a single textured line, but for performance, we'll keep it simple */}
      </mesh>
    </mesh>
  );
};

// Sidewalks on the edges of the road
export const Sidewalk = ({ position, length }) => {
  const [ref] = useBox(() => ({
    position,
    args: [8, 0.5, length],
    type: 'Static',
  }));

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={[8, 0.5, length]} />
      <meshStandardMaterial color="#666666" roughness={1} />
    </mesh>
  );
};

// A Streetlight prop
export const Streetlight = ({ position }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 8, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Arm */}
      <mesh position={[-1.5, 8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Light Bulb - purely emissive during the day */}
      <mesh position={[-3, 7.9, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

    </group>
  );
};

// Detailed Building with variable structure
export const Building = ({ position, width, depth, height, color }) => {
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
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Roof detail */}
      <mesh position={[position[0], height + 0.5, position[2]]} castShadow>
        <boxGeometry args={[width - 1, 1, depth - 1]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
    </group>
  );
};

// Procedural City Block (GTA style)
export const CityBlock = ({ startZ, length }) => {
  const assets = useMemo(() => {
    const arr = [];
    const lights = [];
    const numBuildings = Math.floor(length / 30);
    const buildingColors = ['#888888', '#aaaaaa', '#555555', '#6b5b4b', '#7c8b9b'];
    
    for (let i = 0; i < numBuildings; i++) {
      const z = startZ - i * 30 - 15;
      
      // Left side building
      const leftHeight = 20 + Math.random() * 60;
      const leftWidth = 15 + Math.random() * 10;
      const leftDepth = 20 + Math.random() * 5;
      arr.push({
        position: [-22, 0, z],
        width: leftWidth,
        height: leftHeight,
        depth: leftDepth,
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
      });
      
      // Right side building
      const rightHeight = 20 + Math.random() * 60;
      const rightWidth = 15 + Math.random() * 10;
      const rightDepth = 20 + Math.random() * 5;
      arr.push({
        position: [22, 0, z],
        width: rightWidth,
        height: rightHeight,
        depth: rightDepth,
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
      });

      // Add streetlights every 30 units
      lights.push({ position: [-13, 0, z], side: 'left' });
      lights.push({ position: [13, 0, z], side: 'right' });
    }
    return { buildings: arr, lights };
  }, [startZ, length]);

  return (
    <group>
      {/* Road */}
      <Road position={[0, 0, startZ - length / 2]} length={length} />
      
      {/* Left Sidewalk */}
      <Sidewalk position={[-16, 0.25, startZ - length / 2]} length={length} />
      
      {/* Right Sidewalk */}
      <Sidewalk position={[16, 0.25, startZ - length / 2]} length={length} />

      {/* Buildings */}
      {assets.buildings.map((b, i) => (
        <Building key={`b-${i}`} position={b.position} width={b.width} height={b.height} depth={b.depth} color={b.color} />
      ))}

      {/* Streetlights */}
      {assets.lights.map((l, i) => {
        // Rotate right side streetlights to face the road
        const rotationY = l.side === 'right' ? Math.PI : 0;
        return (
          <group key={`l-${i}`} rotation={[0, rotationY, 0]} position={[l.position[0], l.position[1], l.position[2]]}>
            <Streetlight position={[0,0,0]} />
          </group>
        );
      })}
    </group>
  );
};
