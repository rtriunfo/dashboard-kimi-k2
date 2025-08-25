import React from 'react';

export type SortColumn = 'name' | 'status' | 'severity' | 'min' | 'max' | 'totalCount' | 'errorPercentage' | string;
export type SortDirection = 'asc' | 'desc';

interface SortableHeaderProps {
  column: SortColumn;
  children: React.ReactNode;
  className?: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

/**
 * A sortable table header component that displays sort indicators and handles click events
 */
export const SortableHeader: React.FC<SortableHeaderProps> = ({ 
  column, 
  children, 
  className = "px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white",
  sortColumn,
  sortDirection,
  onSort
}) => (
  <th 
    className={`${className} cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/30 transition-colors select-none`}
    onClick={() => onSort(column)}
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
