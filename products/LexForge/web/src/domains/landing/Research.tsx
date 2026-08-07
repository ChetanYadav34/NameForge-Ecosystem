import React from 'react';
import { Container, Stack, Button } from '@lexforge/ui';
import { landingConfig } from './config';

export const Research = () => {
  const { headline, description } = landingConfig.research;

  return (
    <section className="py-24 bg-[#f8f7f5]" id="research-section">
      <Container>
        <Stack gap={8} className="items-center text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900">{headline}</h2>
          <p className="text-slate-600 font-light">{description}</p>
          <Button variant="secondary" className="px-6 py-2 bg-white">Read Papers</Button>
        </Stack>
      </Container>
    </section>
  );
};
