import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CityBlock } from './EnvironmentAssets';

const BLOCK_LENGTH = 100;
const VISIBLE_BLOCKS = 3; // Render 3 blocks forward

const InfiniteStreet = () => {
  const { camera } = useThree();
  const [blocks, setBlocks] = useState([
    { id: 0, startZ: 50 },
    { id: 1, startZ: 50 - BLOCK_LENGTH },
    { id: 2, startZ: 50 - BLOCK_LENGTH * 2 },
  ]);

  const nextBlockId = useRef(3);
  const currentZIndex = useRef(0);

  useFrame(() => {
    // Determine which block the camera is currently in
    const camZ = camera.position.z;
    const blockIndex = Math.floor((50 - camZ) / BLOCK_LENGTH);

    // If we've moved forward into a new block, generate new ones ahead and remove old ones behind
    if (blockIndex > currentZIndex.current) {
      currentZIndex.current = blockIndex;
      
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks];
        // Remove the oldest block (farthest behind)
        if (newBlocks.length > VISIBLE_BLOCKS + 1) {
          newBlocks.shift();
        }
        // Add a new block ahead
        const lastBlock = newBlocks[newBlocks.length - 1];
        newBlocks.push({
          id: nextBlockId.current++,
          startZ: lastBlock.startZ - BLOCK_LENGTH,
        });
        return newBlocks;
      });
    }
  });

  return (
    <group>
      {blocks.map((block) => (
        <CityBlock key={block.id} startZ={block.startZ} length={BLOCK_LENGTH} />
      ))}
    </group>
  );
};

export default InfiniteStreet;
