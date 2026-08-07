import React from 'react';
import { Container, Grid, Card, Stack } from '@lexforge/ui';
import { landingConfig } from './config';

export const Capabilities = () => {
  return (
    <section className="py-24 bg-white" id="capabilities">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900">Platform Capabilities</h2>
        </div>
        <Grid cols={1} gap={8} className="md:grid-cols-3">
          {landingConfig.capabilities.map((cap, idx) => (
            <Card key={idx} className="p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <Stack gap={4}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {/* Mock Icon */}
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{cap.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{cap.description}</p>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Container>
    </section>
  );
};
