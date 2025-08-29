import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface CompactMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  color: string;
}

const CompactMetricCard: React.FC<CompactMetricCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-200 group shadow-sm hover:shadow-md">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
        <div className="min-w-0">
          <span className="text-xs text-gray-600 dark:text-slate-400 truncate block">{label}</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate block">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default CompactMetricCard;
