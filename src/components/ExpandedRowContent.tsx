import React from 'react';
import * as echarts from 'echarts';
import { RequestResult } from '../types';
import StatusBadge from './StatusBadge';
import LineGraph from './LineGraph/';

interface ExpandedRowContentProps {
  result: RequestResult;
  index: number;
}

export const ExpandedRowContent: React.FC<ExpandedRowContentProps> = ({ result, index }) => {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-4 bg-slate-900/50">
        <div className="space-y-4">
          {/* Response Time Chart */}
          {result.responseTimes && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-slate-300 mb-3">Response Time Distribution</h5>
              <div className="h-64">
                {(() => {
                  try {
                    // Validate and prepare requirements data
                    const requirements = result.requirements?.percentiles?.filter(req => {
                      return req && 
                             typeof req.percentile === 'number' && 
                             typeof req.value === 'number' && 
                             (req.status === 'PASS' || req.status === 'FAIL');
                    }).map(req => ({
                      percentile: req.percentile,
                      value: req.value,
                      status: (req.status === 'PASS' || req.status === 'FAIL') ? req.status as 'PASS' | 'FAIL' : 'FAIL',
                      difference: typeof req.difference === 'number' ? req.difference : 0,
                      percentageDifference: typeof req.percentageDifference === 'number' ? req.percentageDifference : 0
                    })) || [];

                    // Validate response times data
                    const responseTimesData = {
                      min: typeof result.responseTimes?.min === 'number' ? result.responseTimes.min : 0,
                      max: typeof result.responseTimes?.max === 'number' ? result.responseTimes.max : 0,
                      percentiles: result.responseTimes?.percentiles || {}
                    };

                    // Validate percentiles object
                    const validPercentiles = Object.entries(responseTimesData.percentiles)
                      .filter(([key, value]) => !isNaN(parseFloat(key)) && typeof value === 'number')
                      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

                    if (Object.keys(validPercentiles).length === 0) {
                      throw new Error('No valid percentile data available');
                    }

                    return (
                      <LineGraph
                        responseTimes={{
                          ...responseTimesData,
                          percentiles: validPercentiles
                        }}
                        requirements={requirements}
                        title=''
                        className="w-full"
                      />
                    );
                  } catch (error) {
                    console.error('Error rendering LineGraph for request:', result.request?.requestName, error);
                    return (
                      <div className="text-center py-4 text-slate-400 border border-slate-600 rounded">
                        <p className="text-sm">Chart unavailable</p>
                        <p className="text-xs mt-1">Data format error</p>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}

          {/* Pass/Fail Chart */}
          {(result.passCount !== undefined || result.failCount !== undefined) && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-slate-300 mb-3">Pass/Fail Distribution</h5>
              <div className="flex items-center gap-6">
                <div className="h-32 w-32">
                  <div ref={(el) => {
                    if (el) {
                      // Cleanup any existing chart
                      if ((el as any)?._chartCleanup) {
                        (el as any)._chartCleanup();
                      }
                      
                      // Create new chart
                      const chart = echarts.init(el);
                      
                      // Calculate pass/fail counts
                      const passCount = result.passCount || 0;
                      const failCount = result.failCount || 0;
                      
                      // Chart options
                      const option = {
                        tooltip: {
                          trigger: 'item',
                          formatter: '{b}: {c} ({d}%)'
                        },
                        legend: {
                          bottom: 18,
                          left: 'center',
                          textStyle: {
                            color: '#94a3b8',
                            fontSize: 10
                          },
                          itemWidth: 12,
                          itemHeight: 12,
                          itemGap: 15,
                          padding: 6,
                          selectedMode: false,
                        },
                        series: [
                          {
                            name: 'Requests',
                            type: 'pie',
                            radius: ['50%', '90%'],
                            center: ['50%', '50%'],
                            startAngle: 180,
                            endAngle: 360,
                            itemStyle: {
                              borderRadius: 4,
                              borderWidth: 2,
                              borderColor: '#0f172a'
                            },
                            label: {
                              show: false
                            },
                            data: [
                              ...(failCount > 0 ? [{ 
                                value: failCount, 
                                name: 'FAIL', 
                                itemStyle: { color: '#ef4444' }
                              }] : []),
                              { 
                                value: passCount, 
                                name: 'PASS', 
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
                
                {result.requirements?.percentiles && result.requirements.percentiles.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-xs font-semibold text-slate-400 mb-2">Percentile Requirements</h6>
                    <div className="space-y-1">
                      {result.requirements.percentiles.map((req, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{req.percentile}th:</span>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={req.status} />
                            <span className="text-white">{req.value}ms</span>
                            {req.difference !== null && (
                              <span className={`${req.difference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                ({req.difference > 0 ? '+' : ''}{req.difference}ms)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional metadata if available */}
          {(result.request?.requestDescription || result.request?.requestPriority || result.request?.tags) && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-slate-300 mb-2">Additional Information</h5>
              <div className="space-y-2 text-sm">
                {result.request?.requestDescription && (
                  <div><span className="text-slate-400">Description:</span> <span className="text-white">{result.request.requestDescription}</span></div>
                )}
                {result.request?.requestPriority && (
                  <div><span className="text-slate-400">Priority:</span> <span className="text-white">{result.request.requestPriority}</span></div>
                )}
                {result.request?.tags && (
                  <div><span className="text-slate-400">Tags:</span> <span className="text-white">{result.request.tags}</span></div>
                )}
                {result.request?.createdTime && (
                  <div><span className="text-slate-400">Created:</span> <span className="text-white">{new Date(result.request.createdTime).toLocaleString()}</span></div>
                )}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
