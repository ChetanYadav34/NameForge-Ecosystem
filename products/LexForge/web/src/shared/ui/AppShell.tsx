import React from 'react';
import { Navigation } from './Navigation';
import { Sidebar } from './Sidebar';
import { CommandBar } from './CommandBar';
import { NotificationSystem } from './NotificationSystem';
import { FallbackManager } from '../3d/FallbackManager';
import dynamic from 'next/dynamic';

const SceneManager = dynamic(() => import('../3d/SceneManager').then(mod => mod.SceneManager), { ssr: false });
const BackgroundScene = dynamic(() => import('../3d/scenes/BackgroundScene').then(mod => mod.BackgroundScene), { ssr: false });

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FallbackManager>
          <SceneManager>
            <BackgroundScene />
          </SceneManager>
        </FallbackManager>
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <Navigation />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
      
      <CommandBar />
      <NotificationSystem />
    </div>
  );
};
