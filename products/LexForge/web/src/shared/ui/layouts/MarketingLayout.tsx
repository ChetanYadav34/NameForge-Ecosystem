import React from 'react';
import { PageLayout } from './PageLayout';
import { Container } from '@lexforge/ui';

interface MarketingLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export const MarketingLayout = ({ children, title, subtitle, badge }: MarketingLayoutProps) => {
  return (
    <PageLayout>
      <div className="pt-24 pb-12 bg-white border-b border-black/5 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <Container className="relative z-10">
          <div className="max-w-3xl">
            {badge && (
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase rounded-full mb-6">
                {badge}
              </div>
            )}
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-slate-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </Container>
      </div>
      <div className="py-16 md:py-24">
        {children}
      </div>
    </PageLayout>
  );
};
