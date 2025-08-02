import { RequestResult } from '../../../../../types';

export interface StatusFilterDropdownProps {
  selectedStatuses: Set<string>;
  availableStatuses: string[];
  requestResults: RequestResult[];
  onStatusToggle: (status: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}
