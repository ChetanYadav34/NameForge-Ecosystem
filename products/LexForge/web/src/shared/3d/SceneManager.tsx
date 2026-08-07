"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

export const SceneManager = ({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) => {
  return (
    <div className="w-full h-full absolute inset-0 -z-10 pointer-events-none">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
