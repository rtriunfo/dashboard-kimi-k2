import React from 'react';
import { XCircle } from 'lucide-react';
import StatusFilterDropdown from '@/components/StatusFilterDropdown';
import SeverityFilterDropdown from '@/components/SeverityFilterDropdown';
import NumericFilterDropdown from '@/components/NumericFilterDropdown';
import { TestResults, RequestResult } from '../../types';

interface RequestsTableFiltersProps {
  testData: TestResults;
  availableStatuses: string[];
  availableSeverities: string[];
  numericFields: Array<{ key: string; label: string }>;
  selectedStatuses: Set<string>;
  selectedSeverities: Set<string>;
  numericField: string;
  numericOperator: 'gt' | 'lt';
  numericValue: string;
  isNumericDropdownOpen: boolean;
  isAllExpanded: boolean;
  numericDropdownRef: React.RefObject<HTMLDivElement>;
  requestResults: RequestResult[];
  onStatusToggle: (status: string) => void;
  onSeverityToggle: (severity: string) => void;
  setNumericField: (field: string) => void;
  setNumericOperator: (operator: 'gt' | 'lt') => void;
  setNumericValue: (value: string) => void;
  setIsNumericDropdownOpen: (isOpen: boolean) => void;
  toggleExpandAll: () => void;
  clearFilters: () => void;
}

export const RequestsTableFilters: React.FC<RequestsTableFiltersProps> = ({
  testData,
  availableStatuses,
  availableSeverities,
  numericFields,
  selectedStatuses,
  selectedSeverities,
  numericField,
  numericOperator,
  numericValue,
  isNumericDropdownOpen,
  isAllExpanded,
  numericDropdownRef,
  requestResults,
  onStatusToggle,
  onSeverityToggle,
  setNumericField,
  setNumericOperator,
  setNumericValue,
  setIsNumericDropdownOpen,
  toggleExpandAll,
  clearFilters,
}) => {
  const hasActiveFilters = selectedStatuses.size > 0 || selectedSeverities.size > 0 || Boolean(numericField && numericValue);

  return (
    <>
      {((testData.testRequirements && availableStatuses.length > 0) || (testData.severityVersion && availableSeverities.length > 0) || numericFields.length > 0) && (
        <div className="flex justify-start gap-3 flex-wrap items-start">
          {/* Status Filter Dropdown */}
          {testData.testRequirements && availableStatuses.length > 0 && (
            <StatusFilterDropdown
              selectedStatuses={selectedStatuses}
              availableStatuses={availableStatuses}
              requestResults={requestResults}
              onStatusToggle={onStatusToggle}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {/* Severity Filter Dropdown */}
          {testData.severityVersion && availableSeverities.length > 0 && (
            <SeverityFilterDropdown
              selectedSeverities={selectedSeverities}
              availableSeverities={availableSeverities}
              requestResults={requestResults}
              onSeverityToggle={onSeverityToggle}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {/* Numeric Filter Dropdown */}
          {numericFields.length > 0 && (
            <NumericFilterDropdown
              numericFields={numericFields}
              numericField={numericField}
              setNumericField={setNumericField}
              numericOperator={numericOperator}
              setNumericOperator={setNumericOperator}
              numericValue={numericValue}
              setNumericValue={setNumericValue}
              isOpen={isNumericDropdownOpen}
              setIsOpen={setIsNumericDropdownOpen}
              dropdownRef={numericDropdownRef}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
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
            
            {hasActiveFilters && (
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
    </>
  );
};
