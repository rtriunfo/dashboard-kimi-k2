import React, { useState, useRef, useEffect } from 'react';
import { RequestResult } from '../../../../../types';
import { StatusFilterDropdownProps } from './types';

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

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-sm text-white hover:bg-slate-700/50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Filter by status"
      >
        <span>Status</span>
        {selectedStatuses.size > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            {selectedStatuses.size}
          </span>
        )}
        <span className="text-xs" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-w-48 max-h-64 overflow-y-auto"
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="p-2">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onClearFilters();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors mb-1"
                aria-label="Clear all filters"
              >
                Clear all filters
              </button>
            )}
            {availableStatuses.map((status: string) => (
              <label
                key={status}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.has(status)}
                  onChange={() => onStatusToggle(status)}
                  className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  aria-label={`Filter by ${status} status`}
                />
                <span className="text-sm text-white flex-1">{status}</span>
                <span className="text-xs text-slate-400">
                  {requestResults.filter((r: RequestResult) => r.status === status).length}
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
