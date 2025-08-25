import React from 'react';
import { Clock } from 'lucide-react';
import ResponseTimesDetailChart from '../ResponseTimesDetailChart';
import { TestResults } from '../../types';

export interface ResponseTimesTabProps {
  testData: TestResults;
}

const ResponseTimesTab: React.FC<ResponseTimesTabProps> = ({ testData }) => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Response Times Analysis</h2>
      <div className="grid grid-cols-1 gap-6">
        <ResponseTimesDetailChart responseTimes={testData.responseTimes} />
        <div className="p-6 border bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Response Time Metrics
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{testData.responseTimes.min}<span className="ml-1 text-sm">ms</span></div>
              <div className="mt-1 text-sm text-gray-600 dark:text-slate-400">Minimum</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{testData.responseTimes.percentiles["50.0"]}<span className="ml-1 text-sm">ms</span></div>
              <div className="mt-1 text-sm text-gray-600 dark:text-slate-400">Median (P50)</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{testData.responseTimes.max}<span className="ml-1 text-sm">ms</span></div>
              <div className="mt-1 text-sm text-gray-600 dark:text-slate-400">Maximum</div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-slate-300">Performance Insights</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                <span>50% of requests complete in {testData.responseTimes.percentiles["50.0"]}ms or less</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                <span>90% of requests complete in {testData.responseTimes.percentiles["90.0"]}ms or less</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                <span>The slowest 1% of requests take more than {testData.responseTimes.percentiles["99.0"]}ms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimesTab;
