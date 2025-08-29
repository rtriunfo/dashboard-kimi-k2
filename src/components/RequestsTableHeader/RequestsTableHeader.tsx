import React from 'react';
import { TestResults } from '../../types';
import { SortableHeader as HeaderCell } from '@components/SortableHeader';

type SortColumn = 'name' | 'status' | 'severity' | 'min' | 'max' | 'totalCount' | 'errorPercentage' | string;
type SortDirection = 'asc' | 'desc';

interface RequestsTableHeaderProps {
  testData: TestResults;
  availablePercentiles: string[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

export const RequestsTableHeader: React.FC<RequestsTableHeaderProps> = ({
  testData,
  availablePercentiles,
  sortColumn,
  sortDirection,
  onSort,
}) => {
  return (
    <thead>
      <tr className="border-b border-gray-200 dark:border-slate-700">
        <HeaderCell 
          column="name" 
          className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white" 
          sortColumn={sortColumn} 
          sortDirection={sortDirection} 
          onSort={onSort}
        >
          Name
        </HeaderCell>
        {testData.testRequirements && (
          <HeaderCell 
            column="status" 
            sortColumn={sortColumn} 
            sortDirection={sortDirection} 
            onSort={onSort}
          >
            Status
          </HeaderCell>
        )}
        {testData.severityVersion && (
          <HeaderCell 
            column="severity" 
            sortColumn={sortColumn} 
            sortDirection={sortDirection} 
            onSort={onSort}
          >
            Severity
          </HeaderCell>
        )}
        <HeaderCell 
          column="min" 
          sortColumn={sortColumn} 
          sortDirection={sortDirection} 
          onSort={onSort}
        >
          Min
        </HeaderCell>
        {availablePercentiles.map(percentile => (
          <HeaderCell 
            key={percentile} 
            column={percentile} 
            sortColumn={sortColumn} 
            sortDirection={sortDirection} 
            onSort={onSort}
          >
            {parseFloat(percentile) === 100 ? '100' : `${parseFloat(percentile)}`}
          </HeaderCell>
        ))}
        <HeaderCell 
          column="max" 
          sortColumn={sortColumn} 
          sortDirection={sortDirection} 
          onSort={onSort}
        >
          Max
        </HeaderCell>
        <HeaderCell 
          column="totalCount" 
          sortColumn={sortColumn} 
          sortDirection={sortDirection} 
          onSort={onSort}
        >
          Count
        </HeaderCell>
        <HeaderCell 
          column="errorPercentage" 
          sortColumn={sortColumn} 
          sortDirection={sortDirection} 
          onSort={onSort}
        >
          Errors
        </HeaderCell>
      </tr>
    </thead>
  );
};
