import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const PostProcessing: React.FC = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.8} // Only very bright things glow
        mipmapBlur 
        intensity={1.5} 
        radius={0.6}
      />
      <Vignette offset={0.3} darkness={0.6} eskil={false} />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
};
