import React from 'react';
import { LandingNavigation } from '../domains/landing/LandingNavigation';
import { Hero } from '../domains/landing/Hero';
import { StorySection } from '../domains/landing/StorySection';
import { ScientificFoundation } from '../domains/landing/ScientificFoundation';
import { SynthesisEngine } from '../domains/landing/SynthesisEngine';
import { GeneratedNamesShowcase } from '../domains/landing/GeneratedNamesShowcase';
import { Statistics } from '../domains/landing/Statistics';
import { DatasetSection } from '../domains/landing/DatasetSection';
import { Capabilities } from '../domains/landing/Capabilities';
import { Research } from '../domains/landing/Research';
import { KnowledgeGraph } from '../domains/landing/KnowledgeGraph';
import { Testimonials } from '../domains/landing/Testimonials';
import { FAQ } from '../domains/landing/FAQ';
import { Pricing } from '../domains/landing/Pricing';
import { CTA } from '../domains/landing/CTA';
import { Footer } from '../domains/landing/Footer';
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNavigation />
      <main>
        <Hero />
        <StorySection />
        <ScientificFoundation />
        <SynthesisEngine />

        <GeneratedNamesShowcase />
        <Statistics />
        <DatasetSection />
        <Capabilities />
        <Research />
        <KnowledgeGraph />
        <Testimonials />
        <FAQ />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
