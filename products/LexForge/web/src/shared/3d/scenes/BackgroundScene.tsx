"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingBubble } from '../primitives/FloatingBubble';
import { ParticleSystem } from '../ParticleSystem';
import { InteractionController } from '../controllers/InteractionController';
import { useGenerationStore } from '../../../store/useGenerationStore';

const defaultNames = ["Nova", "Lumora", "Nexa", "Veris", "Aether", "Syntra", "Velora", "Altis", "Orion"];

export const BackgroundScene = () => {
  const { results, fsmState } = useGenerationStore();
  const displayNames = results.length > 0 ? results.map(r => r.name) : defaultNames;
  return (
    <div className="fixed inset-0 w-full h-full z-0" style={{ pointerEvents: 'none', mixBlendMode: 'multiply' }}>
      <Canvas eventSource={typeof window !== 'undefined' ? document.body : undefined} camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
        <ambientLight intensity={1.0} />
        
        <Suspense fallback={null}>
          <group>
            {displayNames.map((name, i) => {
              const pos = [
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 3
              ] as [number, number, number];
              
              return (
                <FloatingBubble key={`${name}-${i}`} name={name} position={pos} index={i} fsmState={fsmState} />
              );
            })}
          </group>
          <ParticleSystem count={100} />
          <InteractionController />
        </Suspense>
      </Canvas>
    </div>
  );
};
