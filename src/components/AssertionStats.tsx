import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react';
import PieChart from './PieChart';

interface AssertionStatsProps {
  stats: {
    total: number;
    passed: number;
    failed: number;
    unavailable: number;
  };
}

export const AssertionStats: React.FC<AssertionStatsProps> = ({ stats }) => {
  const passRate = ((stats.passed / stats.total) * 100).toFixed(1);
  
  const pieData = [
    { label: 'Passed', value: stats.passed, color: '#4ade80' },
    { label: 'Failed', value: stats.failed, color: '#f87171' },
    { label: 'Unavailable', value: stats.unavailable, color: '#fbbf24' },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Assertion Statistics</h3>
      
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Passed</span>
            </div>
            <span className="text-white font-medium">{stats.passed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span className="text-slate-300">Failed</span>
            </div>
            <span className="text-white font-medium">{stats.failed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldOff className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">Unavailable</span>
            </div>
            <span className="text-white font-medium">{stats.unavailable}</span>
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{passRate}%</p>
              <p className="text-sm text-slate-400">Pass Rate</p>
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
