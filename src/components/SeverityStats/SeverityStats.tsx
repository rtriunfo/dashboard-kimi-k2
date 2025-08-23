import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import PieChart from '../PieChart';

export interface SeverityStatsProps {
  stats: {
    blocker: number;
    critical: number;
    major: number;
    minor: number;
    none: number;
  };
}

const SeverityStats: React.FC<SeverityStatsProps> = ({ stats }) => {
  const pieData = [
    { label: 'Blocker', value: stats.blocker, color: '#ef4444' },
    { label: 'Critical', value: stats.critical, color: '#f97316' },
    { label: 'Major', value: stats.major, color: '#eab308' },
    { label: 'Minor', value: stats.minor, color: '#3b82f6' },
    { label: 'None', value: stats.none, color: '#10b981' },
  ].filter(item => item.value > 0);

  const totalIssues = stats.blocker + stats.critical + stats.major + stats.minor;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
      
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-slate-300">Blocker</span>
            </div>
            <span className="text-white font-medium">{stats.blocker}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300">Critical</span>
            </div>
            <span className="text-white font-medium">{stats.critical}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300">Major</span>
            </div>
            <span className="text-white font-medium">{stats.major}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">Minor</span>
            </div>
            <span className="text-white font-medium">{stats.minor}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">None</span>
            </div>
            <span className="text-white font-medium">{stats.none}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-sm text-slate-400">Total Issues</p>
              <p className="text-2xl font-bold text-white">{totalIssues}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <PieChart data={pieData} size={120} />
          <div className="mt-3 space-y-1">
            {pieData.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeverityStats;
