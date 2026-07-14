import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraFollow = ({ targetRef }) => {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3(0, 10, 10));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    // Get player's current position
    const playerPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(playerPos);

    // Calculate ideal camera position (further behind and higher up for a better "top game" view)
    const idealOffset = new THREE.Vector3(0, 6, 12);
    const idealPosition = playerPos.clone().add(idealOffset);
    
    // Look slightly above the player's feet
    const idealLookAt = playerPos.clone().add(new THREE.Vector3(0, 2, 0));

    // Smoothly interpolate camera position and lookAt target
    // We use delta to ensure consistent speed regardless of framerate
    currentPosition.current.lerp(idealPosition, 4 * delta);
    currentLookAt.current.lerp(idealLookAt, 6 * delta);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CameraFollow;
