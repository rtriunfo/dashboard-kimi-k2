import React, { useState, useRef, useEffect } from 'react';
import { RequestResult } from '../../types';

export interface SeverityFilterDropdownProps {
  selectedSeverities: Set<string>;
  availableSeverities: string[];
  requestResults: RequestResult[];
  onSeverityToggle: (severity: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const SeverityFilterDropdown: React.FC<SeverityFilterDropdownProps> = ({
  selectedSeverities,
  availableSeverities,
  requestResults,
  onSeverityToggle,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleToggle = (severity: string) => onSeverityToggle(severity);

  const handleClear = () => onClearFilters();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors shadow-sm"
          id="severity-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <span>Severity</span>
          {hasActiveFilters && (
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {selectedSeverities.size}
            </span>
          )}
          <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg min-w-48 max-h-64 overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="severity-menu"
        >
          <div className="p-2">
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="w-full text-left px-3 py-2 text-xs text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors mb-1"
              >
                Clear all filters
              </button>
            )}
            {availableSeverities.map((severity) => (
              <label
                key={severity}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSeverities.has(severity)}
                  onChange={() => handleToggle(severity)}
                  className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-900 dark:text-white flex-1">{severity}</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  {requestResults.filter((r) => r.severity === severity).length}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeverityFilterDropdown;
