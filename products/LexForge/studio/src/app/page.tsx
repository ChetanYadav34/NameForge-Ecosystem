import { StatCard } from "@/components/cards/StatCard";
import { DatasetRepository } from "@/lib/dataset/repository";
import { Database, Library, Activity, FileText } from "lucide-react";

export default async function HomePage() {
  const stats = await DatasetRepository.loadStats();
  const manifest = await DatasetRepository.loadManifest();

  return (
    <div className="space-y-10 max-w-6xl p-8 mx-auto">
      <div className="flex flex-col space-y-3">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-text-primary">LexForge Studio Dashboard</h1>
        <p className="text-text-muted font-medium text-[15px]">
          Overview of the compiled lexical dataset and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Lexical Entries"
          value={stats.totalWords.toLocaleString()}
          description="Nodes in the compiled dataset"
          icon={Database}
        />
        <StatCard
          title="Compiler Version"
          value={stats.compilerVersion}
          description="Currently loaded compiler output"
          icon={Activity}
        />
        <StatCard
          title="Frequency Coverage"
          value={`${stats.coveragePercentage}%`}
          description="Entries with frequency data"
          icon={FileText}
        />
        <StatCard
          title="Active Resources"
          value={manifest.resources.length}
          description={manifest.resources.map(r => r.id).join(", ")}
          icon={Library}
        />
      </div>
      
      {/* Placeholder for future features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <div className="col-span-4 rounded-xl border border-border bg-card text-text-primary shadow-sm p-8 min-h-[350px] flex flex-col relative overflow-hidden group hover:border-border-hover transition-all">
          <p className="text-text-muted text-[11px] uppercase tracking-widest font-semibold z-10 mb-4">Compilation History</p>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-text-muted/50 font-medium tracking-wide">(Coming Soon)</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-accent-muted to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
        <div className="col-span-3 rounded-xl border border-border bg-card text-text-primary shadow-sm p-8 min-h-[350px] flex flex-col relative overflow-hidden group hover:border-border-hover transition-all">
          <p className="text-text-muted text-[11px] uppercase tracking-widest font-semibold z-10 mb-4">Recent Validation Errors</p>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-text-muted/50 font-medium tracking-wide">No errors detected.</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-bl from-danger-muted to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  );
}
