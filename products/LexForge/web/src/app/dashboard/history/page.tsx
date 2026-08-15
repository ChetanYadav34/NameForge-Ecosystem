import React from 'react';
import Link from 'next/link';
import { Button } from '@lexforge/ui';

export default function HistoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Generation History</h1>
          <p className="text-slate-500 mt-2">Review your past forging sessions and generated identities.</p>
        </div>
        <Link href="/playground">
          <Button variant="primary" className="rounded-full px-6 shadow-orange-500/20 shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all">
            New Session
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Session 1 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 border-b border-slate-100/60 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900">Project Phoenix</h2>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Prompt: "A sleek, modern fintech startup for teenagers"
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Aug 14, 2026</p>
                <p className="text-xs text-slate-400 mt-1">4 top candidates</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Vercelify', score: 92.4, status: 'good' },
                { name: 'FinTeen', score: 81.2, status: 'warn' },
                { name: 'Velox', score: 89.0, status: 'good' },
                { name: 'AuraBank', score: 88.5, status: 'good' }
              ].map((item) => (
                <div key={item.name} className="group p-5 rounded-2xl border border-slate-200/60 bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 cursor-pointer transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <p className="font-bold text-xl text-slate-900 mb-3 relative z-10">{item.name}</p>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Score</span>
                    <span className={`text-sm font-bold ${item.status === 'good' ? 'text-green-600' : 'text-orange-500'}`}>
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session 2 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8 border-b border-slate-100/60 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900">DevTools V2</h2>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Prompt: "Next-gen CLI tool for React developers"
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Aug 10, 2026</p>
                <p className="text-xs text-slate-400 mt-1">2 top candidates</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Syntaxa', score: 88.1, status: 'good' },
                { name: 'ReactCLI', score: 45.0, status: 'bad', risk: 'High Risk' }
              ].map((item) => (
                <div key={item.name} className={`group p-5 rounded-2xl border bg-white cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  item.status === 'bad' ? 'border-red-200 hover:border-red-300 hover:shadow-red-500/5' : 'border-slate-200/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
                }`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 ${
                    item.status === 'bad' ? 'bg-red-50' : 'bg-primary/5'
                  }`} />
                  <p className="font-bold text-xl text-slate-900 mb-3 relative z-10">{item.name}</p>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Score</span>
                      <span className={`text-sm font-bold ${
                        item.status === 'good' ? 'text-green-600' : item.status === 'warn' ? 'text-orange-500' : 'text-red-600'
                      }`}>
                        {item.score}
                      </span>
                    </div>
                    {item.risk && (
                      <span className="text-[10px] font-bold tracking-wider uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        {item.risk}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
