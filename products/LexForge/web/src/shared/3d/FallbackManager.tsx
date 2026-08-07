"use client";
import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const FallbackManager = ({ children }: { children: React.ReactNode }) => {
  const [isSupported, setIsSupported] = useState(true);
  const { reducedMotion } = useSettingsStore();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
      }
    } catch (e) {
      setIsSupported(false);
    }
  }, []);
  
  if (!isSupported || reducedMotion) {
    return (
      <div className="fallback-css-gradient w-full h-full absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-indigo-950 to-black opacity-80" />
    );
  }

  return <>{children}</>;
};
