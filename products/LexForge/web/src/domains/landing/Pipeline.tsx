"use client";
import React from 'react';
import { Container, Stack, Grid, Card } from '@lexforge/ui';
import { landingConfig } from './config';
import { motion } from 'framer-motion';

export const Pipeline = () => {
  const { badge, headline, description, stages } = landingConfig.pipeline;

  return (
    <section className="py-24 bg-white" id="pipeline">
      <Container>
        <Stack gap={16} className="items-center">
          <div className="text-center space-y-6 max-w-3xl">
            <span className="inline-block text-primary text-xs font-bold tracking-widest uppercase">
              {badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900">
              {headline}
            </h2>
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div className="w-full relative">
            <div className="hidden lg:block absolute top-[50%] left-0 w-full h-[1px] bg-slate-200 -z-10" />
            
            <Grid cols={1} gap={6} className="md:grid-cols-3 lg:grid-cols-5">
              {stages.map((stage, index) => (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-white border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all group">
                    <Stack gap={6}>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold text-sm tracking-widest uppercase">STAGE {stage.id}</span>
                        <div className="w-2 h-2 rounded-full bg-primary opacity-50 group-hover:scale-150 transition-transform" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-slate-900 leading-tight">
                          {stage.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                          {stage.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </div>
        </Stack>
      </Container>
    </section>
  );
};
