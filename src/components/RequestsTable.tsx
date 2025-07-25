import React from 'react';
import { TestResults, RequestResult } from '../types';

interface RequestsTableProps {
  testData: TestResults;
}

export const RequestsTable: React.FC<RequestsTableProps> = ({ testData }) => {
  try {
    const requestResults = testData?.requestResults || [];

    const formatResponseTime = (time: number) => {
      return `${time}ms`;
    };

    // Early return if no data
    if (!testData) {
      return (
        <div className="text-center py-8 text-slate-400">
          No test data available
        </div>
      );
    }

    // Early return if no requestResults
    if (!requestResults || requestResults.length === 0) {
      return (
        <div className="text-center py-8 text-slate-400">
          No request data available
        </div>
      );
    }

    // Get available percentiles dynamically from the first result
    const availablePercentiles = requestResults.length > 0 && requestResults[0]?.responseTimes?.percentiles 
      ? Object.keys(requestResults[0].responseTimes.percentiles).sort((a, b) => parseFloat(a) - parseFloat(b))
      : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Request Name</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Min (ms)</th>
            {availablePercentiles.map(percentile => (
              <th key={percentile} className="px-6 py-4 text-center text-sm font-semibold text-white">
                {parseFloat(percentile) === 100 ? '100th %ile' : `${parseFloat(percentile)}th %ile`}
              </th>
            ))}
            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Max (ms)</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Total Count</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Error %</th>
          </tr>
        </thead>
        <tbody>
          {requestResults.map((result, index) => {
            // Add null checks to prevent runtime errors
            if (!result || !result.request || !result.responseTimes) {
              console.warn('Invalid result object:', result);
              return null;
            }
            
            return (
              <tr 
                key={result.id || index} 
                className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                  index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'
                }`}
              >
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {result.request?.requestName || 'Unknown Request'}
                </td>
                <td className="px-6 py-4 text-sm text-center text-slate-300">
                  {formatResponseTime(result.responseTimes?.min || 0)}
                </td>
                {availablePercentiles.map(percentile => (
                  <td key={percentile} className="px-6 py-4 text-sm text-center text-slate-300">
                    {formatResponseTime(result.responseTimes?.percentiles?.[percentile] || 0)}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm text-center text-slate-300">
                  {formatResponseTime(result.responseTimes?.max || 0)}
                </td>
                <td className="px-6 py-4 text-sm text-center text-slate-300">
                  {(result.totalCount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className={`font-medium ${
                    Number(result.errorPercentage || 0) > 5 ? 'text-red-400' : 
                    Number(result.errorPercentage || 0) > 1 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Number(result.errorPercentage || 0).toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {requestResults.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No request data available
        </div>
      )}
    </div>
  );
  } catch (error) {
    console.error('Error in RequestsTable:', error);
    console.error('testData:', testData);
    console.error('requestResults:', testData?.requestResults);
    return (
      <div className="text-center py-8 text-red-400">
        Error loading request data: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
};
