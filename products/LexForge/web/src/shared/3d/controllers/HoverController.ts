import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HoverController = ({ materialRef, isHovered }: { materialRef: React.MutableRefObject<any>, isHovered: boolean }) => {
  useFrame((state, delta) => {
    if (materialRef.current) {
      const targetHoverState = isHovered ? 1.0 : 0.0;
      // Smoothly interpolate hover state
      materialRef.current.uHoverState = THREE.MathUtils.lerp(
        materialRef.current.uHoverState || 0,
        targetHoverState,
        delta * 5.0
      );
    }
  });

  return null;
};
