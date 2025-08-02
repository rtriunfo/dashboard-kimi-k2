import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { TestResults, RequestResult } from '../types';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { XCircle } from 'lucide-react';
import LineGraph from './LineGraph';
import StatusFilterDropdown from "@/components/StatusFilterDropdown";

interface RequestsTableProps {
  testData: TestResults;
}

type SortColumn = 'name' | 'status' | 'severity' | 'min' | 'max' | 'totalCount' | 'errorPercentage' | string;
type SortDirection = 'asc' | 'desc';

export const RequestsTable: React.FC<RequestsTableProps> = ({ testData }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

  const [selectedSeverities, setSelectedSeverities] = useState<Set<string>>(new Set());
  const [isSeverityDropdownOpen, setIsSeverityDropdownOpen] = useState(false);
  const [numericField, setNumericField] = useState<string>('');
  const [numericOperator, setNumericOperator] = useState<'gt' | 'lt'>('gt');
  const [numericValue, setNumericValue] = useState<string>('');
  const [isNumericDropdownOpen, setIsNumericDropdownOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
  // Refs for dropdowns to handle click outside
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const severityDropdownRef = useRef<HTMLDivElement>(null);
  const numericDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (severityDropdownRef.current && !severityDropdownRef.current.contains(event.target as Node)) {
        setIsSeverityDropdownOpen(false);
      }
      if (numericDropdownRef.current && !numericDropdownRef.current.contains(event.target as Node)) {
        setIsNumericDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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

    // Get available percentiles dynamically from the first result and exclude 100% if it equals MAX
    const availablePercentiles = useMemo(() => {
      if (!requestResults.length || !requestResults[0]?.responseTimes?.percentiles) {
        return [];
      }
      
      // Get all percentiles and sort them
      const allPercentiles = Object.keys(requestResults[0].responseTimes.percentiles)
        .sort((a, b) => parseFloat(a) - parseFloat(b));
      
      // Always exclude 100% percentile since MAX column already shows this value
      return allPercentiles.filter(p => p !== '100.0' && p !== '100');
      
    }, [requestResults]);

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
      try {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(resultId)) {
          newExpandedRows.delete(resultId);
        } else {
          newExpandedRows.add(resultId);
        }
        setExpandedRows(newExpandedRows);
        
        // Update the all-expanded state based on available rows with data
        const rowsWithData = filteredAndSortedResults.filter((result) => {
          return result.passCount || 
                 result.failCount || 
                 (result.requirements && (result.requirements.passed > 0 || result.requirements.failed > 0)) ||
                 (result.responseTimes?.percentiles && Object.keys(result.responseTimes.percentiles).length > 0);
        });
        
        if (newExpandedRows.size === 0) {
          setIsAllExpanded(false);
        } else if (newExpandedRows.size >= rowsWithData.length) {
          setIsAllExpanded(true);
        } else {
          setIsAllExpanded(false);
        }
      } catch (error) {
        console.error('Error toggling row expansion:', error);
        // Reset to safe state on error
        setExpandedRows(new Set());
        setIsAllExpanded(false);
      }
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

    const toggleExpandAll = () => {
      try {
        if (isAllExpanded) {
          // Collapse all rows
          setExpandedRows(new Set());
          setIsAllExpanded(false);
        } else {
          // Only expand rows that have data to display
          const rowsWithData: number[] = [];
          
          filteredAndSortedResults.forEach((result, index) => {
            const hasData = result.passCount || 
                           result.failCount || 
                           (result.requirements && (result.requirements.passed > 0 || result.requirements.failed > 0)) ||
                           (result.responseTimes?.percentiles && Object.keys(result.responseTimes.percentiles).length > 0);
            
            const rowId = result.id || index;
            
            if (hasData) {
              // Use the same ID logic as in the table rendering
              rowsWithData.push(rowId);
            }
          });
          
          if (rowsWithData.length > 0) {
            setExpandedRows(new Set(rowsWithData));
            setIsAllExpanded(true);
          } else {
            // No rows have data to expand
            setExpandedRows(new Set());
            setIsAllExpanded(false);
            console.warn('No rows have data available for expansion');
          }
        }
      } catch (error) {
        console.error('Error in toggleExpandAll:', error);
        // Reset to safe state on error
        setExpandedRows(new Set());
        setIsAllExpanded(false);
      }
    };

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
        <div className="flex justify-start gap-3 flex-wrap items-start">
          {/* Status Filter Dropdown */}
          {testData.testRequirements && availableStatuses.length > 0 && (
            <StatusFilterDropdown
              selectedStatuses={selectedStatuses}
              availableStatuses={availableStatuses}
              requestResults={requestResults}
              onStatusToggle={handleStatusToggle}
              onClearFilters={clearFilters}
              hasActiveFilters={selectedStatuses.size > 0 || selectedSeverities.size > 0 || Boolean(numericField && numericValue)}
            />
          )}

          {/* Severity Filter Dropdown */}
          {testData.severityVersion && availableSeverities.length > 0 && (
            <div className="relative" ref={severityDropdownRef}>
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
            <div className="relative" ref={numericDropdownRef}>
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
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleExpandAll}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                isAllExpanded ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800/50 border-slate-700'
              } text-white rounded-lg border hover:bg-slate-700/50 transition-colors backdrop-blur-sm`}
            >
              {isAllExpanded ? (
                <>
                  <span>Collapse All</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Expand All</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
            
            {(selectedStatuses.size > 0 || selectedSeverities.size > 0 || (numericField && numericValue)) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg border border-slate-700 transition-colors backdrop-blur-sm"
              >
                <XCircle className="w-3 h-3" />
                Clear all filters
              </button>
            )}
          </div>
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
                    {/* Only show accordion if there's data to display */}
                    {(result.passCount || result.failCount || (result.requirements && (result.requirements.passed > 0 || result.requirements.failed > 0))) ? (
                      <button
                        onClick={() => toggleRowExpansion(result.id || index)}
                        className="flex items-center gap-2 text-left hover:text-blue-400 transition-colors"
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
                          {/* Pass/Fail Chart - Only show if there's data */}
                          {(result.passCount || result.failCount) ? (
                            <div className="bg-slate-800/50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-slate-300 mb-2">Pass/Fail Distribution</h5>
                              <div className="text-sm">
                                {/* Pass/Fail Chart */}
                                <div>
                                  <div id={`pass-fail-chart-${result.id || index}`} className="w-full h-28" ref={el => {
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
                                <div><span className="text-slate-400">Total:</span> <span className="text-white">{(result.totalCount || 0).toLocaleString()}</span></div>
                                <div><span className="text-slate-400">Rate:</span> <span className="text-white">{Number(result.rate || 0).toFixed(2)} {result.rateGranularity}</span></div>
                              </div>
                            </div>
                          </div>
                          ) : null}

                          {/* Response Times */}
                          {result.responseTimes?.percentiles && (
                            <div className="bg-slate-800/50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-slate-300 mb-2">Response Times</h5>
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
                                        <div className="text-center py-4 text-slate-400 border border-slate-600 rounded">
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
                            <div className="bg-slate-800/50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-slate-300 mb-2">Requirements</h5>
                              <div className="text-sm">
                                {/* Requirements Chart */}
                                <div>
                                  <div id={`chart-${result.id || index}`} className="w-full h-28" ref={el => {
                                    if (el) {
                                      // Initialize chart with transparent background to match parent div
                                      const chart = echarts.init(el, null, {
                                        renderer: 'canvas'
                                      });
                                      
                                      // Set background color through setOption instead
                                      chart.setOption({
                                        backgroundColor: 'transparent'
                                      });
                                      
                                      // Calculate pass/fail ratio
                                      const passed = result.requirements.passed || 0;
                                      const failed = result.requirements.failed || 0;
                                      
                                      // Chart options
                                      const option = {
                                        tooltip: {
                                          trigger: 'item',
                                          formatter: '{b}: {c}'
                                        },
                                        legend: {
                                          bottom:18, //Reduce gap between chart and legend
                                          left: 'center',
                                          textStyle: {
                                            color: '#94a3b8',
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
                                              borderColor: '#0f172a'
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
};
