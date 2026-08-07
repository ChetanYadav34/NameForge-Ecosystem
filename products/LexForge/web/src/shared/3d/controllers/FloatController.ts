import React from 'react';
import { useFrame } from '@react-three/fiber';

export const FloatController = (ref: React.MutableRefObject<any>, speed = 1, amplitude = 0.1) => {
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.y = Math.sin(t) * amplitude;
  });
};
