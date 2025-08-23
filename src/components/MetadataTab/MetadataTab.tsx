import React from 'react';
import { Info, GitCommit, FileText, GitBranch, Settings } from 'lucide-react';
import { TestResults } from '../../types';

export interface MetadataTabProps {
  testData: TestResults;
}

const MetadataTab: React.FC<MetadataTabProps> = ({ testData }) => {
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
  );
};

export default MetadataTab;
