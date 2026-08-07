"use client";
import React, { useState, useEffect } from 'react';
import { Container, Button, Stack } from '@lexforge/ui';
import { landingConfig } from './config';
import { motion } from 'framer-motion';
import { GenerationForm } from './GenerationForm';
import dynamic from 'next/dynamic';

const DynamicBackgroundScene = dynamic(
  () => import('../../shared/3d/scenes/BackgroundScene').then((mod) => mod.BackgroundScene),
  { ssr: false }
);

export const Hero = () => {
  const { badge, headline, description, primaryCTA, secondaryCTA } = landingConfig.hero;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative z-0 min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-transparent" id="hero">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          <div className="md:col-span-7 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xl border border-black/5 shadow-sm w-fit mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-xs font-medium text-primary uppercase tracking-widest">{badge}</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <h1 className="text-5xl md:text-[56px] font-serif text-slate-900 leading-[1.1] tracking-tight mb-6">
                {headline}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <p className="text-lg text-slate-600 max-w-2xl mb-12 leading-relaxed">
                {description}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <GenerationForm />
            </motion.div>
          </div>
          <div className="md:col-span-5 relative hidden md:block">
            {/* Spacer for 3D element focus area */}
          </div>
        </div>
      </Container>
      
      {/* 3D Scene anchored absolute to the section */}
      {mounted && <DynamicBackgroundScene />}
    </section>
  );
};
