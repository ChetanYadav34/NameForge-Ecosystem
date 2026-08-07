"use client";
import React from 'react';
import { Container, Grid } from '@lexforge/ui';
import { motion } from 'framer-motion';
import { landingConfig } from './config';

export const DatasetSection = () => {
  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden" id="dataset">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <Container className="relative z-10">
        <Grid cols={1} gap={12} className="md:grid-cols-2 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6">{landingConfig.dataset.headline}</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed mb-8 max-w-lg">
                {landingConfig.dataset.description}
                <br /><br />
                Our dataset spans 847 classical and modern language families, mapping phonemes, etymological roots, and cross-cultural semantic associations to ensure generated names are deeply rooted in human history.
              </p>
            </motion.div>
          </div>
          
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative h-[400px] w-full bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
             {/* Fake code/data visual */}
             <div className="absolute inset-0 p-8 font-mono text-xs text-primary/50 overflow-hidden flex flex-col gap-2 opacity-50">
                <p>{"{"}</p>
                <p className="pl-4">"node": "vorare",</p>
                <p className="pl-4">"type": "latin_root",</p>
                <p className="pl-4">"edges": [</p>
                <p className="pl-8">{"{\"target\": \"devour\", \"weight\": 0.95},"}</p>
                <p className="pl-8">{"{\"target\": \"appetite\", \"weight\": 0.88}"}</p>
                <p className="pl-4">],</p>
                <p className="pl-4">"phonemes": ["v", "ɔː", "r", "ɑː", "r", "ɛ"]</p>
                <p>{"}"}</p>
                <p className="mt-4 text-emerald-500/50">{"// 1.2 Billion nodes successfully indexed"}</p>
             </div>
          </motion.div>
        </Grid>
      </Container>
    </section>
  );
};
