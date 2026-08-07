"use client";
import React from 'react';
import { Container } from '@lexforge/ui';
import { motion } from 'framer-motion';

export const StorySection = () => {
  return (
    <section className="py-32 bg-transparent relative z-10" id="story">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-[40px] md:text-[56px] font-serif text-slate-900 leading-tight tracking-tight"
          >
            Every memorable name tells a story.
          </motion.h2>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-[40px] md:text-[56px] font-serif text-slate-500 leading-tight tracking-tight"
          >
            Every sound creates emotion.
          </motion.h2>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-[40px] md:text-[56px] font-serif text-slate-300 leading-tight tracking-tight"
          >
            Every syllable carries weight.
          </motion.h2>
        </div>
      </Container>
    </section>
  );
};
