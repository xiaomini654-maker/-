import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, Instance, Instances, Float } from '@react-three/drei';
import { HolidayMode } from '../types';

interface ProceduralTreeProps {
  mode: HolidayMode;
}

// Helper to calculate spiral positions
const getSpiralPos = (i: number, total: number, height: number, radiusBase: number, turns: number) => {
  const progress = i / total;
  const y = progress * height - (height / 2);
  const angle = progress * Math.PI * 2 * turns;
  const r = radiusBase * (1 - progress) + 0.1;
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  return { x, y, z, r, progress, angle };
};

export const ProceduralTree: React.FC<ProceduralTreeProps> = ({ mode }) => {
  const groupRef = useRef<THREE.Group>(null);

  const CONFIG = {
    height: 11,
    baseRadius: 4.5,
    branchCount: 1600, // Much denser foliage
    ornamentCount: 180,
    garlandCount: 300,
  };

  const { branches, ornaments, garland, topper } = useMemo(() => {
    const _branches = [];
    const _ornaments = [];
    const _garland = [];

    // 1. Crystal Branches (Foliage)
    for (let i = 0; i < CONFIG.branchCount; i++) {
      // Use a golden angle distribution for natural packing
      const y = (i / CONFIG.branchCount) * CONFIG.height - (CONFIG.height / 2);
      const progress = i / CONFIG.branchCount;
      const radiusAtHeight = CONFIG.baseRadius * (1 - progress) + 0.2;
      
      // Golden angle 137.5 degrees
      const theta = i * 2.39996; 
      // Add some randomness to radius for "fluffiness"
      const r = radiusAtHeight * Math.sqrt(Math.random()) * 0.8 + (radiusAtHeight * 0.2);
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      // Scale branches: smaller at top
      const scale = (1 - progress) * 0.6 + 0.2;
      
      // Random rotation
      const rot: [number, number, number] = [
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      ];

      _branches.push({ position: [x, y, z], rotation: rot, scale });
    }

    // 2. Ornaments (Baubles) - Placed at the "tips" of implicit layers
    for (let i = 0; i < CONFIG.ornamentCount; i++) {
      const progress = i / CONFIG.ornamentCount;
      const y = progress * CONFIG.height - (CONFIG.height / 2);
      const r = (CONFIG.baseRadius * (1 - progress)) + 0.4; // Push out slightly further than branches
      const theta = i * 3.5; // Different spiral pattern

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Determine type: 0 = Gold/Main, 1 = Accent/Diamond
      const type = Math.random() > 0.7 ? 1 : 0; 
      const scale = type === 0 ? 0.35 : 0.25;

      _ornaments.push({ position: [x, y, z], scale, type });
    }

    // 3. Garland (A string of lights/diamonds wrapping around)
    const garlandTurns = 6;
    for (let i = 0; i < CONFIG.garlandCount; i++) {
      const { x, y, z } = getSpiralPos(i, CONFIG.garlandCount, CONFIG.height, CONFIG.baseRadius + 0.3, garlandTurns);
      _garland.push({ position: [x, y, z], scale: 0.12 + Math.random() * 0.05 });
    }

    return { branches: _branches, ornaments: _ornaments, garland: _garland, topper: {} };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow majesty rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // --- Dynamic Palette Helpers ---
  const colors = useMemo(() => {
    switch(mode) {
      case HolidayMode.MIDNIGHT:
        return {
          branch: "#1a1a1a",
          ornamentMain: "#e6b800", // Rich Gold
          ornamentAccent: "#ffffff",
          garland: "#ffdb4d",
          light: "#ffcc00"
        };
      case HolidayMode.FROST:
        return {
          branch: "#e0f7fa", // Icy White/Blue
          ornamentMain: "#b0bec5", // Silver
          ornamentAccent: "#0288d1", // Ice Blue
          garland: "#ffffff",
          light: "#ffffff"
        };
      default: // Classic
        return {
          branch: "#064e3b", // Deep Emerald
          ornamentMain: "#ffb700", // Yellow Gold
          ornamentAccent: "#ef4444", // Ruby Red
          garland: "#fef3c7", // Warm White
          light: "#fbbf24"
        };
    }
  }, [mode]);

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2} floatingRange={[-0.2, 0.2]}>
        
        {/* --- LAYER 1: Crystal Foliage --- */}
        {/* We use Tetrahedrons for sharp, needle-like crystals */}
        <Instances range={CONFIG.branchCount}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color={colors.branch}
            roughness={0.2}
            metalness={0.1}
            transmission={0.2} // Slight transparency for glass effect
            thickness={1}
            ior={1.5}
            clearcoat={1}
            attenuationColor={colors.branch}
            attenuationDistance={1}
          />
          {branches.map((data, i) => (
            <Instance 
              key={`branch-${i}`} 
              position={data.position as [number, number, number]} 
              scale={data.scale as number}
              rotation={data.rotation as [number, number, number]}
            />
          ))}
        </Instances>

        {/* --- LAYER 2: Main Luxury Baubles (Gold/Silver) --- */}
        <Instances range={CONFIG.ornamentCount}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color={colors.ornamentMain}
            metalness={1}
            roughness={0.1} // Very shiny
            envMapIntensity={1.5}
          />
          {ornaments.filter(o => o.type === 0).map((data, i) => (
            <Instance 
              key={`bauble-main-${i}`} 
              position={data.position as [number, number, number]} 
              scale={data.scale} 
            />
          ))}
        </Instances>

        {/* --- LAYER 3: Accent Gems (Ruby/Sapphire/Diamond) --- */}
        <Instances range={CONFIG.ornamentCount}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color={colors.ornamentAccent}
            roughness={0.0}
            metalness={0.1}
            transmission={0.8}
            thickness={2}
            ior={2.4} // Diamond-like refraction
            clearcoat={1}
          />
          {ornaments.filter(o => o.type === 1).map((data, i) => (
            <Instance 
              key={`bauble-accent-${i}`} 
              position={data.position as [number, number, number]} 
              scale={data.scale}
              rotation={[Math.random(), Math.random(), Math.random()]}
            />
          ))}
        </Instances>

        {/* --- LAYER 4: The Garland (Glowing Pearls) --- */}
        <Instances range={CONFIG.garlandCount}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color={colors.garland}
            emissive={colors.garland}
            emissiveIntensity={2} // Glows with bloom
            toneMapped={false}
          />
          {garland.map((data, i) => (
            <Instance 
              key={`garland-${i}`} 
              position={data.position as [number, number, number]} 
              scale={data.scale} 
            />
          ))}
        </Instances>

        {/* --- LAYER 5: The Topper (Sunburst) --- */}
        <group position={[0, CONFIG.height/2 + 0.2, 0]}>
          {/* Central Gem */}
          <mesh>
            <dodecahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial 
              color={colors.ornamentMain} 
              emissive={colors.ornamentMain} 
              emissiveIntensity={0.5} 
              metalness={1} 
              roughness={0} 
            />
          </mesh>
          {/* Radiating Spikes */}
          <mesh rotation={[0,0,Math.PI/4]}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshPhysicalMaterial 
               color={colors.light} 
               transmission={0.6} 
               thickness={2} 
               roughness={0} 
               ior={2} 
            />
          </mesh>
          {/* Outer Halo particles */}
          <Sparkles count={20} scale={3} size={10} speed={0.2} opacity={1} color={colors.light} />
        </group>
        
        {/* Ambient Magic Dust */}
        <Sparkles 
          count={200} 
          scale={[10, 12, 10]} 
          size={3} 
          speed={0.4} 
          opacity={0.5}
          color={colors.light}
        />
      </Float>
    </group>
  );
};