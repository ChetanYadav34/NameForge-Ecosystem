import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Grid, Card } from '@lexforge/ui';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Documentation | LexForge',
  description: 'Guides, tutorials, and architectural overviews for the LexForge ecosystem.',
};

export default function DocsPage() {
  return (
    <MarketingLayout
      title="Documentation Hub"
      subtitle="Everything you need to master the LexForge Engine, from basic prompt structuring to advanced graph-based constraints."
      badge="Learn"
    >
      <Container>
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border border-slate-200 bg-white shadow-sm hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Getting Started</h3>
              <p className="text-slate-600 text-sm mb-4">Learn how to write your first brand thesis and generate meaning-driven names.</p>
              <ul className="text-sm space-y-2 text-primary font-medium">
                <li><Link href="#basics" className="hover:underline underline-offset-4">Writing a Thesis</Link></li>
                <li><Link href="#filters" className="hover:underline underline-offset-4">Using Linguistic Filters</Link></li>
              </ul>
            </Card>

            <Card className="p-8 border border-slate-200 bg-white shadow-sm hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">REST API Reference</h3>
              <p className="text-slate-600 text-sm mb-4">Integrate our naming engine directly into your own SaaS tools and agency workflows.</p>
              <ul className="text-sm space-y-2 text-slate-400 font-medium cursor-not-allowed">
                <li>Authentication (Coming Soon)</li>
                <li>Generation Endpoint (Coming Soon)</li>
              </ul>
            </Card>

            <Card className="p-8 border border-slate-200 bg-white shadow-sm hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">The Dataset</h3>
              <p className="text-slate-600 text-sm mb-4">Understand the underlying 1.2 billion node graph that powers our semantic extraction.</p>
              <ul className="text-sm space-y-2 text-primary font-medium">
                <li><Link href="/dataset" className="hover:underline underline-offset-4">Dataset Overview</Link></li>
                <li><Link href="/research" className="hover:underline underline-offset-4">Whitepapers</Link></li>
              </ul>
            </Card>

            <Card className="p-8 border border-slate-200 bg-white shadow-sm hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">LexForge Studio</h3>
              <p className="text-slate-600 text-sm mb-4">Documentation for the advanced desktop application used by enterprise trademark teams.</p>
              <ul className="text-sm space-y-2 text-slate-400 font-medium cursor-not-allowed">
                <li>Installation Guide (Coming Soon)</li>
                <li>Workspace Setup (Coming Soon)</li>
              </ul>
            </Card>
          </div>

        </div>
      </Container>
    </MarketingLayout>
  );
}
