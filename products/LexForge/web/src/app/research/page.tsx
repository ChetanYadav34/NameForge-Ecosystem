import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card } from '@lexforge/ui';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Research | LexForge',
  description: 'Explore our latest academic research on algorithmic linguistics and generative phonotactics.',
};

export default function ResearchPage() {
  return (
    <MarketingLayout
      title="Open Research"
      subtitle="LexForge publishes ongoing research at the intersection of cognitive psychology, historical linguistics, and graph theory."
      badge="Academic Foundation"
    >
      <Container>
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <Card className="p-8 md:p-10 border border-slate-200 shadow-sm bg-white hover:border-primary/30 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Whitepaper</span>
              <span className="text-sm text-slate-500">August 2026</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
              Phonotactic Constraints in Generative Branding
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              This paper explores the algorithmic generation of non-word brand names that strictly adhere to English phonotactic rules, ensuring pronounceability while maximizing novelty. We detail the Markov chain models used to balance sonority sequencing.
            </p>
            <Link href="/docs" className="text-primary font-medium hover:underline underline-offset-4">
              Read Abstract &rarr;
            </Link>
          </Card>

          <Card className="p-8 md:p-10 border border-slate-200 shadow-sm bg-white hover:border-primary/30 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Case Study</span>
              <span className="text-sm text-slate-500">June 2026</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
              Cross-Lingual Root Mapping for Trademark Avoidance
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Analyzing how translating core semantic concepts into obscure Indo-European roots can bypass saturated trademark classes while retaining subconscious consumer association. Includes an analysis of 10,000 generated datasets.
            </p>
            <Link href="/dataset" className="text-primary font-medium hover:underline underline-offset-4">
              Explore Dataset &rarr;
            </Link>
          </Card>

          <Card className="p-8 md:p-10 border border-slate-200 shadow-sm bg-white hover:border-primary/30 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Methodology</span>
              <span className="text-sm text-slate-500">April 2026</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
              Emotional Valence of Vowel Harmonies
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              An empirical study mapping standard vowel pairs to cognitive emotional states (e.g., trust, speed, innovation). This methodology forms the basis of the LexForge Psychological Screen pipeline stage.
            </p>
            <Link href="/docs" className="text-primary font-medium hover:underline underline-offset-4">
              View Methodology &rarr;
            </Link>
          </Card>
        </div>
      </Container>
    </MarketingLayout>
  );
}
