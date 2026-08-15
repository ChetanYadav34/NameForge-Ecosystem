"use client";
import dynamic from 'next/dynamic';

const GlobalBackground = dynamic(
  () => import('./scenes/BackgroundScene').then((mod) => mod.BackgroundScene),
  { ssr: false }
);

export const Global3DScene = () => {
  return <GlobalBackground />;
};
