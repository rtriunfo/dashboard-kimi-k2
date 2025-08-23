import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryTab from './SummaryTab';
import { TestResults } from '../../types';

// Mock the child components
jest.mock('../ResponseTimeChart', () => {
  return function MockResponseTimeChart({ responseTimes }: any) {
    return <div data-testid="response-time-chart">Response Time Chart - Min: {responseTimes.min}ms</div>;
  };
});

jest.mock('../RequestStats', () => {
  return function MockRequestStats({ stats }: any) {
    return <div data-testid="request-stats">Request Stats - Successful: {stats.successful}</div>;
  };
});

jest.mock('../AssertionStats', () => {
  return function MockAssertionStats({ stats }: any) {
    return <div data-testid="assertion-stats">Assertion Stats - Passed: {stats.passed}</div>;
  };
});

jest.mock('../SeverityStats', () => {
  return function MockSeverityStats({ stats }: any) {
    return <div data-testid="severity-stats">Severity Stats - Minor: {stats.minor}</div>;
  };
});

const mockTestData: TestResults = {
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
    successful: 980,
    failed: 20,
    total: 1000
  },
  assertionStats: {
    passed: 950,
    failed: 50,
    total: 1000
  },
  severityStats: {
    minor: 10,
    major: 5,
    critical: 2,
    total: 17
  },
  test: {
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

describe('SummaryTab', () => {
  it('renders the summary tab title', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Test Summary' })).toBeInTheDocument();
  });

  it('renders all required child components', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    expect(screen.getByTestId('response-time-chart')).toBeInTheDocument();
    expect(screen.getByTestId('request-stats')).toBeInTheDocument();
    expect(screen.getByTestId('assertion-stats')).toBeInTheDocument();
    expect(screen.getByTestId('severity-stats')).toBeInTheDocument();
  });

  it('passes correct props to ResponseTimeChart', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    const responseTimeChart = screen.getByTestId('response-time-chart');
    expect(responseTimeChart).toHaveTextContent('Min: 50ms');
  });

  it('passes correct props to RequestStats', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    const requestStats = screen.getByTestId('request-stats');
    expect(requestStats).toHaveTextContent('Successful: 980');
  });

  it('passes correct props to AssertionStats', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    const assertionStats = screen.getByTestId('assertion-stats');
    expect(assertionStats).toHaveTextContent('Passed: 950');
  });

  it('passes correct props to SeverityStats', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    const severityStats = screen.getByTestId('severity-stats');
    expect(severityStats).toHaveTextContent('Minor: 10');
  });

  it('applies correct CSS classes for layout', () => {
    render(<SummaryTab testData={mockTestData} />);
    
    const container = screen.getByRole('heading', { name: 'Test Summary' }).parentElement;
    expect(container).toBeInTheDocument();
    
    const gridContainer = container?.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'gap-6', 'lg:grid-cols-2');
  });

  it('handles missing optional data gracefully', () => {
    const minimalTestData = {
      ...mockTestData,
      requestStats: {
        successful: 0,
        failed: 0,
        total: 0
      }
    };

    render(<SummaryTab testData={minimalTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Test Summary' })).toBeInTheDocument();
    expect(screen.getByTestId('request-stats')).toHaveTextContent('Successful: 0');
  });

  it('renders with different response time values', () => {
    const customTestData = {
      ...mockTestData,
      responseTimes: {
        ...mockTestData.responseTimes,
        min: 25,
        max: 5000
      }
    };

    render(<SummaryTab testData={customTestData} />);
    
    const responseTimeChart = screen.getByTestId('response-time-chart');
    expect(responseTimeChart).toHaveTextContent('Min: 25ms');
  });

  it('maintains component structure with different test data', () => {
    const alternativeTestData = {
      ...mockTestData,
      assertionStats: {
        passed: 100,
        failed: 0,
        total: 100
      },
      severityStats: {
        minor: 0,
        major: 0,
        critical: 0,
        total: 0
      }
    };

    render(<SummaryTab testData={alternativeTestData} />);
    
    expect(screen.getByTestId('assertion-stats')).toHaveTextContent('Passed: 100');
    expect(screen.getByTestId('severity-stats')).toHaveTextContent('Minor: 0');
  });
});
