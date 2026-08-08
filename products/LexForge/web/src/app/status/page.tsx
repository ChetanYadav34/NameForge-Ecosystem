import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card } from '@lexforge/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status | LexForge',
  description: 'Real-time operational status for LexForge services.',
};

export default function StatusPage() {
  return (
    <MarketingLayout
      title="System Status"
      subtitle="All services are operating normally."
      badge="Operational"
    >
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Card className="p-6 border border-slate-200 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">Web Interface</h3>
              <p className="text-sm text-slate-500">app.lexforge.com</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-600">Operational</span>
            </div>
          </Card>

          <Card className="p-6 border border-slate-200 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">Generation Engine</h3>
              <p className="text-sm text-slate-500">In-memory node traversal</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-600">Operational</span>
            </div>
          </Card>

          <Card className="p-6 border border-slate-200 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">REST API (Beta)</h3>
              <p className="text-sm text-slate-500">api.lexforge.com</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              <span className="text-sm font-medium text-slate-500">Maintenance</span>
            </div>
          </Card>
          
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">Past Incidents</h3>
            <p className="text-sm text-slate-600">No incidents reported in the last 90 days.</p>
          </div>
        </div>
      </Container>
    </MarketingLayout>
  );
}
