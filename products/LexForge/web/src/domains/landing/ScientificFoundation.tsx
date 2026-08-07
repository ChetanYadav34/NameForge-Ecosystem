"use client";
import React from 'react';
import { Container, Stack } from '@lexforge/ui';
import { landingConfig } from './config';
import { motion } from 'framer-motion';

export const ScientificFoundation = () => {
  const { badge, headline, description } = landingConfig.scientificFoundation;

  return (
    <section className="py-24 bg-[#f8f7f5]" id="research">
      <Container>
        <Stack gap={12} className="items-center text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <span className="inline-block text-primary text-xs font-bold tracking-widest uppercase">
              {badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900">
              {headline}
            </h2>
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="w-full h-[500px] bg-white rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
             {/* Background grid dots */}
            <div 
              className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 2px, transparent 0)', backgroundSize: '60px 60px' }} 
            />

            {/* Illustrative Graph representation */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="30%" y1="30%" x2="50%" y2="20%" stroke="#000" strokeWidth="1" />
              <line x1="30%" y1="30%" x2="35%" y2="50%" stroke="#000" strokeWidth="1" />
              <line x1="35%" y1="50%" x2="50%" y2="70%" stroke="#000" strokeWidth="1" />
              <line x1="50%" y1="70%" x2="50%" y2="50%" stroke="#000" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="#000" strokeWidth="1" />
              <line x1="70%" y1="30%" x2="65%" y2="50%" stroke="#000" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="65%" y2="70%" stroke="#000" strokeWidth="1" />
            </svg>

            {/* Nodes matching Figma styling approximately */}
            <Node label="Morphology" abbr="mβ" color="bg-indigo-500" top="30%" left="30%" />
            <Node label="Phonetics" abbr="fφ" color="bg-amber-500" top="20%" left="50%" />
            <Node label="Etymology" abbr="eε" color="bg-indigo-600" top="50%" left="35%" />
            <Node label="Ontology" abbr="oω" color="bg-indigo-700" top="70%" left="50%" />
            <Node label="Brand Archetypes" abbr="aα" color="bg-indigo-600" top="50%" left="50%" />
            <Node label="Semantics" abbr="sσ" color="bg-indigo-800" top="30%" left="70%" />
            <Node label="Psychology" abbr="pψ" color="bg-emerald-600" top="50%" left="65%" />
            <Node label="Reasoning Engine" abbr="rρ" color="bg-indigo-700" top="70%" left="65%" />
          </div>
        </Stack>
      </Container>
    </section>
  );
};

const Node = ({ label, abbr, color, top, left }: { label: string, abbr: string, color: string, top: string, left: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md border border-slate-100"
    style={{ top, left }}
  >
    <div className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center text-[10px] font-bold shadow-inner`}>
      {abbr}
    </div>
    <span className="text-sm font-semibold text-slate-800">{label}</span>
  </motion.div>
);
