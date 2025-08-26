import React from 'react';
import * as echarts from 'echarts';
import { RequestResult, TestResults } from '../../types';
import StatusBadge from '../StatusBadge';
import SeverityBadge from '../SeverityBadge';
import LineGraph from '../LineGraph/';
import Requirements from '../Requirements';
import { useTheme } from '../../contexts/ThemeContext';

interface RequestTableRowProps {
  result: RequestResult;
  index: number;
  testData: TestResults;
  availablePercentiles: string[];
  isExpanded: boolean;
  onToggleExpansion: (resultId: number) => void;
  formatResponseTime: (time: number) => string;
}

export const RequestTableRow: React.FC<RequestTableRowProps> = ({
  result,
  index,
  testData,
  availablePercentiles,
  isExpanded,
  onToggleExpansion,
  formatResponseTime,
}) => {
  const { theme } = useTheme();
  
  // Debug logging for theme behavior
  console.log(`[RequestTableRow] Theme: ${theme}, IsExpanded: ${isExpanded}, ResultId: ${result?.id || index}`);
  
  // Add null checks to prevent runtime errors
  if (!result || !result.request || !result.responseTimes) {
    console.warn('Invalid result object:', result);
    return null;
  }

  const hasExpandableData = result.passCount || 
    result.failCount || 
    (result.requirements && (result.requirements.passed > 0 || result.requirements.failed > 0));

  return (
    <React.Fragment key={result.id || index}>
      <tr 
        className={`border-b border-gray-200 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${
          index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-800/10'
        }`}
      >
        <td className="px-2 py-4 text-sm text-gray-900 dark:text-white font-medium">
          {/* Only show accordion if there's data to display */}
          {hasExpandableData ? (
            <button
              onClick={() => onToggleExpansion(result.id || index)}
              className="flex items-center gap-2 text-left hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <span className="text-xs">
                {isExpanded ? '▼' : '▶'}
              </span>
              {result.request?.requestName || 'Unknown Request'}
            </button>
          ) : (
            <span className="pl-4">{result.request?.requestName || 'Unknown Request'}</span>
          )}
        </td>
        {testData.testRequirements && (
          <td className="px-2 py-4 text-center">
            <StatusBadge status={result.status} />
          </td>
        )}
        {testData.severityVersion && (
          <td className="px-2 py-4 text-center">
            <SeverityBadge severity={result.severity} />
          </td>
        )}
        <td className="px-2 py-4 text-sm text-center text-gray-600 dark:text-slate-300">
          {formatResponseTime(result.responseTimes?.min || 0)}
        </td>
        {availablePercentiles.map(percentile => (
          <td key={percentile} className="px-2 py-4 text-sm text-center text-gray-600 dark:text-slate-300">
            {formatResponseTime(result.responseTimes?.percentiles?.[percentile] || 0)}
          </td>
        ))}
        <td className="px-2 py-4 text-sm text-center text-gray-600 dark:text-slate-300">
          {formatResponseTime(result.responseTimes?.max || 0)}
        </td>
        <td className="px-2 py-4 text-sm text-center text-gray-600 dark:text-slate-300">
          {(result.totalCount || 0).toLocaleString()}
        </td>
        <td className="px-2 py-4 text-sm text-center">
          <span className={`font-medium ${
            Number(result.errorPercentage || 0) > 5 ? 'text-red-500 dark:text-red-400' : 
            Number(result.errorPercentage || 0) > 1 ? 'text-yellow-500 dark:text-yellow-400' : 'text-green-500 dark:text-green-400'
          }`}>
            {Number(result.errorPercentage || 0).toFixed(2)}%
          </span>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className={`${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/50'}`}>
          <td colSpan={7 + (testData.testRequirements ? 1 : 0) + (testData.severityVersion ? 1 : 0) + availablePercentiles.length} className="px-6 py-4">
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Request Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Pass/Fail Chart - Only show if there's data */}
                {(result.passCount || result.failCount) ? (
                  <div className={`rounded-lg p-4 shadow-sm ${
                    theme === 'light' 
                      ? 'bg-white border border-gray-200' 
                      : 'bg-slate-800/50 border border-slate-700'
                  }`}>
                    <h5 className={`text-sm font-semibold mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-slate-300'
                    }`}>Pass/Fail Distribution</h5>
                    <div className="text-sm">
                      {/* Pass/Fail Chart */}
                      <div>
                        <div key={`pass-fail-chart-${result.id || index}-${theme}`} id={`pass-fail-chart-${result.id || index}`} className="w-full h-28" ref={el => {
                        if (el) {
                          
                          // Initialize chart with transparent background to match parent div
                          const chart = echarts.init(el, null, {
                            renderer: 'canvas'
                          });
                          
                          // Set background color through setOption instead
                          chart.setOption({
                            backgroundColor: 'transparent'
                          });
                          
                          // Calculate pass/fail counts
                          const passCount = result.passCount || 0;
                          const failCount = result.failCount || 0;
                          
                          // Theme-aware colors using React context
                          const legendTextColor = theme === 'light' ? '#64748b' : '#94a3b8';
                          const borderColor = theme === 'light' ? '#f1f5f9' : '#0f172a';
                          
                          console.log(`[PassFailChart] Theme colors - legend: ${legendTextColor}, border: ${borderColor}`);
                          
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
                                color: legendTextColor,
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
                                  borderColor: borderColor
                                },
                                label: {
                                  show:false
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
                    
                    <div className="flex justify-between mt-2">
                      <div><span className="text-gray-600 dark:text-slate-400">Total:</span> <span className="text-gray-900 dark:text-white">{(result.totalCount || 0).toLocaleString()}</span></div>
                      <div><span className="text-gray-600 dark:text-slate-400">Rate:</span> <span className="text-gray-900 dark:text-white">{Number(result.rate || 0).toFixed(2)} {result.rateGranularity}</span></div>
                    </div>
                  </div>
                </div>
                ) : null}

                {/* Response Times */}
                {result.responseTimes?.percentiles && (
                  <div className={`rounded-lg p-4 shadow-sm ${
                    theme === 'light' 
                      ? 'bg-white border border-gray-200' 
                      : 'bg-slate-800/50 border border-slate-700'
                  }`}>
                    <h5 className={`text-sm font-semibold mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-slate-300'
                    }`}>Response Times</h5>
                    <div className="h-auto">
                      <div className="chart-error-boundary">
                        {(() => {
                          try {
                            // Safely map requirements data with proper error handling
                            const requirements = result.requirements?.percentiles?.filter(req => {
                              return req && typeof req.percentile === 'number' && typeof req.value === 'number';
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
                              <div className="text-center py-4 text-gray-600 dark:text-slate-400 border border-gray-300 dark:border-slate-600 rounded">
                                <p className="text-sm">Chart unavailable</p>
                                <p className="text-xs mt-1">Data format error</p>
                              </div>
                            );
                          }
                        })()
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Requirements (if available and has data) */}
                {result.requirements && (result.requirements.passed > 0 || result.requirements.failed > 0) && (
                  <Requirements 
                    requirements={result.requirements} 
                    resultId={result.id || index} 
                  />
                )}
              </div>

              {/* Additional metadata if available */}
              {(result.request?.requestDescription || result.request?.requestPriority || result.request?.tags) && (
                <div className={`rounded-lg p-4 shadow-sm ${
                  theme === 'light' 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-slate-800/50 border border-slate-700'
                }`}>
                  <h5 className={`text-sm font-semibold mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-slate-300'
                  }`}>Additional Information</h5>
                  <div className="space-y-2 text-sm">
                    {result.request?.requestDescription && (
                      <div><span className="text-gray-600 dark:text-slate-400">Description:</span> <span className="text-gray-900 dark:text-white">{result.request.requestDescription}</span></div>
                    )}
                    {result.request?.requestPriority && (
                      <div><span className="text-gray-600 dark:text-slate-400">Priority:</span> <span className="text-gray-900 dark:text-white">{result.request.requestPriority}</span></div>
                    )}
                    {result.request?.tags && (
                      <div><span className="text-gray-600 dark:text-slate-400">Tags:</span> <span className="text-gray-900 dark:text-white">{result.request.tags}</span></div>
                    )}
                    {result.request?.createdTime && (
                      <div><span className="text-gray-600 dark:text-slate-400">Created:</span> <span className="text-gray-900 dark:text-white">{new Date(result.request.createdTime).toLocaleString()}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};
