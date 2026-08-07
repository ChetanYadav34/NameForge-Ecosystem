"use client";
import React from 'react';
import { Container, Button } from '@lexforge/ui';
import { landingConfig } from './config';
import Link from 'next/link';

export const LandingNavigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-xl shadow-black/5">
      <Container className="flex justify-between items-center py-4">
        <div className="font-serif text-3xl font-bold text-slate-900 tracking-tight">LexForge</div>
        <div className="hidden md:flex gap-8">
          {landingConfig.navigation.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="text-slate-600 font-medium hover:text-primary transition-colors duration-300 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="primary" className="rounded-full px-6 bg-primary text-white hover:opacity-90 shadow-none border-none text-sm">
            Get Started
          </Button>
        </div>
      </Container>
    </nav>
  );
};
