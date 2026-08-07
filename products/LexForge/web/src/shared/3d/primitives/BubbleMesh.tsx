import React, { useRef } from 'react';
import { BubbleMaterial } from '../materials/BubbleMaterial';
import { FloatController } from '../controllers/FloatController';

export const BubbleMesh = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const meshRef = useRef<any>(null);
  FloatController(meshRef, 2, 0.2);

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* @ts-ignore - R3F custom material typing issue */}
      <bubbleMaterial transparent />
    </mesh>
  );
};
