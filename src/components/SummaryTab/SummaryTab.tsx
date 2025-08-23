import React from 'react';
import ResponseTimeChart from '../ResponseTimeChart';
import RequestStats from '../RequestStats';
import AssertionStats from '../AssertionStats';
import SeverityStats from '../SeverityStats';
import { TestResults } from '../../types';

export interface SummaryTabProps {
  testData: TestResults;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ testData }) => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Test Summary</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResponseTimeChart responseTimes={testData.responseTimes} />
        <RequestStats stats={testData.requestStats} />
        <AssertionStats stats={testData.assertionStats} />
        <SeverityStats stats={testData.severityStats} />
      </div>
    </div>
  );
};

export default SummaryTab;
