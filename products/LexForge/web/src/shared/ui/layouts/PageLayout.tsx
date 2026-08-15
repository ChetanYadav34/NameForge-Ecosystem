import React from 'react';
import { LandingNavigation } from '../../../domains/landing/LandingNavigation';
import { Footer } from '../../../domains/landing/Footer';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <LandingNavigation />
      <main className="flex-1 mt-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};
