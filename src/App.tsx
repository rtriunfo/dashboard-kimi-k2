import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Zap, GitBranch, Calendar, Timer, BarChart3, Percent, Info, FileText, GitCommit, Settings } from 'lucide-react';
import { TestResults } from './types';
import { MetricCard } from './components/MetricCard';
import { ResponseTimeChart } from './components/ResponseTimeChart';
import { StatusBadge } from './components/StatusBadge';
import { RequestStats } from './components/RequestStats';
import { AssertionStats } from './components/AssertionStats';
import { SeverityStats } from './components/SeverityStats';
import { CompactMetricCard } from './components/CompactMetricCard';

const testData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: "Peak Hour Load Test",
    type: "LOAD",
    simulationName: "underwriteme.teamA.simulation.loadtest"
  },
  status: "FAIL",
  startTime: "2022-04-01T13:36:40.447+00:00",
  duration: 4201,
  branch: null,
  gatlingVersion: "3.7.3",
  parserVersion: "3.6.1",
  environment: null,
  gitHash: null,
  totalRequests: 309623,
  errorRate: 0.013887857168233625,
  rate: 4422.132825517734,
  rateGranularity: "PER_MINUTE",
  responseTimes: {
    min: 3,
    max: 7977,
    percentiles: {
      "50.0": 30,
      "90.0": 582,
      "95.0": 783,
      "99.0": 1460,
      "99.9": 2690,
      "100.0": 7977
    }
  },
  requestStats: {
    total: 75,
    passed: 54,
    failed: 20,
    unavailable: 1
  },
  assertionStats: {
    total: 225,
    passed: 197,
    failed: 25,
    unavailable: 3
  },
  severityStats: {
    blocker: 0,
    critical: 0,
    major: 4,
    minor: 36,
    none: 110
  },
  gatlingReportLocation: "1/1/2025071819215992a7b91225/GATLING_REPORT",
  gatlingLogLocation: "1/1/2025071819215992a7b91225/GATLING_LOG/simulation-V373-01042022.log.gz",
  testRequirements: true,
  requirementsFileLocation: "1/1/2025071819215992a7b91225/REQUIREMENTS/requirementsV1_AllPassing.csv",
  createdTime: "2025-07-18T18:21:59.826+00:00",
  severityVersion: "V2",
  requirementsVersion: "V1"
};

function App() {
  const [activeTab, setActiveTab] = useState<'summary' | 'metadata'>('summary');

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header with compact metrics */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Gatling Performance Dashboard
                </h1>
                <p className="text-slate-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {testData.test.description}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <StatusBadge status={testData.status} />
              </div>
            </div>
            
            {/* Compact metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
              <CompactMetricCard
                icon={Calendar}
                label="Start Time"
                value={formatDate(testData.startTime)}
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
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-slate-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'summary'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab('metadata')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'metadata'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Metadata
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Test Summary</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponseTimeChart responseTimes={testData.responseTimes} />
                <RequestStats stats={testData.requestStats} />
                <AssertionStats stats={testData.assertionStats} />
                <SeverityStats stats={testData.severityStats} />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Test Metadata</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Test Information */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Test Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Test Type:</span>
                      <span className="text-white font-medium">{testData.test.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Simulation:</span>
                      <span className="text-white font-medium text-sm">{testData.test.simulationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Environment:</span>
                      <span className="text-white font-medium">{testData.environment || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Branch:</span>
                      <span className="text-white font-medium">{testData.branch || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Version Information */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <GitCommit className="w-5 h-5 text-green-400" />
                    Version Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gatling Version:</span>
                      <span className="text-white font-medium">{testData.gatlingVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Parser Version:</span>
                      <span className="text-white font-medium">{testData.parserVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Severity Version:</span>
                      <span className="text-white font-medium">{testData.severityVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requirements Version:</span>
                      <span className="text-white font-medium">{testData.requirementsVersion}</span>
                    </div>
                  </div>
                </div>

                {/* File Locations */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    File Locations
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 text-sm">Gatling Report:</span>
                      <p className="text-white font-mono text-sm mt-1 break-all">{testData.gatlingReportLocation}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Gatling Log:</span>
                      <p className="text-white font-mono text-sm mt-1 break-all">{testData.gatlingLogLocation}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Requirements File:</span>
                      <p className="text-white font-mono text-sm mt-1 break-all">{testData.requirementsFileLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Git Information */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-orange-400" />
                    Git Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Git Hash:</span>
                      <span className="text-white font-medium font-mono text-sm">
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
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Test Configuration
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rate Granularity:</span>
                      <span className="text-white font-medium">{testData.rateGranularity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Created:</span>
                      <span className="text-white font-medium">{formatDate(testData.createdTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              Generated with Gatling {testData.gatlingVersion} • Parser {testData.parserVersion}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
