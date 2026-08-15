import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card, Button } from '@lexforge/ui';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing | LexForge',
  description: 'Flexible pricing for individuals, agencies, and enterprise branding teams.',
};

export default function PricingPage() {
  return (
    <MarketingLayout
      title="Simple, Transparent Pricing"
      subtitle="Whether you are an independent creator or a global agency, LexForge scales with your naming needs."
      badge="Pricing"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <Card className="flex flex-col p-8 border border-slate-200/50 shadow-sm bg-white/40 backdrop-blur-md hover:bg-white/60 hover:border-slate-300 transition-all">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Starter</h3>
            <p className="text-sm text-slate-500 mb-6">For independent creators and side projects.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Free</span>
            </div>
            <ul className="text-sm text-slate-600 space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> 100 Generations / month</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Basic linguistics filters</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Standard export (CSV)</li>
            </ul>
            <Link href="/playground" className="block w-full">
              <Button variant="secondary" className="w-full">Start Naming</Button>
            </Link>
          </Card>

          <Card className="flex flex-col p-8 border-2 border-primary shadow-md bg-white/60 backdrop-blur-md relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-lg rounded-tr-lg">Most Popular</div>
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Pro</h3>
            <p className="text-sm text-slate-500 mb-6">For professional namers and branding agencies.</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">$49</span>
              <span className="text-sm text-slate-500">/mo</span>
            </div>
            <ul className="text-sm text-slate-600 space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Unlimited Generations</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Advanced psychological mapping</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Trademark graph pre-screening</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> LexForge Studio access</li>
            </ul>
            <Link href="/playground" className="block w-full">
              <Button variant="primary" className="w-full shadow-none">Start Naming</Button>
            </Link>
          </Card>

          <Card className="flex flex-col p-8 border border-slate-200/50 shadow-sm bg-white/40 backdrop-blur-md hover:bg-white/60 hover:border-slate-300 transition-all">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Enterprise</h3>
            <p className="text-sm text-slate-500 mb-6">For global brands and software integrators.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Custom</span>
            </div>
            <ul className="text-sm text-slate-600 space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Everything in Pro</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Custom root dataset ingestion</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Dedicated REST API endpoints</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> SLA & Dedicated support</li>
            </ul>
            <Link href="/contact" className="block w-full">
              <Button variant="secondary" className="w-full">Contact Sales</Button>
            </Link>
          </Card>

        </div>
      </Container>
    </MarketingLayout>
  );
}
