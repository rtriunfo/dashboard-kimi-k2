import React, { useState, useMemo } from 'react';
import { TestResults, RequestResult } from '../types';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';

interface RequestsTableProps {
  testData: TestResults;
}

type SortColumn = 'name' | 'status' | 'severity' | 'min' | 'max' | 'totalCount' | 'errorPercentage' | string;
type SortDirection = 'asc' | 'desc';

export const RequestsTable: React.FC<RequestsTableProps> = ({ testData }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeverities, setSelectedSeverities] = useState<Set<string>>(new Set());
  const [isSeverityDropdownOpen, setIsSeverityDropdownOpen] = useState(false);
  const [numericField, setNumericField] = useState<string>('');
  const [numericOperator, setNumericOperator] = useState<'gt' | 'lt'>('gt');
  const [numericValue, setNumericValue] = useState<string>('');
  const [isNumericDropdownOpen, setIsNumericDropdownOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
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
        case 'severity':
          return result.severity || '';
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

    // Get unique statuses for filter options
    const availableStatuses = useMemo(() => {
      if (!requestResults || requestResults.length === 0) return [];
      const statuses = new Set(requestResults.map(result => result.status).filter(Boolean));
      return Array.from(statuses).sort();
    }, [requestResults]);

    // Get unique severities for filter options
    const availableSeverities = useMemo(() => {
      if (!requestResults || requestResults.length === 0) return [];
      const severities = new Set(requestResults.map(result => result.severity).filter(Boolean));
      return Array.from(severities).sort();
    }, [requestResults]);

    // Available numeric fields for filtering
    const numericFields = [
      { key: 'min', label: 'Min Response Time' },
      { key: 'max', label: 'Max Response Time' },
      { key: 'totalCount', label: 'Total Count' },
      { key: 'errorPercentage', label: 'Error Percentage' },
      ...availablePercentiles.map(p => ({ key: p, label: `${p}th Percentile` }))
    ];

    const handleStatusToggle = (status: string) => {
      const newSelectedStatuses = new Set(selectedStatuses);
      if (newSelectedStatuses.has(status)) {
        newSelectedStatuses.delete(status);
      } else {
        newSelectedStatuses.add(status);
      }
      setSelectedStatuses(newSelectedStatuses);
    };

    const handleSeverityToggle = (severity: string) => {
      const newSelectedSeverities = new Set(selectedSeverities);
      if (newSelectedSeverities.has(severity)) {
        newSelectedSeverities.delete(severity);
      } else {
        newSelectedSeverities.add(severity);
      }
      setSelectedSeverities(newSelectedSeverities);
    };

    const clearFilters = () => {
      setSelectedStatuses(new Set());
      setSelectedSeverities(new Set());
      setNumericField('');
      setNumericValue('');
    };

    const toggleRowExpansion = (resultId: number) => {
      const newExpandedRows = new Set(expandedRows);
      if (newExpandedRows.has(resultId)) {
        newExpandedRows.delete(resultId);
      } else {
        newExpandedRows.add(resultId);
      }
      setExpandedRows(newExpandedRows);
    };

    const getNumericFieldValue = (result: RequestResult, field: string): number => {
      switch (field) {
        case 'min':
          return result.responseTimes?.min || 0;
        case 'max':
          return result.responseTimes?.max || 0;
        case 'totalCount':
          return result.totalCount || 0;
        case 'errorPercentage':
          return Number(result.errorPercentage || 0);
        default:
          // Handle percentiles
          return result.responseTimes?.percentiles?.[field] || 0;
      }
    };

    const filteredAndSortedResults = useMemo(() => {
      if (!requestResults || requestResults.length === 0) return [];
      
      // First filter by status, severity, and numeric criteria
      let filtered = requestResults;
      if (selectedStatuses.size > 0) {
        filtered = filtered.filter(result => 
          result.status && selectedStatuses.has(result.status)
        );
      }
      if (selectedSeverities.size > 0) {
        filtered = filtered.filter(result => 
          result.severity && selectedSeverities.has(result.severity)
        );
      }
      if (numericField && numericValue && !isNaN(Number(numericValue))) {
        const filterValue = Number(numericValue);
        filtered = filtered.filter(result => {
          const fieldValue = getNumericFieldValue(result, numericField);
          return numericOperator === 'gt' ? fieldValue > filterValue : fieldValue < filterValue;
        });
      }
      
      // Then sort
      return [...filtered].sort((a, b) => {
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
    }, [requestResults, sortColumn, sortDirection, selectedStatuses, selectedSeverities, numericField, numericOperator, numericValue]);

    const SortableHeader: React.FC<{ column: SortColumn; children: React.ReactNode; className?: string }> = ({ 
      column, 
      children, 
      className = "px-6 py-4 text-center text-sm font-semibold text-white" 
    }) => (
      <th 
        className={`${className} cursor-pointer hover:bg-slate-700/30 transition-colors select-none`}
        onClick={() => handleSort(column)}
      >
        <div className={`flex items-center gap-1 ${column === 'name' ? 'justify-start' : 'justify-center'}`}>
          {children}
          {sortColumn === column && (
            <span className="text-xs">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </th>
    );

  return (
    <div className="space-y-4">
      {/* Filter Dropdowns */}
      {((testData.testRequirements && availableStatuses.length > 0) || (testData.severityVersion && availableSeverities.length > 0) || numericFields.length > 0) && (
        <div className="flex justify-start gap-3 flex-wrap">
          {/* Status Filter Dropdown */}
          {testData.testRequirements && availableStatuses.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-sm text-white hover:bg-slate-700/50 transition-colors"
              >
                <span>Status</span>
                {selectedStatuses.size > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {selectedStatuses.size}
                  </span>
                )}
                <span className="text-xs">
                  {isDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-w-48 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {(selectedStatuses.size > 0 || selectedSeverities.size > 0 || (numericField && numericValue)) && (
                      <button
                        onClick={clearFilters}
                        className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors mb-1"
                      >
                        Clear all filters
                      </button>
                    )}
                    {availableStatuses.map(status => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatuses.has(status)}
                          onChange={() => handleStatusToggle(status)}
                          className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-white flex-1">{status}</span>
                        <span className="text-xs text-slate-400">
                          {requestResults.filter(r => r.status === status).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Severity Filter Dropdown */}
          {testData.severityVersion && availableSeverities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsSeverityDropdownOpen(!isSeverityDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-sm text-white hover:bg-slate-700/50 transition-colors"
              >
                <span>Severity</span>
                {selectedSeverities.size > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {selectedSeverities.size}
                  </span>
                )}
                <span className="text-xs">
                  {isSeverityDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {isSeverityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-w-48 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {(selectedStatuses.size > 0 || selectedSeverities.size > 0 || (numericField && numericValue)) && (
                      <button
                        onClick={clearFilters}
                        className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors mb-1"
                      >
                        Clear all filters
                      </button>
                    )}
                    {availableSeverities.map(severity => (
                      <label
                        key={severity}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSeverities.has(severity)}
                          onChange={() => handleSeverityToggle(severity)}
                          className="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-white flex-1">{severity}</span>
                        <span className="text-xs text-slate-400">
                          {requestResults.filter(r => r.severity === severity).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Numeric Filter Dropdown */}
          {numericFields.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsNumericDropdownOpen(!isNumericDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-sm text-white hover:bg-slate-700/50 transition-colors"
              >
                <span>Numeric Filter</span>
                {numericField && numericValue && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    1
                  </span>
                )}
                <span className="text-xs">
                  {isNumericDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {isNumericDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-w-64 max-h-64 overflow-y-auto">
                  <div className="p-3 space-y-3">
                    {(selectedStatuses.size > 0 || selectedSeverities.size > 0 || (numericField && numericValue)) && (
                      <button
                        onClick={clearFilters}
                        className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Field</label>
                      <select
                        value={numericField}
                        onChange={(e) => setNumericField(e.target.value)}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select field...</option>
                        {numericFields.map(field => (
                          <option key={field.key} value={field.key}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Operator</label>
                      <select
                        value={numericOperator}
                        onChange={(e) => setNumericOperator(e.target.value as 'gt' | 'lt')}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="gt">Greater than</option>
                        <option value="lt">Less than</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Value</label>
                      <input
                        type="number"
                        value={numericValue}
                        onChange={(e) => setNumericValue(e.target.value)}
                        placeholder="Enter number..."
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    {numericField && numericValue && (
                      <div className="text-xs text-slate-400 bg-slate-700/50 p-2 rounded">
                        Showing requests where <span className="text-white">{numericFields.find(f => f.key === numericField)?.label}</span> is{' '}
                        <span className="text-white">{numericOperator === 'gt' ? 'greater than' : 'less than'}</span>{' '}
                        <span className="text-white">{numericValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
            {testData.severityVersion && (
              <SortableHeader column="severity">
                Severity
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
              Count
            </SortableHeader>
            <SortableHeader column="errorPercentage">
              Errors
            </SortableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedResults.map((result, index) => {
            // Add null checks to prevent runtime errors
            if (!result || !result.request || !result.responseTimes) {
              console.warn('Invalid result object:', result);
              return null;
            }
            
            const isExpanded = expandedRows.has(result.id || index);
            
            return (
              <React.Fragment key={result.id || index}>
                <tr 
                  className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                    index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'
                  }`}
                >
                  <td className="px-2 py-4 text-sm text-white font-medium">
                    <button
                      onClick={() => toggleRowExpansion(result.id || index)}
                      className="flex items-center gap-2 text-left hover:text-blue-400 transition-colors"
                    >
                      <span className="text-xs">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      {result.request?.requestName || 'Unknown Request'}
                    </button>
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
                
                {isExpanded && (
                  <tr className="bg-slate-900/50">
                    <td colSpan={7 + (testData.testRequirements ? 1 : 0) + (testData.severityVersion ? 1 : 0) + availablePercentiles.length} className="px-6 py-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Request Details</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Basic Information */}
                          <div className="bg-slate-800/50 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-slate-300 mb-2">Basic Information</h5>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-slate-400">ID:</span> <span className="text-white">{result.id}</span></div>
                              <div><span className="text-slate-400">Name:</span> <span className="text-white">{result.request?.requestName}</span></div>
                              <div><span className="text-slate-400">Total Count:</span> <span className="text-white">{(result.totalCount || 0).toLocaleString()}</span></div>
                              <div><span className="text-slate-400">Pass Count:</span> <span className="text-green-400">{(result.passCount || 0).toLocaleString()}</span></div>
                              <div><span className="text-slate-400">Fail Count:</span> <span className="text-red-400">{(result.failCount || 0).toLocaleString()}</span></div>
                              <div><span className="text-slate-400">Error Rate:</span> <span className="text-white">{Number(result.errorPercentage || 0).toFixed(2)}%</span></div>
                              <div><span className="text-slate-400">Rate:</span> <span className="text-white">{Number(result.rate || 0).toFixed(2)} {result.rateGranularity}</span></div>
                            </div>
                          </div>

                          {/* Response Times */}
                          <div className="bg-slate-800/50 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-slate-300 mb-2">Response Times (ms)</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <div><span className="text-slate-400">Min:</span> <span className="text-white">{result.responseTimes?.min || 0}</span></div>
                                <div><span className="text-slate-400">Max:</span> <span className="text-white">{result.responseTimes?.max || 0}</span></div>
                              </div>
                              
                              {result.responseTimes?.percentiles && (
                                <div className="space-y-2">
                                  <div className="relative h-32">
                                    <svg className="w-full h-full" viewBox="0 0 320 140">
                                    {/* Grid lines */}
                                    <defs>
                                      <pattern id="grid" width="30" height="12" patternUnits="userSpaceOnUse">
                                        <path d="M 30 0 L 0 0 0 12" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                                      </pattern>
                                    </defs>
                                    <rect x="30" y="10" width="280" height="100" fill="url(#grid)" />
                                    
                                    {(() => {
                                      const percentiles = Object.entries(result.responseTimes.percentiles)
                                        .map(([p, v]) => ({ percentile: parseFloat(p), value: v }))
                                        .sort((a, b) => a.percentile - b.percentile);
                                      
                                      // Get requirements data if available
                                      const requirements = result.requirements?.percentiles || [];
                                      const requirementValues = requirements.map(req => ({
                                        percentile: req.percentile,
                                        value: req.value
                                      })).sort((a, b) => a.percentile - b.percentile);
                                      
                                      // Calculate scale including both actual and requirement values
                                      const allValues = [
                                        ...percentiles.map(p => p.value),
                                        ...requirementValues.map(r => r.value)
                                      ];
                                      const maxValue = Math.max(...allValues);
                                      const minValue = Math.min(...allValues);
                                      const valueRange = maxValue - minValue || 1;
                                      
                                      const actualPoints = percentiles.map((p, i) => {
                                        const x = (i / (percentiles.length - 1)) * 260 + 40;
                                        const y = 100 - ((p.value - minValue) / valueRange) * 80 + 10;
                                        return `${x},${y}`;
                                      }).join(' ');
                                      
                                      // Create requirement points if available
                                      const requirementPoints = requirementValues.length > 0 ? 
                                        requirementValues.map((r, i) => {
                                          const x = (i / (requirementValues.length - 1)) * 260 + 40;
                                          const y = 100 - ((r.value - minValue) / valueRange) * 80 + 10;
                                          return `${x},${y}`;
                                        }).join(' ') : '';
                                      
                                      return (
                                        <>
                                          {/* Actual performance line */}
                                          <polyline
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            points={actualPoints}
                                          />
                                          
                                          {/* Requirements line */}
                                          {requirementPoints && (
                                            <polyline
                                              fill="none"
                                              stroke="#ef4444"
                                              strokeWidth="2"
                                              strokeDasharray="4,2"
                                              points={requirementPoints}
                                            />
                                          )}
                                          
                                          {/* Actual performance points */}
                                          {percentiles.map((p, i) => {
                                            const x = (i / (percentiles.length - 1)) * 260 + 40;
                                            const y = 100 - ((p.value - minValue) / valueRange) * 80 + 10;
                                            return (
                                              <g key={`actual-${p.percentile}`}>
                                                <circle
                                                  cx={x}
                                                  cy={y}
                                                  r="3"
                                                  fill="#3b82f6"
                                                  stroke="#1e293b"
                                                  strokeWidth="1"
                                                />
                                                {/* Percentile labels */}
                                                <text
                                                  x={x}
                                                  y="125"
                                                  textAnchor="middle"
                                                  className="text-xs fill-slate-400"
                                                  fontSize="9"
                                                >
                                                  {p.percentile === 100 ? '100' : p.percentile}
                                                </text>
                                                {/* Value labels on hover */}
                                                <title>{`${p.percentile}th percentile: ${p.value}ms (actual)`}</title>
                                              </g>
                                            );
                                          })}
                                          
                                          {/* Requirement points */}
                                          {requirementValues.map((r, i) => {
                                            const x = (i / (requirementValues.length - 1)) * 260 + 40;
                                            const y = 100 - ((r.value - minValue) / valueRange) * 80 + 10;
                                            return (
                                              <g key={`req-${r.percentile}`}>
                                                <circle
                                                  cx={x}
                                                  cy={y}
                                                  r="2"
                                                  fill="#ef4444"
                                                  stroke="#1e293b"
                                                  strokeWidth="1"
                                                />
                                                {/* Value labels on hover */}
                                                <title>{`${r.percentile}th percentile: ${r.value}ms (requirement)`}</title>
                                              </g>
                                            );
                                          })}
                                          
                                          {/* Y-axis labels */}
                                          <text x="5" y="15" className="text-xs fill-slate-400" fontSize="8">{maxValue}</text>
                                          <text x="5" y="105" className="text-xs fill-slate-400" fontSize="8">{minValue}</text>
                                        </>
                                      );
                                    })()}
                                    </svg>
                                  </div>
                                  
                                  {/* Legend */}
                                  <div className="flex items-center justify-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                      <div className="w-3 h-0.5 bg-blue-500"></div>
                                      <span className="text-slate-400">Actual</span>
                                    </div>
                                    {result.requirements?.percentiles && result.requirements.percentiles.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <div className="w-3 h-0.5 bg-red-500" style={{backgroundImage: 'repeating-linear-gradient(to right, #ef4444 0, #ef4444 2px, transparent 2px, transparent 4px)'}}></div>
                                        <span className="text-slate-400">Requirements</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Requirements (if available) */}
                          {result.requirements && (
                            <div className="bg-slate-800/50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-slate-300 mb-2">Requirements</h5>
                              <div className="space-y-2 text-sm">
                                <div><span className="text-slate-400">Status:</span> <StatusBadge status={result.requirements.status} /></div>
                                <div><span className="text-slate-400">Passed:</span> <span className="text-green-400">{result.requirements.passed}</span></div>
                                <div><span className="text-slate-400">Failed:</span> <span className="text-red-400">{result.requirements.failed}</span></div>
                                
                                {result.requirements.percentiles && result.requirements.percentiles.length > 0 && (
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
                        </div>

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
                )}
              </React.Fragment>
            );
          })}
        </tbody>
        </table>
        
        {filteredAndSortedResults.length === 0 && requestResults.length > 0 && (
          <div className="text-center py-8 text-slate-400">
            No requests match the selected filters
          </div>
        )}
        
        {requestResults.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No request data available
          </div>
        )}
      </div>
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
