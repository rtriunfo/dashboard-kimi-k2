import { render, screen } from '@testing-library/react';
import { RequestsTableContainer } from './RequestsTableContainer';
import { TestResults, RequestResult } from '../../types';

const mockTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Test',
    type: 'load',
    simulationName: 'TestSimulation'
  },
  status: 'completed',
  startTime: '2024-01-01T00:00:00Z',
  duration: 3600,
  branch: null,
  gatlingVersion: '3.9.0',
  parserVersion: '1.0.0',
  environment: null,
  gitHash: null,
  totalRequests: 100,
  errorRate: 10,
  rate: 10,
  rateGranularity: 'second',
  responseTimes: {
    min: 100,
    max: 300,
    percentiles: { '50': 200, '95': 280 }
  },
  requestStats: {
    total: 100,
    passed: 90,
    failed: 10,
    unavailable: 0
  },
  assertionStats: {
    total: 100,
    passed: 90,
    failed: 10,
    unavailable: 0
  },
  severityStats: {
    blocker: 0,
    critical: 5,
    major: 5,
    minor: 0,
    none: 90
  },
  gatlingReportLocation: '/reports/gatling',
  gatlingLogLocation: '/logs/gatling',
  testRequirements: false,
  requirementsFileLocation: '',
  createdTime: '2024-01-01T00:00:00Z',
  severityVersion: '1.0.0',
  requirementsVersion: '1.0.0',
  requestResults: []
};

const mockRequestResult: RequestResult = {
  id: 1,
  request: {
    id: 1,
    requestName: 'Test Request',
    requestDescription: null,
    requestPriority: null,
    tags: null,
    createdTime: '2024-01-01T00:00:00Z'
  },
  status: 'passed',
  severity: 'low',
  responseTimes: {
    min: 100,
    max: 300,
    percentiles: { '50': 200, '95': 280 }
  },
  totalCount: 50,
  passCount: 45,
  failCount: 5,
  errorPercentage: 5,
  rate: 10,
  rateGranularity: 'second',
  testRequirements: false,
  statistics: false,
  requirements: {
    status: 'passed',
    passed: 45,
    failed: 5,
    percentiles: []
  }
};

describe('RequestsTableContainer', () => {
  const mockChildren = <tbody><tr><td>Test Content</td></tr></tbody>;

  it('renders empty state when no test data', () => {
    render(
      <RequestsTableContainer
        testData={null as any}
        requestResults={[]}
        filteredAndSortedResults={[]}
      >
        {mockChildren}
      </RequestsTableContainer>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No test data available')).toBeInTheDocument();
  });

  it('renders empty state when no request results', () => {
    render(
      <RequestsTableContainer
        testData={mockTestData}
        requestResults={[]}
        filteredAndSortedResults={[]}
      >
        {mockChildren}
      </RequestsTableContainer>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No request data available')).toBeInTheDocument();
  });

  it('renders table with children when data is available', () => {
    const requestResults = [mockRequestResult];
    
    render(
      <RequestsTableContainer
        testData={mockTestData}
        requestResults={requestResults}
        filteredAndSortedResults={requestResults}
      >
        {mockChildren}
      </RequestsTableContainer>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('shows filter empty state when no filtered results but has data', () => {
    const requestResults = [mockRequestResult];
    
    render(
      <RequestsTableContainer
        testData={mockTestData}
        requestResults={requestResults}
        filteredAndSortedResults={[]}
      >
        {mockChildren}
      </RequestsTableContainer>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('No requests match the selected filters')).toBeInTheDocument();
  });

  it('applies correct CSS classes to table', () => {
    const requestResults = [mockRequestResult];
    
    render(
      <RequestsTableContainer
        testData={mockTestData}
        requestResults={requestResults}
        filteredAndSortedResults={requestResults}
      >
        {mockChildren}
      </RequestsTableContainer>
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full', 'border-collapse', 'bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl', 'border', 'border-slate-700');
  });

  it('applies overflow-x-auto to container', () => {
    const requestResults = [mockRequestResult];
    
    render(
      <RequestsTableContainer
        testData={mockTestData}
        requestResults={requestResults}
        filteredAndSortedResults={requestResults}
      >
        {mockChildren}
      </RequestsTableContainer>
    );

    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('overflow-x-auto');
  });
});
