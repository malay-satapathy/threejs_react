import React, { useMemo } from 'react';
import { usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { IndianBuilding, ChaiStall, IndianStreetlight, BanyanTree } from './IndianCityAssets';
import { Autorickshaw, Cow } from './Entities';

const ISLAND_SIZE = 120; // 120x120 playable area

// Invisible Wall component to keep player on island
const BoundaryWall = ({ position, args }) => {
  useBox(() => ({ type: 'Static', position, args }));
  return null; // Invisible
};

const IndianIsland = () => {
  // Ground (Island) - Use a thin Static box instead of Plane for better collision stability
  const [groundRef] = useBox(() => ({
    position: [0, -0.5, 0],
    args: [ISLAND_SIZE, 1, ISLAND_SIZE],
    type: 'Static',
  }));

  React.useEffect(() => {
    console.log("IndianIsland MOUNTED. Ground ref:", !!groundRef.current);
  }, []);

  // Generative Layout
  const layout = useMemo(() => {
    const buildings = [];
    const cows = [];
    const stalls = [];
    const trees = [];
    
    // Create some chaotic Indian city blocks
    const buildingColors = ['#eec39a', '#f4a261', '#e76f51', '#e9c46a', '#ffffff', '#8ab17d'];
    
    // Two main roads intersecting
    // We will place buildings avoiding the cross shape in the middle (roads)
    for (let x = -50; x <= 50; x += 15) {
      for (let z = -50; z <= 50; z += 15) {
        // Leave space for roads at x=0 and z=0
        if (Math.abs(x) < 8 || Math.abs(z) < 8) continue;
        
        // Randomly skip some spots for open spaces
        if (Math.random() > 0.8) {
          if (Math.random() > 0.5) trees.push([x, 0, z]);
          continue;
        }
        
        buildings.push({
          position: [x + (Math.random()*4 - 2), 0, z + (Math.random()*4 - 2)],
          width: 8 + Math.random() * 6,
          depth: 8 + Math.random() * 6,
          height: 10 + Math.random() * 20,
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)]
        });
      }
    }

    // Place some chai stalls near the roads
    stalls.push([10, 0, 10]);
    stalls.push([-12, 0, -8]);
    stalls.push([12, 0, -20]);

    // Place some cows wandering near the roads
    cows.push([-15, 0, 5]);
    cows.push([5, 0, -15]);
    cows.push([20, 0, 0]);
    cows.push([-25, 0, 20]);

    return { buildings, stalls, trees, cows };
  }, []);

  return (
    <group>
      {/* Island Ground Physics (Dirt/Sand color) */}
      <mesh ref={groundRef} receiveShadow>
        <boxGeometry args={[ISLAND_SIZE, 1, ISLAND_SIZE]} />
        <meshStandardMaterial color="#c2b280" roughness={1} />
      </mesh>

      {/* Roads (Grey Asphalt laid over dirt) */}
      {/* Vertical Road */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, ISLAND_SIZE]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      {/* Horizontal Road */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ISLAND_SIZE, 14]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>

      {/* Surrounding Water (Vast ocean) */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#1ca3ec" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Invisible Boundaries to keep player from falling in water */}
      <BoundaryWall position={[0, 10, ISLAND_SIZE / 2]} args={[ISLAND_SIZE, 20, 1]} />
      <BoundaryWall position={[0, 10, -ISLAND_SIZE / 2]} args={[ISLAND_SIZE, 20, 1]} />
      <BoundaryWall position={[ISLAND_SIZE / 2, 10, 0]} args={[1, 20, ISLAND_SIZE]} />
      <BoundaryWall position={[-ISLAND_SIZE / 2, 10, 0]} args={[1, 20, ISLAND_SIZE]} />

      {/* Static City Assets */}
      {layout.buildings.map((b, i) => (
        <IndianBuilding key={`b-${i}`} {...b} />
      ))}
      
      {layout.stalls.map((pos, i) => (
        <ChaiStall key={`s-${i}`} position={pos} rotation={[0, Math.random() * Math.PI, 0]} />
      ))}

      {layout.trees.map((pos, i) => (
        <BanyanTree key={`t-${i}`} position={pos} />
      ))}

      {/* Streetlights along the main road */}
      {[-40, -20, 20, 40].map((z, i) => (
        <IndianStreetlight key={`l1-${i}`} position={[-8, 0, z]} rotation={[0, Math.PI/2, 0]} />
      ))}
      {[-40, -20, 20, 40].map((z, i) => (
        <IndianStreetlight key={`l2-${i}`} position={[8, 0, z]} rotation={[0, -Math.PI/2, 0]} />
      ))}

      {/* Dynamic Entities */}
      {/* Cows roaming */}
      {layout.cows.map((pos, i) => (
        <Cow key={`cow-${i}`} initialPosition={pos} radius={8} />
      ))}

      {/* Autorickshaws driving on the road */}
      <Autorickshaw 
        initialPosition={[4, 0, -40]} 
        waypoints={[[4, 0, -40], [4, 0, 40], [-4, 0, 40], [-4, 0, -40]]} 
        speed={15} 
      />
      <Autorickshaw 
        initialPosition={[-4, 0, 30]} 
        waypoints={[[-4, 0, 30], [-4, 0, -40], [4, 0, -40], [4, 0, 30]]} 
        speed={18} 
      />
      <Autorickshaw 
        initialPosition={[40, 0, 4]} 
        waypoints={[[40, 0, 4], [-40, 0, 4], [-40, 0, -4], [40, 0, -4]]} 
        speed={14} 
      />
    </group>
  );
};

export default IndianIsland;
