import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestsTab from './RequestsTab';
import { TestResults } from '../../types';

// Mock the RequestsTable component
jest.mock('../RequestsTable', () => {
  return function MockRequestsTable({ testData }: any) {
    return <div data-testid="requests-table">Requests Table - Total Requests: {testData.totalRequests}</div>;
  };
});

const mockTestData: TestResults = {
  id: 1,
  status: 'PASSED',
  startTime: '2024-01-15T10:00:00Z',
  duration: 300,
  totalRequests: 1000,
  rate: 200,
  errorRate: 0.02,
  responseTimes: {
    min: 50,
    max: 2000,
    percentiles: {
      '50.0': 150,
      '75.0': 250,
      '90.0': 400,
      '95.0': 600,
      '99.0': 1200
    }
  },
  requestStats: {
    total: 1000,
    passed: 980,
    failed: 20,
    unavailable: 0
  },
  assertionStats: {
    total: 1000,
    passed: 950,
    failed: 50,
    unavailable: 0
  },
  severityStats: {
    blocker: 0,
    critical: 2,
    major: 5,
    minor: 10,
    none: 0
  },
  test: {
    id: 1,
    type: 'Load Test',
    description: 'Peak Hour Load Test',
    simulationName: 'PeakHourSimulation'
  },
  gatlingVersion: '3.9.0',
  parserVersion: '1.0.0',
  severityVersion: '1.0.0',
  requirementsVersion: '1.0.0',
  gatlingReportLocation: '/path/to/report',
  gatlingLogLocation: '/path/to/log',
  requirementsFileLocation: '/path/to/requirements',
  environment: 'production',
  branch: 'main',
  gitHash: 'abc123def456',
  testRequirements: true,
  rateGranularity: 'second',
  createdTime: '2024-01-15T10:00:00Z',
  requestResults: []
};

describe('RequestsTab', () => {
  it('renders the request results title', () => {
    render(<RequestsTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Request Results' })).toBeInTheDocument();
  });

  it('renders the RequestsTable component', () => {
    render(<RequestsTab testData={mockTestData} />);
    
    const requestsTable = screen.getByTestId('requests-table');
    expect(requestsTable).toBeInTheDocument();
    expect(requestsTable).toHaveTextContent('Total Requests: 1000');
  });

  it('passes testData prop to RequestsTable', () => {
    const customTestData = {
      ...mockTestData,
      totalRequests: 5000
    };

    render(<RequestsTab testData={customTestData} />);
    
    const requestsTable = screen.getByTestId('requests-table');
    expect(requestsTable).toHaveTextContent('Total Requests: 5000');
  });

  it('applies correct CSS classes', () => {
    render(<RequestsTab testData={mockTestData} />);
    
    const heading = screen.getByRole('heading', { name: 'Request Results' });
    expect(heading).toHaveClass('mb-6', 'text-2xl', 'font-bold', 'text-white');
  });

  it('handles different test data correctly', () => {
    const alternativeTestData = {
      ...mockTestData,
      totalRequests: 250,
      test: {
        id: 2,
        type: 'Stress Test',
        description: 'High load stress test',
        simulationName: 'StressTestSimulation'
      }
    };

    render(<RequestsTab testData={alternativeTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Request Results' })).toBeInTheDocument();
    const requestsTable = screen.getByTestId('requests-table');
    expect(requestsTable).toHaveTextContent('Total Requests: 250');
  });
});
