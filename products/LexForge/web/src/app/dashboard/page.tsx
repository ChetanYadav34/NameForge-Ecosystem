import React from 'react';
import Link from 'next/link';
import { Button } from '@lexforge/ui';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <Link href="/playground">
          <Button variant="primary">New Session</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Names Forged</h3>
          <p className="text-4xl font-light text-slate-900">1,204</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Saved Favorites</h3>
          <p className="text-4xl font-light text-slate-900">42</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Active Projects</h3>
          <p className="text-4xl font-light text-slate-900">3</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Favorites</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Project</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Vercelify</td>
              <td className="px-6 py-4 text-slate-600">Project Phoenix</td>
              <td className="px-6 py-4 text-green-600 font-medium">92.4</td>
              <td className="px-6 py-4"><span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">Available</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Syntaxa</td>
              <td className="px-6 py-4 text-slate-600">DevTools V2</td>
              <td className="px-6 py-4 text-green-600 font-medium">88.1</td>
              <td className="px-6 py-4"><span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">Available</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Datastream.io</td>
              <td className="px-6 py-4 text-slate-600">Data Pipeline</td>
              <td className="px-6 py-4 text-orange-600 font-medium">76.5</td>
              <td className="px-6 py-4"><span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">Med Risk</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
