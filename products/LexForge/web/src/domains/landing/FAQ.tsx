"use client";
import React from 'react';
import { Container, Grid, Card } from '@lexforge/ui';
import { landingConfig } from './config';
import { motion } from 'framer-motion';

export const FAQ = () => {
  return (
    <section className="py-32 bg-white" id="faq">
      <Container>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-[32px] font-serif font-semibold mb-4 text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </motion.div>

          <Grid cols={1} gap={6}>
            {landingConfig.faq.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Card className="p-8 border border-black/5 bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-medium text-slate-900 mb-4">{item.question}</h3>
                  <p className="text-slate-600 font-light leading-relaxed">{item.answer}</p>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
};
