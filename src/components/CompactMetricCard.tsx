import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CompactMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

export const CompactMetricCard: React.FC<CompactMetricCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 group">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
        <div className="min-w-0">
          <p className="text-xs text-slate-400 truncate">{label}</p>
          <p className="text-sm font-semibold text-white truncate">{value}</p>
        </div>
      </div>
    </div>
  );
};
