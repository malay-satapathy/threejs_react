import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Player from './components/Player';
import InfiniteStreet from './components/InfiniteStreet';
import './index.css';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#87CEEB' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* Realistic Sky and Fog */}
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
        <fog attach="fog" args={['#a0aab5', 30, 150]} />
        
        <ambientLight intensity={0.4} color="#ffffff" />
        
        {/* Main Sun Light */}
        <directionalLight
          castShadow
          position={[100, 100, 50]}
          intensity={1.2}
          color="#ffffee"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={300}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0001}
        />
        
        {/* Soft fill light from the sky */}
        <directionalLight
          position={[-50, 50, -50]}
          intensity={0.3}
          color="#90b0d0"
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
        color: '#ffffff',
        fontFamily: 'sans-serif',
        background: 'rgba(0,0,0,0.5)',
        padding: '15px',
        borderRadius: '8px',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Controls</h3>
        <p style={{ margin: '5px 0' }}>W/A/S/D - Move</p>
        <p style={{ margin: '5px 0' }}>Space - Jump</p>
      </div>
    </div>
  );
};

export default App;
