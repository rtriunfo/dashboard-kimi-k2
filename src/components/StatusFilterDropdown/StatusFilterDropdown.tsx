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
          className={`inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${hasActiveFilters ? 'ring-2 ring-indigo-500' : ''}`}
          id="status-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          Status ▼
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full bg-indigo-500 text-white text-xs">
              {selectedStatuses.size}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="status-menu"
        >
          <div className="py-1" role="none">
            {availableStatuses.map((status) => (
              <button
                key={status}
                className={`w-full text-left px-4 py-2 text-sm ${selectedStatuses.has(status) ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700'} hover:bg-gray-100`}
                role="menuitem"
                onClick={() => handleStatusToggle(status)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={selectedStatuses.has(status)}
                    onChange={() => {}}
                  />
                  <span className="ml-2">{status}</span>
                </div>
              </button>
            ))}
            {hasActiveFilters && (
              <div className="border-t border-gray-100">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                  onClick={handleClearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilterDropdown;
