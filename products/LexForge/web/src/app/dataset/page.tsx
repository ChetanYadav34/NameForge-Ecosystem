import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card } from '@lexforge/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dataset | LexForge',
  description: 'The LexForge Core Dataset - 1.2 billion semantic nodes and 847 language roots.',
};

export default function DatasetPage() {
  return (
    <MarketingLayout
      title="The LexForge Dataset"
      subtitle="A proprietary, multi-lingual topological graph designed specifically for conceptual brand generation."
      badge="Dataset v7"
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate max-w-none prose-lg mb-16">
            <p className="text-slate-600 mb-8">
              The engine driving LexForge is not a standard Large Language Model. It is a highly curated, deterministically compiled graph database known as the <strong>LexForge Core Dataset (v7)</strong>. It maps the semantic and phonetic relationships between concepts across human history.
            </p>

            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Scale and Coverage</h2>
            <p className="text-slate-600 mb-8">
              The dataset contains over 1.2 billion semantic edges, linking concepts from modern English back to their Proto-Indo-European (PIE), classical Latin, ancient Greek, and Sanskrit origins. By traversing this graph, LexForge can construct new words that carry deep, subconscious meaning without triggering existing trademark conflicts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 border border-slate-200 bg-white text-center">
              <div className="text-4xl font-bold font-serif text-slate-900 mb-2">1.2B</div>
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">Semantic Nodes</div>
            </Card>
            <Card className="p-6 border border-slate-200 bg-white text-center">
              <div className="text-4xl font-bold font-serif text-slate-900 mb-2">847</div>
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">Language Families</div>
            </Card>
            <Card className="p-6 border border-slate-200 bg-white text-center">
              <div className="text-4xl font-bold font-serif text-slate-900 mb-2">4.2M</div>
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">Phonetic Morphemes</div>
            </Card>
          </div>

          <div className="prose prose-slate max-w-none prose-lg">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Architecture</h2>
            <p className="text-slate-600 mb-8">
              During the compilation phase, raw linguistic data is processed by the LexForge Dataset Compiler. This compiler strips away conversational noise and isolates <em>brand-viable</em> morphemes. The resulting output is flattened into a series of highly optimized Inverted Indexes that are loaded directly into the LexForge engine's memory space, allowing for sub-50ms generation times.
            </p>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mt-12 mb-4">The Indexes</h3>
            <ul className="space-y-4 text-slate-600">
              <li><strong>Semantic Index:</strong> Maps abstract concepts (e.g., "speed", "trust") to root phonetic strings.</li>
              <li><strong>Ontology Index:</strong> Enforces domain-specific hierarchies (e.g., ensuring medical brands sound clinical rather than playful).</li>
              <li><strong>Definition Index:</strong> Maintains the exact etymological definition for post-generation validation, allowing the engine to mathematically prove a generated name's meaning.</li>
            </ul>
          </div>
        </div>
      </Container>
    </MarketingLayout>
  );
}
