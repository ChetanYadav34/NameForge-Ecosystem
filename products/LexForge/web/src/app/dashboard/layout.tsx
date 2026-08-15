import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent flex font-sans selection:bg-primary/20">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-slate-200/60 flex flex-col hidden md:flex z-10 shadow-sm relative">
        <div className="p-8 border-b border-slate-100/50">
          <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-slate-900 group">
            LexForge<span className="text-primary transition-colors group-hover:text-orange-400">.</span>
          </Link>
          <p className="text-xs font-mono text-slate-400 mt-2 uppercase tracking-widest">Dashboard</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <Link href="/dashboard" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all duration-300">
            Overview
          </Link>
          <Link href="/dashboard/history" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-primary/5 hover:text-primary font-medium transition-all duration-300">
            Generation History
          </Link>
        </nav>
        
        <div className="p-6 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">P</div>
             <div>
               <p className="text-sm font-bold text-slate-800">paid_user</p>
               <p className="text-xs text-slate-500">Pro Plan</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-auto relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
