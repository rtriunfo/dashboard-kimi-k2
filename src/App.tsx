import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Zap, GitBranch, Calendar, Timer, BarChart3, Percent, Info, FileText, GitCommit, Settings, XCircle } from 'lucide-react';
import { TestResults } from './types';
import MetricCard from './components/MetricCard';
import ResponseTimeChart from './components/ResponseTimeChart';
import ResponseTimesDetailChart from './components/ResponseTimesDetailChart';
import StatusBadge from './components/StatusBadge';
import RequestStats from './components/RequestStats';
import AssertionStats from './components/AssertionStats';
import SeverityStats from './components/SeverityStats';
import CompactMetricCard from './components/CompactMetricCard';
import ResponseTimesOverview from './components/ResponseTimesOverview';
import { getTestScenario, getAvailableScenarios, TestScenario } from './config/testReportAdapter';
import RequestsTable from './components/RequestsTable';
import TabNavigation, { TabType } from './components/TabNavigation';
import ScenarioSelector from './components/ScenarioSelector';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedScenario, setSelectedScenario] = useState<string>('test-report-data');
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<TestScenario | null>(null);
  const [availableScenarios, setAvailableScenarios] = useState<TestScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScenarios = async () => {
      console.log('🔍 [App] Starting to load scenarios...');
      console.log('🔍 [App] Selected scenario ID:', selectedScenario);
      
      setIsLoading(true);
      try {
        console.log('🔍 [App] Fetching available scenarios...');
        const scenarios = await getAvailableScenarios();
        console.log('✅ [App] Available scenarios:', scenarios.map(s => ({
          id: s.id,
          name: s.name,
          hasData: !!s.data
        })));
        
        setAvailableScenarios(scenarios);
        
        if (scenarios.length === 0) {
          console.warn('⚠️ [App] No scenarios found!');
          return;
        }
        
        console.log(`🔍 [App] Loading scenario with ID: ${selectedScenario}`);
        const scenario = await getTestScenario(selectedScenario);
        console.log('✅ [App] Loaded scenario:', {
          id: scenario?.id,
          name: scenario?.name,
          hasData: !!scenario?.data,
          dataKeys: scenario?.data ? Object.keys(scenario.data) : 'no data'
        });
        
        if (!scenario) {
          console.error('❌ [App] Failed to load scenario:', selectedScenario);
          return;
        }
        
        setCurrentScenario(scenario);
        console.log('✅ [App] Scenario state updated in component');
      } catch (error) {
        console.error('❌ [App] Failed to load scenarios:', error);
      } finally {
        console.log('🔍 [App] Finished loading scenarios');
        setIsLoading(false);
      }
    };
    
    loadScenarios().catch(error => {
      console.error('❌ [App] Unhandled error in loadScenarios:', error);
    });
  }, [selectedScenario]);

  const testData = currentScenario?.data;

  // Debug: Log when testData changes
  useEffect(() => {
    if (testData) {
      console.log('🔄 Header cards re-rendering with scenario:', selectedScenario);
      console.log('📊 Current data metrics:', {
        totalRequests: testData.totalRequests,
        duration: testData.duration,
        errorRate: testData.errorRate,
        rate: testData.rate,
        severityMinor: testData.severityStats?.minor
      });
    }
  }, [testData, selectedScenario]);


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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show loading state
  if (isLoading || !testData) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header with compact metrics */}
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
                  onScenarioChange={setSelectedScenario}
                  onToggleDropdown={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                  onCloseDropdown={() => setIsScenarioDropdownOpen(false)}
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

        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          {activeTab === 'summary' ? (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">Test Summary</h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ResponseTimeChart responseTimes={testData.responseTimes} />
                <RequestStats stats={testData.requestStats} />
                <AssertionStats stats={testData.assertionStats} />
                <SeverityStats stats={testData.severityStats} />
              </div>
            </div>
          ) : activeTab === 'responseTimes' ? (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">Response Times Analysis</h2>
              <div className="grid grid-cols-1 gap-6">
                <ResponseTimesDetailChart responseTimes={testData.responseTimes} />
                <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Response Time Metrics
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-slate-700/50">
                      <div className="text-3xl font-bold text-white">{testData.responseTimes.min}<span className="ml-1 text-sm">ms</span></div>
                      <div className="mt-1 text-sm text-slate-400">Minimum</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-700/50">
                      <div className="text-3xl font-bold text-white">{testData.responseTimes.percentiles["50.0"]}<span className="ml-1 text-sm">ms</span></div>
                      <div className="mt-1 text-sm text-slate-400">Median (P50)</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-700/50">
                      <div className="text-3xl font-bold text-white">{testData.responseTimes.max}<span className="ml-1 text-sm">ms</span></div>
                      <div className="mt-1 text-sm text-slate-400">Maximum</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-medium text-slate-300">Performance Insights</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>50% of requests complete in {testData.responseTimes.percentiles["50.0"]}ms or less</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>90% of requests complete in {testData.responseTimes.percentiles["90.0"]}ms or less</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>The slowest 1% of requests take more than {testData.responseTimes.percentiles["99.0"]}ms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'requests' ? (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">Request Results</h2>
              <RequestsTable testData={testData} />
            </div>
          ) : (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">Test Metadata</h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Test Information */}
                <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Info className="w-5 h-5 text-blue-400" />
                    Test Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Test Type:</span>
                      <span className="font-medium text-white">{testData.test.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Simulation:</span>
                      <span className="text-sm font-medium text-white">{testData.test.simulationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Environment:</span>
                      <span className="font-medium text-white">{testData.environment || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Branch:</span>
                      <span className="font-medium text-white">{testData.branch || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Version Information */}
                <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <GitCommit className="w-5 h-5 text-green-400" />
                    Version Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gatling Version:</span>
                      <span className="font-medium text-white">{testData.gatlingVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Parser Version:</span>
                      <span className="font-medium text-white">{testData.parserVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Severity Version:</span>
                      <span className="font-medium text-white">{testData.severityVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requirements Version:</span>
                      <span className="font-medium text-white">{testData.requirementsVersion}</span>
                    </div>
                  </div>
                </div>

                {/* File Locations */}
                <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700 lg:col-span-2">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <FileText className="w-5 h-5 text-purple-400" />
                    File Locations
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-slate-400">Gatling Report:</span>
                      <p className="mt-1 font-mono text-sm text-white break-all">{testData.gatlingReportLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">Gatling Log:</span>
                      <p className="mt-1 font-mono text-sm text-white break-all">{testData.gatlingLogLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">Requirements File:</span>
                      <p className="mt-1 font-mono text-sm text-white break-all">{testData.requirementsFileLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Git Information */}
                <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <GitBranch className="w-5 h-5 text-orange-400" />
                    Git Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Git Hash:</span>
                      <span className="font-mono text-sm font-medium text-white">
                        {testData.gitHash ? testData.gitHash.substring(0, 8) : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Test Requirements:</span>
                      <span className={`font-medium ${testData.testRequirements ? 'text-green-400' : 'text-red-400'}`}>
                        {testData.testRequirements ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Test Configuration */}
                <div className="p-6 border bg-slate-800/50 backdrop-blur-sm rounded-xl border-slate-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Test Configuration
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rate Granularity:</span>
                      <span className="font-medium text-white">{testData.rateGranularity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Created:</span>
                      <span className="font-medium text-white">
                        <div>{formatDate(testData.createdTime).timeStr}</div>
                        <div className="text-sm text-slate-400">{formatDate(testData.createdTime).dateStr}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Generated By Perf Report 0.0.1 • Test Executed By Gatling {testData.gatlingVersion} • Parser {testData.parserVersion}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
