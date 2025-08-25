import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import PieChart from '../PieChart';

export interface RequestStatsProps {
  stats: {
    total: number;
    passed: number;
    failed: number;
    unavailable: number;
  };
}

export const RequestStats: React.FC<RequestStatsProps> = ({ stats }) => {
  const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
  
  const pieData = [
    { label: 'Passed', value: stats.passed, color: '#4ade80' },
    { label: 'Failed', value: stats.failed, color: '#f87171' },
    { label: 'Unavailable', value: stats.unavailable, color: '#fbbf24' },
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 border bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border-gray-200 dark:border-slate-700 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Request Statistics</h3>
      
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-gray-600 dark:text-slate-300">Passed</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{stats.passed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              <span className="text-gray-600 dark:text-slate-300">Failed</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{stats.failed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              <span className="text-gray-600 dark:text-slate-300">Unavailable</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{stats.unavailable}</span>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{successRate}%</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Success Rate</p>
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
                <span className="text-gray-600 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStats;