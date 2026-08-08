import React from 'react';
import { PageLayout } from './PageLayout';
import { Container } from '@lexforge/ui';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
}

export const LegalLayout = ({ children, title, lastUpdated }: LegalLayoutProps) => {
  return (
    <PageLayout>
      <div className="pt-24 pb-12 bg-white border-b border-black/5">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">{title}</h1>
            {lastUpdated && (
              <p className="text-sm text-slate-500">Last Updated: {lastUpdated}</p>
            )}
          </div>
        </Container>
      </div>
      <div className="py-16 bg-surface">
        <Container>
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-black/5 rounded-2xl">
            <div className="flex flex-col gap-6 text-slate-700 leading-relaxed text-base [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-8 [&>h2]:mb-2 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol>li]:mb-2">
              {children}
            </div>
          </div>
        </Container>
      </div>
    </PageLayout>
  );
};
