import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Stars } from '@react-three/drei';
import Badge from './components/Badge';
import Player from './components/Player';
import InfiniteStreet from './components/InfiniteStreet';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Badge />
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 60 }}>
        {/* Environment setup */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 50, 200]} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 100, 50]} 
          intensity={1.5} 
          castShadow 
          shadow-camera-left={-50} 
          shadow-camera-right={50} 
          shadow-camera-top={50} 
          shadow-camera-bottom={-50} 
        />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <Player />
            <InfiniteStreet />
          </Physics>
        </Suspense>
      </Canvas>
      
      {/* Instructions overlay */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: 'white',
        fontFamily: 'sans-serif',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '8px',
        pointerEvents: 'none'
      }}>
        <p style={{ margin: '0 0 5px 0' }}><strong>Controls:</strong></p>
        <p style={{ margin: 0 }}>W/A/S/D or Arrows to Move</p>
        <p style={{ margin: '5px 0 0 0' }}>Space to Jump</p>
      </div>
    </div>
  );
}

export default App;
