import React from 'react';
import { Container } from '@lexforge/ui';
import { landingConfig } from './config';

export const Testimonials = () => {
  return (
    <section className="py-32 bg-white" id="testimonials">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {landingConfig.testimonials.map((testimonial, idx) => (
            <div key={idx} className="space-y-8">
              <h3 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
                "{testimonial.quote}"
              </h3>
              <p className="text-primary font-bold tracking-wider uppercase text-sm">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
