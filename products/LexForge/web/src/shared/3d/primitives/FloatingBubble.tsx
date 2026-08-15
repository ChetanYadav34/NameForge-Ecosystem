"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { GlassMaterial } from '../materials/GlassMaterial';

interface FloatingBubbleProps {
  name: string;
  position: [number, number, number];
  index: number;
  fsmState: string;
}
export const FloatingBubble: React.FC<FloatingBubbleProps> = ({ name, position, index, fsmState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom material instance
  const material = useMemo(() => new GlassMaterial(), []);

  // Organic variation parameters
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const parallaxFactor = useMemo(() => 0.5 + Math.random() * 1.0, []);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const bubbleSize = useMemo(() => 0.5 + Math.random() * 0.4, []);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    
    // Wobble the mesh only (not the text)
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
    groupRef.current.position.lerp(targetPos, 0.05);

    // Float around the current lerped position
    groupRef.current.position.x += Math.sin(time * speedMult + index) * 0.01;
    groupRef.current.position.y += Math.cos(time * speedMult + index) * 0.01;
    
    // Basic parallax based on scroll
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    groupRef.current.position.y += scrollY * 0.004 * parallaxFactor;
    
    // Mouse repel
    const mX = state.pointer.x * 5;
    const mY = state.pointer.y * 3;
    const dist = groupRef.current.position.distanceTo(new THREE.Vector3(mX, mY, groupRef.current.position.z));
    if (dist < 2.5) {
        const dir = groupRef.current.position.clone().sub(new THREE.Vector3(mX, mY, groupRef.current.position.z)).normalize();
        groupRef.current.position.addScaledVector(dir, (2.5 - dist) * 0.04);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; groupRef.current?.scale.setScalar(1.2); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; groupRef.current?.scale.setScalar(1); }}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[bubbleSize, 64, 64]} />
        <primitive object={material} attach="material" />
      </mesh>
      
      <Text
        position={[0, 0, 0]}
        fontSize={Math.min(0.25, (bubbleSize * 1.6) / (name.length * 0.55))}
        color="#1c0062" // on-primary-fixed
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#ffffff"
        material-depthTest={false}
      >
        {name}
      </Text>
    </group>
  );
};
