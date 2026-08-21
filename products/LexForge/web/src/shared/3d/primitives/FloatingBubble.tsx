"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassMaterial } from '../materials/GlassMaterial';

interface FloatingBubbleProps {
  name: string;
  position: [number, number, number];
  index: number;
  fsmState: string;
}

// Renders text onto a canvas and returns a THREE.Texture — no worker needed.
function makeTextTexture(name: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const fontSize = Math.max(16, Math.min(32, Math.floor(180 / name.length)));
  ctx.font = `600 ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // white outline
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 4;
  ctx.strokeText(name, 128, 32);
  // dark text
  ctx.fillStyle = '#1c0062';
  ctx.fillText(name, 128, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({ name, position, index, fsmState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom material instance — factory fn avoids _instanceof SWC helper in workers
  const material = useMemo(() => createGlassMaterial(), []);

  // Canvas-texture sprite for name label — no troika worker
  const spriteMaterial = useMemo(() => {
    const tex = makeTextTexture(name);
    return new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  }, [name]);

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
      speedMult = 0.8;
    } else if (fsmState === 'GENERATING' || fsmState === 'VALIDATING') {
      speedMult = 2.0;
      targetPos.set(0, 0, -2);
    } else if (fsmState === 'STREAMING') {
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

  const spriteScale = Math.min(0.9, (bubbleSize * 1.6) / (name.length * 0.18));

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

      {/* Canvas-texture sprite — no troika worker required */}
      <sprite scale={[spriteScale, spriteScale * 0.25, 1]}>
        <primitive object={spriteMaterial} attach="material" />
      </sprite>
    </group>
  );
};
