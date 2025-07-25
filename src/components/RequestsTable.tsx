import React, { useState, useMemo } from 'react';
import { TestResults, RequestResult } from '../types';
import { StatusBadge } from './StatusBadge';

interface RequestsTableProps {
  testData: TestResults;
}

type SortColumn = 'name' | 'status' | 'min' | 'max' | 'totalCount' | 'errorPercentage' | string;
type SortDirection = 'asc' | 'desc';

export const RequestsTable: React.FC<RequestsTableProps> = ({ testData }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  try {
    const requestResults = testData?.requestResults || [];

    const formatResponseTime = (time: number) => {
      return `${time}`;
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

    const handleSort = (column: SortColumn) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    };

    const getSortValue = (result: RequestResult, column: SortColumn): number | string => {
      switch (column) {
        case 'name':
          return result.request?.requestName || '';
        case 'status':
          return result.status || '';
        case 'min':
          return result.responseTimes?.min || 0;
        case 'max':
          return result.responseTimes?.max || 0;
        case 'totalCount':
          return result.totalCount || 0;
        case 'errorPercentage':
          return Number(result.errorPercentage || 0);
        default:
          // Handle percentiles (column will be the percentile value like "50", "95", etc.)
          return result.responseTimes?.percentiles?.[column] || 0;
      }
    };

    const sortedResults = useMemo(() => {
      if (!requestResults || requestResults.length === 0) return [];
      
      return [...requestResults].sort((a, b) => {
        const aValue = getSortValue(a, sortColumn);
        const bValue = getSortValue(b, sortColumn);
        
        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = Number(aValue) - Number(bValue);
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }, [requestResults, sortColumn, sortDirection]);

    const SortableHeader: React.FC<{ column: SortColumn; children: React.ReactNode; className?: string }> = ({ 
      column, 
      children, 
      className = "px-6 py-4 text-center text-sm font-semibold text-white" 
    }) => (
      <th 
        className={`${className} cursor-pointer hover:bg-slate-700/30 transition-colors select-none`}
        onClick={() => handleSort(column)}
      >
        <div className="flex items-center justify-center gap-1">
          {children}
          <span className="text-xs">
            {sortColumn === column ? (
              sortDirection === 'asc' ? '↑' : '↓'
            ) : (
              '↕'
            )}
          </span>
        </div>
      </th>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
        <thead>
          <tr className="border-b border-slate-700">
            <SortableHeader column="name" className="px-6 py-4 text-left text-sm font-semibold text-white">
              Name
            </SortableHeader>
            {testData.testRequirements && (
              <SortableHeader column="status">
                Status
              </SortableHeader>
            )}
            <SortableHeader column="min">
              Min
            </SortableHeader>
            {availablePercentiles.map(percentile => (
              <SortableHeader key={percentile} column={percentile}>
                {parseFloat(percentile) === 100 ? '100' : `${parseFloat(percentile)}`}
              </SortableHeader>
            ))}
            <SortableHeader column="max">
              Max
            </SortableHeader>
            <SortableHeader column="totalCount">
              Total Count
            </SortableHeader>
            <SortableHeader column="errorPercentage">
              Error %
            </SortableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result, index) => {
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
                <td className="px-2 py-4 text-sm text-white font-medium">
                  {result.request?.requestName || 'Unknown Request'}
                </td>
                {testData.testRequirements && (
                  <td className="px-2 py-4 text-center">
                    <StatusBadge status={result.status} />
                  </td>
                )}
                <td className="px-2 py-4 text-sm text-center text-slate-300">
                  {formatResponseTime(result.responseTimes?.min || 0)}
                </td>
                {availablePercentiles.map(percentile => (
                  <td key={percentile} className="px-2 py-4 text-sm text-center text-slate-300">
                    {formatResponseTime(result.responseTimes?.percentiles?.[percentile] || 0)}
                  </td>
                ))}
                <td className="px-2 py-4 text-sm text-center text-slate-300">
                  {formatResponseTime(result.responseTimes?.max || 0)}
                </td>
                <td className="px-2 py-4 text-sm text-center text-slate-300">
                  {(result.totalCount || 0).toLocaleString()}
                </td>
                <td className="px-2 py-4 text-sm text-center">
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
