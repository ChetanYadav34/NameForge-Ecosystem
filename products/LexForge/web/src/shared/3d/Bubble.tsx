"use client";
import React from 'react';
import { extend } from '@react-three/fiber';
import { BubbleMesh } from './primitives/BubbleMesh';
import { BubbleMaterial } from './materials/BubbleMaterial';
import { GlassMaterial } from './materials/GlassMaterial';

extend({ BubbleMaterial, GlassMaterial });

export const Bubble = () => {
  return (
    <group>
      <BubbleMesh />
    </group>
  );
};
