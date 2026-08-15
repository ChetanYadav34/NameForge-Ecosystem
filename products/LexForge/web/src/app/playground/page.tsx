import React from 'react';
import { PageLayout } from '@/shared/ui/layouts/PageLayout';
import { Container } from '@lexforge/ui';
import { GenerationForm } from '@/domains/landing/GenerationForm';
import { GeneratedNamesShowcase } from '@/domains/landing/GeneratedNamesShowcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Names | LexForge',
  description: 'Use the LexForge Linguistic AI Engine to forge meaningful brand names.',
};

export default function GeneratePage() {
  return (
    <PageLayout>
      <div className="pt-24 pb-12 relative overflow-hidden min-h-screen">
        
        <Container className="relative z-10 max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Forge Your Brand
            </h1>
            <p className="text-xl text-slate-600">
              Enter your brand vision below to generate linguistically optimized names.
            </p>
          </div>
          
          <GenerationForm />
        </Container>

        <div className="relative z-10">
          <GeneratedNamesShowcase />
        </div>
      </div>
    </PageLayout>
  );
}
