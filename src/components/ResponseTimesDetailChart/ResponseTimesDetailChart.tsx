import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export interface ResponseTimesDetailChartProps {
  responseTimes: {
    min: number;
    max: number;
    percentiles: { [key: string]: number };
  };
}

const ResponseTimesDetailChart: React.FC<ResponseTimesDetailChartProps> = ({ responseTimes }) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');
  
  const percentileKeys = Object.keys(responseTimes.percentiles).sort((a, b) => parseFloat(a) - parseFloat(b));
  const percentileValues = percentileKeys.map(key => responseTimes.percentiles[key]);
  
  const maxValue = Math.max(...percentileValues, responseTimes.max);
  
  // Format percentile labels for display
  const formatPercentileLabel = (key: string) => {
    const num = parseFloat(key);
    if (num === 100) return '100th';
    if (num === 99.9) return '99.9th';
    return `${num}th`;
  };

  // Get color based on response time value
  const getColorClass = (value: number) => {
    const ratio = value / maxValue;
    if (ratio < 0.3) return 'bg-green-500';
    if (ratio < 0.6) return 'bg-yellow-500';
    if (ratio < 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Response Times Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === 'bar' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Line
          </button>
        </div>
      </div>
      
      {chartType === 'bar' ? (
        <div className="space-y-4">
          {percentileKeys.map((key) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{formatPercentileLabel(key)} Percentile</span>
                <span className="font-medium text-white">{responseTimes.percentiles[key]}ms</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-700">
                <div 
                  className={`${getColorClass(responseTimes.percentiles[key])} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${(responseTimes.percentiles[key] / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative mt-4 mb-12 h-80">
          {/* Y-axis labels container */}
          <div className="absolute top-0 left-0 flex flex-col justify-between w-16 h-full py-2 text-xs text-slate-400">
            <div className="pr-2 text-right">{maxValue}ms</div>
            <div className="pr-2 text-right">{Math.round(maxValue * 0.75)}ms</div>
            <div className="pr-2 text-right">{Math.round(maxValue * 0.5)}ms</div>
            <div className="pr-2 text-right">{Math.round(maxValue * 0.25)}ms</div>
            <div className="pr-2 text-right">0ms</div>
          </div>
          
          {/* Chart container */}
          <div className="relative h-full ml-16">
            {/* Chart background grid */}
            <div className="absolute inset-0 border-b border-l rounded-md border-slate-700/70">
              <div className="absolute w-full border-t border-slate-700/30" style={{ bottom: '75%' }}></div>
              <div className="absolute w-full border-t border-slate-700/30" style={{ bottom: '50%' }}></div>
              <div className="absolute w-full border-t border-slate-700/30" style={{ bottom: '25%' }}></div>
              
              {/* Vertical grid lines */}
              {percentileKeys.map((_, index) => (
                <div
                  key={index}
                  className="absolute h-full border-r border-slate-700/30"
                  style={{ left: `${(index / (percentileKeys.length - 1)) * 100}%` }}
                ></div>
              ))}
            </div>
            
            {/* Line chart SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Area under the line */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Generate path data */}
              {(() => {
                const pathPoints = percentileKeys.map((key, index) => {
                  const value = responseTimes.percentiles[key];
                  const x = (index / (percentileKeys.length - 1)) * 100;
                  const y = 100 - ((value / maxValue) * 100);
                  return { x, y };
                });
                
                const linePathData = pathPoints.map((point, index) =>
                  `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ');
                
                const areaPathData = `${linePathData} L 100 100 L 0 100 Z`;
                
                return (
                  <>
                    {/* Area fill */}
                    <path
                      d={areaPathData}
                      fill="url(#lineGradient)"
                    />
                    
                    {/* Line stroke */}
                    <path
                      d={linePathData}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                );
              })()}
            </svg>
            
            {/* Data points overlay */}
            <div className="absolute inset-0">
              {percentileKeys.map((key, index) => {
                const value = responseTimes.percentiles[key];
                const x = (index / (percentileKeys.length - 1)) * 100;
                const y = 100 - ((value / maxValue) * 100);
                
                return (
                  <div
                    key={key}
                    className="absolute w-3 h-3 -ml-1.5 -mt-1.5 group"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`
                    }}
                  >
                    {/* Outer glow */}
                    <div className="absolute inset-0 rounded-full bg-blue-500/30"></div>
                    {/* Inner circle */}
                    <div className="absolute inset-0.5 bg-blue-500 border border-blue-700 rounded-full"></div>
                    
                    {/* Tooltip */}
                    <div className="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity transform -translate-x-1/2 rounded opacity-0 bottom-full left-1/2 bg-slate-800 group-hover:opacity-100 whitespace-nowrap">
                      {formatPercentileLabel(key)}: {value}ms
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* X-axis labels */}
            <div className="absolute left-0 right-0 flex justify-between text-xs -bottom-8 text-slate-400">
              {percentileKeys.map(key => (
                <div key={key} className="text-center">
                  {formatPercentileLabel(key)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-6 mt-6 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-slate-700/50">
            <span className="block mb-1 text-slate-400">Minimum Response Time</span>
            <span className="text-xl font-semibold text-white">{responseTimes.min}ms</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50">
            <span className="block mb-1 text-slate-400">Maximum Response Time</span>
            <span className="text-xl font-semibold text-white">{responseTimes.max}ms</span>
          </div>
        </div>
        
        <div className="p-4 mt-4 rounded-lg bg-slate-700/30">
          <h4 className="mb-2 text-sm font-medium text-slate-300">Response Time Distribution</h4>
          <p className="text-xs text-slate-400">
            The chart shows the distribution of response times across different percentiles.
            Lower percentiles (50th) represent typical user experience, while higher percentiles
            (99th, 99.9th) show worst-case scenarios that affect a small percentage of requests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimesDetailChart;
