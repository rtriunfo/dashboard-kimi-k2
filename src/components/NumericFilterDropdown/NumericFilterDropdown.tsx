import React, { useId } from 'react';

export interface NumericFieldDef {
  key: string;
  label: string;
}

export interface NumericFilterDropdownProps {
  numericFields: NumericFieldDef[];
  numericField: string;
  setNumericField: (value: string) => void;
  numericOperator: 'gt' | 'lt';
  setNumericOperator: (op: 'gt' | 'lt') => void;
  numericValue: string;
  setNumericValue: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const NumericFilterDropdown: React.FC<NumericFilterDropdownProps> = ({
  numericFields,
  numericField,
  setNumericField,
  numericOperator,
  setNumericOperator,
  numericValue,
  setNumericValue,
  isOpen,
  setIsOpen,
  dropdownRef,
  hasActiveFilters,
  onClearFilters,
}) => {
  const id = useId();
  const fieldId = `${id}-field`;
  const operatorId = `${id}-operator`;
  const valueId = `${id}-value`;
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-sm text-white hover:bg-slate-700/50 transition-colors"
      >
        <span>Numeric Filter</span>
        {numericField && numericValue && (
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">1</span>
        )}
        <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-w-64 max-h-64 overflow-y-auto">
          <div className="p-3 space-y-3">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                Clear all filters
              </button>
            )}

            <div>
              <label htmlFor={fieldId} className="block text-xs text-slate-400 mb-1">Field</label>
              <select
                id={fieldId}
                value={numericField}
                onChange={(e) => setNumericField(e.target.value)}
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select field...</option>
                {numericFields.map((field) => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={operatorId} className="block text-xs text-slate-400 mb-1">Operator</label>
              <select
                id={operatorId}
                value={numericOperator}
                onChange={(e) => setNumericOperator(e.target.value as 'gt' | 'lt')}
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:ring-green-500 focus:border-green-500"
              >
                <option value="gt">Greater than</option>
                <option value="lt">Less than</option>
              </select>
            </div>

            <div>
              <label htmlFor={valueId} className="block text-xs text-slate-400 mb-1">Value</label>
              <input
                id={valueId}
                type="number"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                placeholder="Enter number..."
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {numericField && numericValue && (
              <div className="text-xs text-slate-400 bg-slate-700/50 p-2 rounded">
                Showing requests where <span className="text-white">{numericFields.find((f) => f.key === numericField)?.label}</span> is{' '}
                <span className="text-white">{numericOperator === 'gt' ? 'greater than' : 'less than'}</span>{' '}
                <span className="text-white">{numericValue}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NumericFilterDropdown;
