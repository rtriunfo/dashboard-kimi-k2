import React, { useState, useRef, useEffect } from 'react';
import { RequestResult } from '../../types';

export interface StatusFilterDropdownProps {
  selectedStatuses: Set<string>;
  availableStatuses: string[];
  requestResults: RequestResult[];
  onStatusToggle: (status: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const StatusFilterDropdown: React.FC<StatusFilterDropdownProps> = ({
  selectedStatuses,
  availableStatuses,
  requestResults,
  onStatusToggle,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle status toggle
  const handleStatusToggle = (status: string) => {
    onStatusToggle(status);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors shadow-sm"
          id="status-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <span>Status</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {selectedStatuses.size}
            </span>
          )}
          <span className="text-xs">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg min-w-48 max-h-64 overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="status-menu"
        >
          <div className="p-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full text-left px-3 py-2 text-xs text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors mb-1"
              >
                Clear all filters
              </button>
            )}
            {availableStatuses.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.has(status)}
                  onChange={() => handleStatusToggle(status)}
                  className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-900 dark:text-white flex-1">{status}</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  {requestResults.filter(r => r.status === status).length}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilterDropdown;
