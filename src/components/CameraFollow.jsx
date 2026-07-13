import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraFollow = ({ targetRef }) => {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    // Get player's current position
    const playerPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(playerPos);

    // Calculate ideal camera position (behind and slightly above the player)
    const idealOffset = new THREE.Vector3(0, 5, 10);
    // If the player rotates, we would apply a quaternion to the idealOffset here.
    // For a straight runner/simple movement, a fixed offset relative to the world works.
    const idealPosition = playerPos.clone().add(idealOffset);
    
    const idealLookAt = playerPos.clone().add(new THREE.Vector3(0, 2, -5));

    // Lerp towards ideal position for smooth camera movement
    currentPosition.current.lerp(idealPosition, 5 * delta);
    currentLookAt.current.lerp(idealLookAt, 5 * delta);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CameraFollow;
