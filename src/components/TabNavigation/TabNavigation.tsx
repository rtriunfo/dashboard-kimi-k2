import React from 'react';

export type TabType = 'summary' | 'metadata' | 'responseTimes' | 'requests';

export interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'summary' as const, label: 'Summary' },
    { id: 'responseTimes' as const, label: 'Response Times' },
    { id: 'metadata' as const, label: 'Metadata' },
    { id: 'requests' as const, label: 'Requests' },
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-slate-700">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
