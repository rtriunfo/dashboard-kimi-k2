import React from 'react';
import { Activity, Zap, Calendar, Timer, Percent, TrendingUp } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import CompactMetricCard from '../CompactMetricCard';
import ResponseTimesOverview from '../ResponseTimesOverview';
import ScenarioSelector from '../ScenarioSelector';
import { TestResults } from '../../types';
import { TestScenario } from '../../config/testReportAdapter';

export interface DashboardHeaderProps {
  testData: TestResults;
  selectedScenario: string;
  currentScenario: TestScenario | null;
  availableScenarios: TestScenario[];
  isLoading: boolean;
  isScenarioDropdownOpen: boolean;
  onScenarioChange: (scenario: string) => void;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  testData,
  selectedScenario,
  currentScenario,
  availableScenarios,
  isLoading,
  isScenarioDropdownOpen,
  onScenarioChange,
  onToggleDropdown,
  onCloseDropdown,
}) => {
  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400); // 86400 seconds in a day
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const timeStr = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Format date as "Wed 23 Feb 2022" without commas
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.toLocaleDateString('en-US', { year: 'numeric' });
    const dateStr = `${weekday} ${day} ${month} ${year}`;
    
    return { timeStr, dateStr };
  };

  return (
    <header className="relative z-20 border-b bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-white">
              Performance Report
            </h1>
            <p className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4" />
              {testData.test.description}
              <span className="px-2 py-1 ml-2 text-xs rounded bg-slate-700 text-slate-300">
                Scenario: {selectedScenario}
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Scenario Selector */}
            <ScenarioSelector
              selectedScenario={selectedScenario}
              currentScenario={currentScenario}
              availableScenarios={availableScenarios}
              isLoading={isLoading}
              isDropdownOpen={isScenarioDropdownOpen}
              onScenarioChange={onScenarioChange}
              onToggleDropdown={onToggleDropdown}
              onCloseDropdown={onCloseDropdown}
            />
            
            <StatusBadge status={testData.status} size="lg" showIcon={true} />
          </div>
        </div>
        
        {/* Compact metric cards */}
        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 lg:grid-cols-5">
          <CompactMetricCard
            icon={Calendar}
            label="Start Time"
            value={(
              <div className="flex items-center gap-2">
                <span>{formatDate(testData.startTime).timeStr}</span>
                <span className="text-xs text-slate-400">{formatDate(testData.startTime).dateStr}</span>
              </div>
            )}
            color="text-blue-400"
          />
          <CompactMetricCard
            icon={Timer}
            label="Duration"
            value={formatDuration(testData.duration)}
            color="text-green-400"
          />
          <CompactMetricCard
            icon={Zap}
            label="Total Requests"
            value={testData.totalRequests.toLocaleString()}
            color="text-purple-400"
          />
          <CompactMetricCard
            icon={TrendingUp}
            label="Requests/Min"
            value={Math.round(testData.rate).toLocaleString()}
            color="text-cyan-400"
          />
          <CompactMetricCard
            icon={Percent}
            label="Error Rate"
            value={`${(testData.errorRate * 100).toFixed(2)}%`}
            color="text-red-400"
          />
        </div>
        
        {/* Response Times Overview */}
        <ResponseTimesOverview responseTimes={testData.responseTimes} />
      </div>
    </header>
  );
};

export default DashboardHeader;
