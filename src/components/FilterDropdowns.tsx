import React, { useRef, useEffect } from 'react';
import { TestResults, RequestResult } from '../types';

interface FilterDropdownsProps {
  testData: TestResults;
  requestResults: RequestResult[];
  availableStatuses: string[];
  availableSeverities: string[];
  numericFields: Array<{ key: string; label: string }>;
  
  // Status filter state
  selectedStatuses: Set<string>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  handleStatusToggle: (status: string) => void;
  
  // Severity filter state
  selectedSeverities: Set<string>;
  isSeverityDropdownOpen: boolean;
  setIsSeverityDropdownOpen: (open: boolean) => void;
  handleSeverityToggle: (severity: string) => void;
  
  // Numeric filter state
  numericField: string;
  numericOperator: 'gt' | 'lt';
  numericValue: string;
  isNumericDropdownOpen: boolean;
  setNumericField: (field: string) => void;
  setNumericOperator: (operator: 'gt' | 'lt') => void;
  setNumericValue: (value: string) => void;
  setIsNumericDropdownOpen: (open: boolean) => void;
  
  // Expand/collapse state
  isAllExpanded: boolean;
  toggleExpandAll: () => void;
  
  // Common actions
  clearFilters: () => void;
}

/**
 * Filter dropdowns component for the RequestsTable
 * Handles status, severity, and numeric filtering with expand/collapse controls
 */
export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  testData,
  requestResults,
  availableStatuses,
  availableSeverities,
  numericFields,
  selectedStatuses,
  isDropdownOpen,
  setIsDropdownOpen,
  handleStatusToggle,
  selectedSeverities,
  isSeverityDropdownOpen,
  setIsSeverityDropdownOpen,
  handleSeverityToggle,
  numericField,
  numericOperator,
  numericValue,
  isNumericDropdownOpen,
  setNumericField,
  setNumericOperator,
  setNumericValue,
  setIsNumericDropdownOpen,
  isAllExpanded,
  toggleExpandAll,
  clearFilters,
}) => {
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
  }, [setIsDropdownOpen, setIsSeverityDropdownOpen, setIsNumericDropdownOpen]);

  const hasActiveFilters = selectedStatuses.size > 0 || selectedSeverities.size > 0 || (numericField && numericValue);

  return (
    <div className="flex justify-start gap-3 flex-wrap items-start">
      {/* Status Filter Dropdown */}
      {testData.testRequirements && availableStatuses.length > 0 && (
        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-sm text-white hover:bg-slate-700/50 transition-colors"
          >
            Status
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
                {hasActiveFilters && (
                  <button
                    type="button"
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
        <div className="relative" ref={severityDropdownRef}>
          <button
            type="button"
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
                {hasActiveFilters && (
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
            type="button"
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
                {hasActiveFilters && (
                  <button
                    type="button"
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
                        {field.key === 'responseTime.min' ? 'Min RT' : field.key === 'responseTime.max' ? 'Max RT' : field.label}
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

      {/* Expand/Collapse Controls */}
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={toggleExpandAll}
          className={`flex items-center gap-2 px-4 py-2 text-sm ${
            isAllExpanded ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800/50 border-slate-700'
          } text-white rounded-lg border hover:bg-slate-700/50 transition-colors backdrop-blur-sm`}
        >
          {isAllExpanded ? (
            <>
              Collapse All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Expand All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors backdrop-blur-sm"
          >
            <span>Clear all filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
