"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const HeroVisual = () => {
  // Simple CSS representation of the node graph from Figma
  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-[#f2f1ef] rounded-3xl overflow-hidden shadow-inner border border-black/5">
      {/* Background grid dots */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />

      {/* Lines between nodes */}
      <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="30%" y1="35%" x2="45%" y2="50%" stroke="#7c3aed" strokeWidth="1" />
        <line x1="45%" y1="50%" x2="35%" y2="65%" stroke="#7c3aed" strokeWidth="1" />
        <line x1="45%" y1="50%" x2="60%" y2="65%" stroke="#7c3aed" strokeWidth="1" />
        <line x1="60%" y1="65%" x2="65%" y2="50%" stroke="#10b981" strokeWidth="1" />
        <line x1="65%" y1="50%" x2="55%" y2="35%" stroke="#f59e0b" strokeWidth="1" />
      </svg>

      {/* Nodes */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[35%] left-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-white border border-indigo-200 shadow-xl flex items-center justify-center flex-col relative group">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-md group-hover:bg-indigo-500/20 transition-all"></div>
          <span className="text-[10px] font-medium text-indigo-900 relative z-10">Morphology</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-[50%] left-[45%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-24 rounded-full bg-white border border-indigo-200 shadow-xl flex items-center justify-center flex-col relative group">
          <div className="absolute inset-0 rounded-full bg-indigo-500/15 blur-lg group-hover:bg-indigo-500/25 transition-all"></div>
          <span className="text-[11px] font-medium text-indigo-900 relative z-10">Semantics</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[65%] left-[35%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-white border border-indigo-200 shadow-xl flex items-center justify-center flex-col relative group">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-md group-hover:bg-indigo-500/20 transition-all"></div>
          <span className="text-[9px] font-medium text-indigo-900 relative z-10">Etymology</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="absolute top-[65%] left-[60%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-white border border-indigo-200 shadow-xl flex items-center justify-center flex-col relative group">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-md group-hover:bg-indigo-500/20 transition-all"></div>
          <span className="text-[10px] font-medium text-indigo-900 relative z-10">Ontology</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="absolute top-[50%] left-[65%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-white border border-emerald-200 shadow-xl flex items-center justify-center flex-col relative group">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md group-hover:bg-emerald-500/20 transition-all"></div>
          <span className="text-[10px] font-medium text-emerald-900 relative z-10">Psychology</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full bg-white border border-amber-200 shadow-xl flex items-center justify-center flex-col relative group">
          <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-md group-hover:bg-amber-500/20 transition-all"></div>
          <span className="text-[10px] font-medium text-amber-900 relative z-10">Phonetics</span>
        </div>
      </motion.div>
    </div>
  );
};
