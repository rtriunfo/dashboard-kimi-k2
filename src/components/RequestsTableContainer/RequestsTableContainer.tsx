import React from 'react';
import { TestResults, RequestResult } from '../../types';
import EmptyState from '../EmptyState';

interface RequestsTableContainerProps {
  testData: TestResults;
  requestResults: RequestResult[];
  filteredAndSortedResults: RequestResult[];
  children: React.ReactNode;
}

/**
 * Container component that wraps the requests table with proper styling,
 * overflow handling, and empty state management
 */
export const RequestsTableContainer: React.FC<RequestsTableContainerProps> = ({
  testData,
  requestResults,
  filteredAndSortedResults,
  children
}) => {
  // Early return if no data
  if (!testData) {
    return <EmptyState message="No test data available" />;
  }

  // Early return if no requestResults
  if (!requestResults || requestResults.length === 0) {
    return <EmptyState message="No request data available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
        {children}
      </table>
      
      {filteredAndSortedResults.length === 0 && requestResults.length > 0 && (
        <EmptyState message="No requests match the selected filters" />
      )}
      
      {requestResults.length === 0 && (
        <EmptyState message="No request data available" />
      )}
    </div>
  );
};
