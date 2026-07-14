import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Player from './components/Player';
import InfiniteStreet from './components/InfiniteStreet';
import './index.css';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020205' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* Deep dark fog for the synthwave atmosphere */}
        <fog attach="fog" args={['#050510', 20, 150]} />
        
        <ambientLight intensity={0.3} color="#ffffff" />
        {/* Neon tinted directional light */}
        <directionalLight
          castShadow
          position={[50, 50, -50]}
          intensity={1.5}
          color="#ff00ff"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={200}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        {/* Secondary fill light */}
        <directionalLight
          position={[-50, 20, -50]}
          intensity={1}
          color="#00ffff"
        />

        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <Player />
            <InfiniteStreet />
          </Physics>
        </Suspense>
      </Canvas>

        {/* Controls overlay */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: '#00ffff',
          fontFamily: 'monospace',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ff00ff',
          pointerEvents: 'none'
        }}>
          <h3>Controls</h3>
          <p>W/A/S/D - Move</p>
          <p>Space - Jump</p>
        </div>
      </div>
  );
};

export default App;
