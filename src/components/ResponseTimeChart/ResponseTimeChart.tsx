import React from 'react';
import { BarChart3 } from 'lucide-react';

export interface ResponseTimeChartProps {
  responseTimes: {
    min: number;
    max: number;
    percentiles: { [key: string]: number };
  };
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ responseTimes }) => {
  const percentiles = [
    { label: '50th', value: responseTimes.percentiles["50.0"], color: 'bg-blue-500' },
    { label: '90th', value: responseTimes.percentiles["90.0"], color: 'bg-green-500' },
    { label: '95th', value: responseTimes.percentiles["95.0"], color: 'bg-yellow-500' },
    { label: '99th', value: responseTimes.percentiles["99.0"], color: 'bg-orange-500' },
    { label: '99.9th', value: responseTimes.percentiles["99.9"], color: 'bg-red-500' },
  ];

  const maxValue = Math.max(...percentiles.map(p => p.value));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Response Time Percentiles</h3>
      </div>
      
      <div className="space-y-4">
        {percentiles.map((percentile) => (
          <div key={percentile.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{percentile.label} Percentile</span>
              <span className="text-white font-medium">{percentile.value}ms</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`${percentile.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(percentile.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Min:</span>
              <span className="text-white ml-2">{responseTimes.min}ms</span>
            </div>
            <div>
              <span className="text-slate-400">Max:</span>
              <span className="text-white ml-2">{responseTimes.max}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeChart;
