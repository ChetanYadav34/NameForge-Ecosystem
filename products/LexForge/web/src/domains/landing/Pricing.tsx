"use client";
import React from 'react';
import { Container, Grid, Card, Button } from '@lexforge/ui';
import { landingConfig } from './config';
import { motion } from 'framer-motion';

export const Pricing = () => {
  return (
    <section className="py-32 bg-[#f8f7f5]" id="pricing">
      <Container>
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-[32px] font-serif font-semibold mb-4 text-slate-900 tracking-tight"
          >
            Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-slate-600 text-base leading-relaxed"
          >
            Choose the tier that fits your brand creation needs.
          </motion.p>
        </div>

        <Grid cols={1} gap={8} className="md:grid-cols-2 max-w-4xl mx-auto">
          {landingConfig.pricing.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Card className="p-10 border border-black/5 bg-white/70 backdrop-blur-xl shadow-md h-full flex flex-col hover:border-primary/20 transition-all">
                <h3 className="text-2xl font-serif text-slate-900 mb-2">{tier.tier}</h3>
                <p className="text-4xl font-bold text-slate-900 mb-8">{tier.price}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-slate-600 font-light">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant={idx === 1 ? 'primary' : 'secondary'} className="w-full py-4 rounded-xl shadow-sm text-sm">
                  Select {tier.tier}
                </Button>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </section>
  );
};
