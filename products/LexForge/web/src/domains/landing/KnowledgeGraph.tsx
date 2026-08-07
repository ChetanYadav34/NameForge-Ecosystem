"use client";
import React from 'react';
import { Container, Grid } from '@lexforge/ui';
import { HeroVisual } from './HeroVisual';
import { landingConfig } from './config';
import { motion } from 'framer-motion';

export const KnowledgeGraph = () => {
  return (
    <section className="py-32 bg-[#f8f7f5]" id="graph">
      <Container>
        <Grid cols={1} gap={12} className="lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <HeroVisual />
          </div>
          
          <div className="order-1 lg:order-2 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-slate-900 tracking-tight">{landingConfig.knowledgeGraph.headline}</h2>
              <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                {landingConfig.knowledgeGraph.description}
                <br /><br />
                Our system doesn't just combine syllables. It traverses a multi-dimensional graph of phonetics, etymology, and psychology to find paths of high semantic resonance.
              </p>
            </motion.div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};
