import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
}

export interface ScenarioSelectorProps {
  selectedScenario: string;
  currentScenario: TestScenario | null;
  availableScenarios: TestScenario[];
  isLoading: boolean;
  isDropdownOpen: boolean;
  onScenarioChange: (scenarioId: string) => void;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  currentScenario,
  availableScenarios,
  isLoading,
  isDropdownOpen,
  onScenarioChange,
  onToggleDropdown,
  onCloseDropdown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onCloseDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCloseDropdown]);

  const handleScenarioSelect = (scenarioId: string, scenarioName: string) => {
    console.log('Selecting scenario:', scenarioId, scenarioName);
    onScenarioChange(scenarioId);
    onCloseDropdown();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggleDropdown}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-white transition-colors border rounded-lg bg-white/80 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600/50 disabled:opacity-50"
      >
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>{currentScenario?.name || 'Select Scenario'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
      
      {!isLoading && isDropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 overflow-hidden border rounded-lg shadow-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 min-w-64">
          {availableScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario.id, scenario.name)}
              className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${
                selectedScenario === scenario.id 
                  ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-700 dark:text-white'
              }`}
            >
              <div className="font-medium">{scenario.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{scenario.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;
