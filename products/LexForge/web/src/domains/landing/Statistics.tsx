import React from 'react';
import { Container, Grid } from '@lexforge/ui';
import { landingConfig } from './config';

export const Statistics = () => {
  return (
    <section className="py-24 bg-slate-900 text-white" id="statistics">
      <Container>
        <Grid cols={1} gap={12} className="md:grid-cols-3">
          {landingConfig.statistics.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center border-l border-white/10 first:border-0 pl-0 md:pl-12 first:pl-0">
              <span className="text-5xl md:text-7xl font-serif text-white mb-2">{stat.value}</span>
              <span className="text-sm text-slate-400 uppercase tracking-widest font-bold">{stat.label}</span>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  );
};
