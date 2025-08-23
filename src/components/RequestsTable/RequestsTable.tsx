import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TestResults, RequestResult } from '../../types';
import { RequestsTableFilters } from '../RequestsTableFilters';
import { RequestTableRow } from '../RequestTableRow';
import { RequestsTableHeader } from '../RequestsTableHeader';
import { RequestsTableContainer } from '../RequestsTableContainer';

export interface RequestsTableProps {
  testData: TestResults;
}

type SortColumn = 'name' | 'status' | 'severity' | 'min' | 'max' | 'totalCount' | 'errorPercentage' | string;
type SortDirection = 'asc' | 'desc';

const RequestsTable: React.FC<RequestsTableProps> = ({ testData }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

  const [selectedSeverities, setSelectedSeverities] = useState<Set<string>>(new Set());
  const [numericField, setNumericField] = useState<string>('');
  const [numericOperator, setNumericOperator] = useState<'gt' | 'lt'>('gt');
  const [numericValue, setNumericValue] = useState<string>('');
  const [isNumericDropdownOpen, setIsNumericDropdownOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
  // Ref for dropdown to handle click outside
  const numericDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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


  return (
    <div className="space-y-4">
      <RequestsTableFilters
        testData={testData}
        availableStatuses={availableStatuses}
        availableSeverities={availableSeverities}
        numericFields={numericFields}
        selectedStatuses={selectedStatuses}
        selectedSeverities={selectedSeverities}
        numericField={numericField}
        numericOperator={numericOperator}
        numericValue={numericValue}
        isNumericDropdownOpen={isNumericDropdownOpen}
        isAllExpanded={isAllExpanded}
        numericDropdownRef={numericDropdownRef}
        requestResults={requestResults}
        onStatusToggle={handleStatusToggle}
        onSeverityToggle={handleSeverityToggle}
        setNumericField={setNumericField}
        setNumericOperator={setNumericOperator}
        setNumericValue={setNumericValue}
        setIsNumericDropdownOpen={setIsNumericDropdownOpen}
        toggleExpandAll={toggleExpandAll}
        clearFilters={clearFilters}
      />

      <RequestsTableContainer
        testData={testData}
        requestResults={requestResults}
        filteredAndSortedResults={filteredAndSortedResults}
      >
        <RequestsTableHeader
          testData={testData}
          availablePercentiles={availablePercentiles}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <tbody>
          {filteredAndSortedResults.map((result, index) => (
            <RequestTableRow
              key={result.id || index}
              result={result}
              index={index}
              testData={testData}
              availablePercentiles={availablePercentiles}
              isExpanded={expandedRows.has(result.id || index)}
              onToggleExpansion={toggleRowExpansion}
              formatResponseTime={formatResponseTime}
            />
          ))}
        </tbody>
      </RequestsTableContainer>
    </div>
  );
};

export default RequestsTable;
