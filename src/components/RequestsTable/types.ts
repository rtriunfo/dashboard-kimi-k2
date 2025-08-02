import { RequestResult, TestResults } from '../../types';

export interface StatusFilterDropdownProps {
  selectedStatuses: Set<string>;
  availableStatuses: string[];
  requestResults: RequestResult[];
  onStatusToggle: (status: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface SortableHeaderProps {
  column: string;
  children: React.ReactNode;
  className?: string;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export type SortDirection = 'asc' | 'desc';
export type SortColumn = string;

export interface FilterControlsProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  children: React.ReactNode;
}
