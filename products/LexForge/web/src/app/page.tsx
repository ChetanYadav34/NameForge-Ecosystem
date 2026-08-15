import React from 'react';
import { LandingNavigation } from '../domains/landing/LandingNavigation';
import { Hero } from '../domains/landing/Hero';
import { GeneratedNamesShowcase } from '../domains/landing/GeneratedNamesShowcase';
import { Statistics } from '../domains/landing/Statistics';
import { DatasetSection } from '../domains/landing/DatasetSection';
import { Capabilities } from '../domains/landing/Capabilities';
import { Testimonials } from '../domains/landing/Testimonials';
import { FAQ } from '../domains/landing/FAQ';
import { CTA } from '../domains/landing/CTA';
import { Footer } from '../domains/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <LandingNavigation />
      <main>
        <Hero />
        <GeneratedNamesShowcase />
        <Statistics />
        <DatasetSection />
        <Capabilities />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
