import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card } from '@lexforge/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | LexForge',
  description: 'Track the latest updates, releases, and improvements to the LexForge engine.',
};

export default function ChangelogPage() {
  return (
    <MarketingLayout
      title="Changelog"
      subtitle="Follow our continuous iterations as we refine the linguistics pipeline and expand our dataset."
      badge="Releases"
    >
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          
          <div className="relative pl-8 md:pl-0">
            <div className="hidden md:block absolute left-4 md:left-[120px] top-0 bottom-0 w-px bg-slate-200"></div>
            
            <div className="relative mb-12">
              <div className="hidden md:block absolute left-0 w-24 text-right text-sm font-semibold text-slate-500 pt-1">
                Aug 2026
              </div>
              <div className="absolute left-[-32px] md:left-[116px] w-[9px] h-[9px] rounded-full bg-primary mt-2 shadow-[0_0_0_4px_white]"></div>
              
              <div className="pl-0 md:pl-40">
                <Card className="p-8 border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">v0.5-alpha</span>
                    <h3 className="text-xl font-serif font-bold text-slate-900">Initial Web Release</h3>
                  </div>
                  
                  <div className="md:hidden text-sm font-semibold text-slate-500 mb-4">August 8, 2026</div>

                  <div className="prose prose-slate prose-sm max-w-none">
                    <p>
                      Today marks the first public web deployment of the LexForge Engine. We've successfully isolated the web frontend from the Studio desktop application, allowing users to experience our generative linguistic pipeline directly in the browser.
                    </p>
                    <h4 className="font-semibold text-slate-900 mt-6 mb-2">Engine Updates</h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>Compiled Dataset v7 inverted indexes for sub-50ms browser memory loading.</li>
                      <li>Implemented 8-dimensional cognitive and psychological scoring.</li>
                      <li>Added real-time feedback loops to the UI.</li>
                    </ul>
                    <h4 className="font-semibold text-slate-900 mt-6 mb-2">Infrastructure</h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>Migrated generation pipeline to Next.js 16.3.0 App Router.</li>
                      <li>Optimized production bundle to fit within Vercel Serverless Function limits.</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>

            <div className="relative mb-12 opacity-70">
              <div className="hidden md:block absolute left-0 w-24 text-right text-sm font-semibold text-slate-400 pt-1">
                Jul 2026
              </div>
              <div className="absolute left-[-32px] md:left-[116px] w-[9px] h-[9px] rounded-full bg-slate-300 mt-2 shadow-[0_0_0_4px_white]"></div>
              
              <div className="pl-0 md:pl-40">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-400">v0.4-internal</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-600 mb-2">Dataset V7 Compilation</h3>
                  <p className="text-sm text-slate-500">
                    Finalized the 1.2 billion node compilation across 847 language families.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </MarketingLayout>
  );
}
