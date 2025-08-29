import React from 'react';
import * as echarts from 'echarts';
import StatusBadge from '../StatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export interface RequirementPercentile {
  percentile: number;
  value: number;
  status: string;
  difference?: number | null;
  percentageDifference?: number | null;
}

export interface RequirementsData {
  passed: number;
  failed: number;
  percentiles?: RequirementPercentile[];
}

export interface RequirementsProps {
  requirements: RequirementsData;
  resultId: number | string;
}

const Requirements: React.FC<RequirementsProps> = ({ requirements, resultId }) => {
  const { theme } = useTheme();
  
  if (!requirements || (requirements.passed === 0 && requirements.failed === 0)) {
    return null;
  }

  return (
    <div className={`rounded-lg p-4 shadow-sm ${
      theme === 'light' 
        ? 'bg-white border border-gray-200' 
        : 'bg-slate-800/50 border border-slate-700'
    }`}>
      <h5 className={`text-sm font-semibold mb-2 ${
        theme === 'light' ? 'text-gray-700' : 'text-slate-300'
      }`}>Requirements</h5>
      <div className="text-sm">
        {/* Requirements Chart */}
        <div>
          <div key={`chart-${resultId}-${theme}`} id={`chart-${resultId}`} className="w-full h-28" ref={el => {
            if (el) {
              
              // Initialize chart with transparent background to match parent div
              const chart = echarts.init(el, null, {
                renderer: 'canvas'
              });
              
              // Set background color through setOption instead
              chart.setOption({
                backgroundColor: 'transparent'
              });
              
              // Use theme from React context for colors
              const legendColor = theme === 'light' ? '#374151' : '#e2e8f0';
              const borderColor = theme === 'light' ? '#d1d5db' : '#475569';
              
              // Get requirements data
              const passed = requirements?.passed || 0;
              const failed = requirements?.failed || 0;
              
              // Chart options
              const option = {
                tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c}'
                },
                legend: {
                  bottom: 18, //Reduce gap between chart and legend
                  left: 'center',
                  textStyle: {
                    color: legendColor,
                    fontSize: 10
                  },
                  selectedMode: false,
                  itemWidth: 12,
                  itemHeight: 12,
                  itemGap: 15, 
                  padding: 6,
                },
                series: [
                  {
                    name: 'Requirements',
                    type: 'pie',
                    radius: ['50%', '90%'], 
                    center: ['50%', '50%'], 
                    startAngle: 180,
                    endAngle: 360,
                    itemStyle: {
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: borderColor
                    },
                    label: {
                      show: false 
                    },
                    data: [
                      ...(failed > 0 ? [{ 
                        value: failed, 
                        name: 'FAILED', 
                        itemStyle: { color: '#ef4444' }
                      }] : []),
                      { 
                        value: passed, 
                        name: 'PASSED', 
                        itemStyle: { color: '#10b981' } 
                      }
                    ]
                  }
                ],
                grid: {
                  bottom: 0
                }
              };
              
              // Apply options
              chart.setOption(option);
              
              // Handle resize
              const resizeObserver = new ResizeObserver(() => {
                chart.resize();
              });
              resizeObserver.observe(el);
              
              // Store cleanup function on the element for later cleanup
              (el as any)._chartCleanup = () => {
                chart.dispose();
                resizeObserver.disconnect();
              };
            } else {
              // Cleanup when element is removed
              if ((el as any)?._chartCleanup) {
                (el as any)._chartCleanup();
              }
            }
          }} />
        </div>
        
        {requirements.percentiles && requirements.percentiles.length > 0 && (
          <div className="mt-3">
            <h6 className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">Percentile Requirements</h6>
            <div className="space-y-2">
              {requirements.percentiles.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-slate-400 font-medium">{req.percentile}th:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">{req.value}ms</span>
                    {req.difference !== null && req.difference !== undefined && (
                      <span className={`${req.difference > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                        ({req.difference > 0 ? '+' : ''}{req.difference}ms)
                      </span>
                    )}
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requirements;
