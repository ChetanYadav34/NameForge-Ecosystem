import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card } from '@lexforge/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roadmap | LexForge',
  description: 'The product trajectory and future development goals for the LexForge ecosystem.',
};

export default function RoadmapPage() {
  return (
    <MarketingLayout
      title="Ecosystem Roadmap"
      subtitle="LexForge is continuously evolving. Explore our trajectory as we push the boundaries of computational linguistics and brand generation."
      badge="Product Trajectory"
    >
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          
          <div className="relative pl-8 md:pl-0">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 transform -translate-x-1/2"></div>
            
            {/* Q3 2026 */}
            <div className="relative mb-16 md:mb-24 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-5/12 mb-4 md:mb-0 text-left md:text-right pr-0 md:pr-8">
                <h3 className="text-xl font-bold font-serif text-slate-900">v0.5 Alpha Release</h3>
                <p className="text-sm text-slate-500 mt-1">Current State (Q3 2026)</p>
              </div>
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary transform -translate-x-[21px] md:-translate-x-1/2 mt-1 md:mt-0 shadow-[0_0_0_4px_white]"></div>
              <div className="md:w-5/12 pl-0 md:pl-8">
                <Card className="p-6 border border-slate-200 bg-white">
                  <ul className="text-sm text-slate-600 list-disc pl-4 space-y-2 marker:text-primary">
                    <li>Launch of the core Generation Engine</li>
                    <li>Integration of 1.2B semantic node dataset</li>
                    <li>Deployment of LexForge Web Interface</li>
                    <li>Basic psychological screening filters</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Q4 2026 */}
            <div className="relative mb-16 md:mb-24 flex flex-col md:flex-row items-center justify-between flex-col-reverse md:flex-row">
              <div className="md:w-5/12 pr-0 md:pr-8 mt-4 md:mt-0">
                <Card className="p-6 border border-slate-200 bg-white">
                  <ul className="text-sm text-slate-600 list-disc pl-4 space-y-2 marker:text-slate-400">
                    <li>Public REST API for enterprise integration</li>
                    <li>LexForge Studio interface for bulk processing</li>
                    <li>User accounts and saved generations</li>
                    <li>Expanded language morphs (Japanese, Arabic)</li>
                  </ul>
                </Card>
              </div>
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-slate-300 transform -translate-x-[21px] md:-translate-x-1/2 mt-1 md:mt-0 shadow-[0_0_0_4px_white]"></div>
              <div className="md:w-5/12 text-left pl-8 md:pl-0">
                <h3 className="text-xl font-bold font-serif text-slate-400">API & Accounts</h3>
                <p className="text-sm text-slate-500 mt-1">Q4 2026</p>
              </div>
            </div>

            {/* Q1 2027 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-5/12 mb-4 md:mb-0 text-left md:text-right pr-0 md:pr-8">
                <h3 className="text-xl font-bold font-serif text-slate-400">v1.0 Commercial Launch</h3>
                <p className="text-sm text-slate-500 mt-1">Q1 2027</p>
              </div>
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-slate-200 transform -translate-x-[21px] md:-translate-x-1/2 mt-1 md:mt-0 shadow-[0_0_0_4px_white]"></div>
              <div className="md:w-5/12 pl-0 md:pl-8">
                <Card className="p-6 border border-slate-100 bg-slate-50 opacity-70">
                  <ul className="text-sm text-slate-500 list-disc pl-4 space-y-2 marker:text-slate-300">
                    <li>Real-time global trademark graph integration</li>
                    <li>Automated domain availability cross-checks</li>
                    <li>Custom on-premise dataset training for agencies</li>
                    <li>Full semantic ontology export</li>
                  </ul>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </MarketingLayout>
  );
}
