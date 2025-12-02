import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lights: React.FC = () => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const backLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (spotLightRef.current) {
      // Subtle swaying of the main light to create shifting glints on diamonds
      spotLightRef.current.position.x = 5 + Math.sin(t * 0.3) * 3;
      spotLightRef.current.position.z = 5 + Math.cos(t * 0.2) * 2;
    }
    if (backLightRef.current) {
      // Pulsing rim light
      backLightRef.current.intensity = 40 + Math.sin(t * 1.5) * 10;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#001a0a" />
      
      {/* Key Light - Warm Gold - Higher angle for tree shape */}
      <spotLight
        ref={spotLightRef}
        position={[5, 12, 5]}
        angle={0.6}
        penumbra={0.4}
        intensity={150}
        color="#ffecd6"
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill Light - Deep Emerald - Softens shadows in foliage */}
      <pointLight position={[-6, 4, -2]} intensity={30} color="#004d25" distance={20} />

      {/* Rim Light - Cool contrast to make gold pop against dark background */}
      <pointLight 
        ref={backLightRef}
        position={[0, 8, -10]} 
        intensity={50} 
        color="#cceeff" 
        distance={25}
      />
      
      {/* Bottom up-light to catch the bottom of baubles */}
      <spotLight 
        position={[0, -10, 5]} 
        intensity={40} 
        color="#ffaa00" 
        angle={1} 
        penumbra={1} 
        distance={20}
      />
    </>
  );
};