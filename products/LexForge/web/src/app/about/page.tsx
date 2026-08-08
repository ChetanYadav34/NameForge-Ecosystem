import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Grid, Card } from '@lexforge/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | LexForge',
  description: 'The story and mission behind the LexForge Computational Linguistics Institute.',
};

export default function AboutPage() {
  return (
    <MarketingLayout
      title="The LexForge Institute"
      subtitle="Pioneering the intersection of computational linguistics and artificial intelligence to decode the emotional and psychological architecture of language."
      badge="About Us"
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate max-w-none prose-lg">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 mb-12">
              At LexForge, we believe that words are not merely labels, but cognitive triggers. Our mission is to map the entire spectrum of human linguistic response, transforming subjective naming conventions into an objective, data-driven science. By bridging classical morphology with modern neural networks, we provide a deterministic approach to brand genesis.
            </p>

            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">The Institute</h2>
            <p className="text-slate-600 mb-12">
              Founded as a research institute dedicated to semiotics and phonotactics, LexForge has evolved into a global platform. We actively maintain a dataset of 1.2 billion semantic nodes, tracing etymological roots across 847 classical and modern language families. Our research is open, but our synthesis engine is proprietary—built specifically for enterprise branding and trademark safety.
            </p>

            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Core Tenets</h2>
            
            <Grid cols={1} gap={8} className="mt-8 mb-16 not-prose md:grid-cols-2">
              <Card className="p-8 border border-slate-200 shadow-sm bg-white">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Determinism</h3>
                <p className="text-sm text-slate-600">
                  Unlike generative LLMs that hallucinate, our engine relies on graph traversal. Every phonetic sequence is mathematically traceable to a historical root.
                </p>
              </Card>
              <Card className="p-8 border border-slate-200 shadow-sm bg-white">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Psychological Resonance</h3>
                <p className="text-sm text-slate-600">
                  Vowels carry emotion; consonants carry structure. We algorithmically balance these elements to ensure names evoke specific cognitive responses.
                </p>
              </Card>
              <Card className="p-8 border border-slate-200 shadow-sm bg-white">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Trademark Safety</h3>
                <p className="text-sm text-slate-600">
                  Naming is a legal challenge. Our ontological graph pre-screens outputs against known entities to maximize trademark viability from day one.
                </p>
              </Card>
              <Card className="p-8 border border-slate-200 shadow-sm bg-white">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Aesthetic Purity</h3>
                <p className="text-sm text-slate-600">
                  A name must look beautiful in a logo and sound rhythmic spoken aloud. We evaluate phonotactic constraints across 40 major markets.
                </p>
              </Card>
            </Grid>
          </div>
        </div>
      </Container>
    </MarketingLayout>
  );
}
