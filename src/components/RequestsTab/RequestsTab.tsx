import React from 'react';
import RequestsTable from '../RequestsTable';
import { TestResults } from '../../types';

export interface RequestsTabProps {
  testData: TestResults;
}

const RequestsTab: React.FC<RequestsTabProps> = ({ testData }) => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Request Results</h2>
      <RequestsTable testData={testData} />
    </div>
  );
};

export default RequestsTab;
