import React from 'react';
import { LegalLayout } from '@/shared/ui/layouts/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Usage Policy | LexForge',
};

export default function AIUsagePolicyPage() {
  return (
    <LegalLayout title="AI Usage Policy" lastUpdated="August 8, 2026">
      <h2>1. Ethical Generation Commitment</h2>
      <p>
        LexForge is committed to the responsible development of generative AI and algorithmic linguistics. We do not use our technology to generate harmful, offensive, or explicitly deceptive branding material. Our generation pipeline includes safety constraints to prevent the algorithmic synthesis of hate speech or culturally insensitive terminology.
      </p>

      <h2>2. Data Training Transparency</h2>
      <p>
        The LexForge Core Dataset (v7) is compiled from open-source etymological dictionaries, historical linguistic databases, and public domain text corpora. We <strong>do not</strong> scrape proprietary trademark databases, private corporate branding guidelines, or user-submitted prompts to train our core foundation models.
      </p>

      <h2>3. The Hallucination Guarantee</h2>
      <p>
        Unlike standard Large Language Models (LLMs) which rely on probabilistic token generation and are prone to hallucinations, the LexForge Engine uses deterministic graph traversal. This means every generated morpheme sequence is mathematically traceable to a historical root, ensuring that when LexForge claims a word means "swiftness" in Proto-Indo-European, it is a scientifically verifiable fact, not a hallucination.
      </p>
    </LegalLayout>
  );
}
