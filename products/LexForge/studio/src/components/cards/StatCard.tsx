import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card hover:bg-surface-elevated text-text-primary shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:border-border-hover transition-all duration-200 ease-out p-6 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="tracking-widest text-[11px] font-semibold uppercase text-text-muted">{title}</h3>
        <Icon className="h-5 w-5 text-text-muted group-hover:text-accent transition-colors duration-200" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-mono font-light text-text-primary group-hover:text-accent transition-colors duration-200">{value}</div>
        {description && (
          <p className="text-[13px] text-text-muted/80">{description}</p>
        )}
      </div>
      
      {/* Subtle bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
