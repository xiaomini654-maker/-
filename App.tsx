import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, OrbitControls, Environment } from '@react-three/drei';
import { ProceduralTree } from './components/ProceduralTree';
import { Lights } from './components/Lights';
import { PostProcessing } from './components/PostProcessing';
import { AppUI } from './components/AppUI';
import { HolidayMode } from './types';

function App() {
  const [mode, setMode] = useState<HolidayMode>(HolidayMode.CLASSIC);

  return (
    <div className="relative w-full h-screen bg-[#020403] overflow-hidden text-white select-none">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          shadows 
          camera={{ position: [0, 2, 14], fov: 40 }}
          gl={{ antialias: false, stencil: false, depth: true, alpha: false }}
          dpr={[1, 1.5]} // Performance optimization
        >
          {/* Background color changes slightly based on mode */}
          <color attach="background" args={[mode === HolidayMode.MIDNIGHT ? '#000000' : '#010804']} />
          
          <Suspense fallback={null}>
            <ProceduralTree mode={mode} />
            <Lights />
            {/* Environment map for realistic gold reflections */}
            <Environment preset={mode === HolidayMode.FROST ? 'city' : 'lobby'} />
            <PostProcessing />
            
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              minPolarAngle={Math.PI / 3} 
              maxPolarAngle={Math.PI / 1.8}
              minDistance={10}
              maxDistance={25}
              autoRotate
              autoRotateSpeed={0.8}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <AppUI mode={mode} setMode={setMode} />

      {/* Loading Screen */}
      <Loader 
        containerStyles={{ background: '#020403' }}
        innerStyles={{ width: '200px', background: '#333' }}
        barStyles={{ background: '#FFD700', height: '4px' }}
        dataInterpolation={(p) => `Loading Signature Experience ${p.toFixed(0)}%`}
        dataStyles={{ color: '#FFD700', fontFamily: '"Cinzel", serif', fontSize: '14px' }}
      />
    </div>
  );
}

export default App;