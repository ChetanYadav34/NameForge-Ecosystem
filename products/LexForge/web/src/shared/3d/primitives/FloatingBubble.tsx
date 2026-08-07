"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GlassMaterial } from '../materials/GlassMaterial';

interface FloatingBubbleProps {
  name: string;
  position: [number, number, number];
  index: number;
  fsmState: string;
}
export const FloatingBubble: React.FC<FloatingBubbleProps> = ({ name, position, index, fsmState }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom material instance
  const material = useMemo(() => new GlassMaterial(), []);

  // Create text sprite texture
  const spriteTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    canvas.width = 512;
    canvas.height = 256;
    context.font = 'Bold 64px "Playfair Display", serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#2d4a6e';
    context.fillText(name, 256, 128);
    return new THREE.CanvasTexture(canvas);
  }, [name]);

  // Organic variation parameters
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const parallaxFactor = useMemo(() => 0.5 + Math.random() * 1.0, []);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    
    // Wobble
    const wobble = Math.sin(time * 2 + phase) * 0.03;
    meshRef.current.scale.set(1 + wobble, 1 - wobble, 1 + wobble * 0.5);

    // Base float speeds based on state
    let speedMult = 0.4;
    const targetPos = initialPos.clone();
    
    if (fsmState === 'TYPING') {
      speedMult = 0.8; // subtle faster movement
    } else if (fsmState === 'GENERATING' || fsmState === 'VALIDATING') {
      // Convergence
      speedMult = 2.0;
      targetPos.set(0, 0, -2);
    } else if (fsmState === 'STREAMING') {
      // Emerge
      speedMult = 1.5;
      targetPos.set(initialPos.x * 1.5, initialPos.y * 1.5, initialPos.z);
    }

    // Lerp towards target position
    meshRef.current.position.lerp(targetPos, 0.05);

    // Float around the current lerped position
    meshRef.current.position.x += Math.sin(time * speedMult + index) * 0.01;
    meshRef.current.position.y += Math.cos(time * speedMult + index) * 0.01;
    
    // Basic parallax based on scroll
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    meshRef.current.position.y += scrollY * 0.004 * parallaxFactor;
    
    // Mouse repel
    const mX = state.pointer.x * 5;
    const mY = state.pointer.y * 3;
    const dist = meshRef.current.position.distanceTo(new THREE.Vector3(mX, mY, meshRef.current.position.z));
    if (dist < 2.5) {
        const dir = meshRef.current.position.clone().sub(new THREE.Vector3(mX, mY, meshRef.current.position.z)).normalize();
        meshRef.current.position.addScaledVector(dir, (2.5 - dist) * 0.04);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; meshRef.current?.scale.setScalar(1.2); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; meshRef.current?.scale.setScalar(1); }}
    >
      <sphereGeometry args={[0.5 + Math.random() * 0.4, 64, 64]} />
      <primitive object={material} attach="material" />
      
      {spriteTexture && (
        <sprite scale={[2, 1, 1]}>
          <spriteMaterial map={spriteTexture} transparent={true} depthTest={false} depthWrite={false} />
        </sprite>
      )}
    </mesh>
  );
};
