import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponseTimesTab from './ResponseTimesTab';
import { TestResults } from '../../types';

// Mock the child components
jest.mock('../ResponseTimesDetailChart', () => {
  return function MockResponseTimesDetailChart({ responseTimes }: any) {
    return <div data-testid="response-times-detail-chart">Detail Chart - Min: {responseTimes.min}ms, Max: {responseTimes.max}ms</div>;
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

describe('ResponseTimesTab', () => {
  it('renders the response times analysis title', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Response Times Analysis' })).toBeInTheDocument();
  });

  it('renders the ResponseTimesDetailChart component', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    const detailChart = screen.getByTestId('response-times-detail-chart');
    expect(detailChart).toBeInTheDocument();
    expect(detailChart).toHaveTextContent('Min: 50ms, Max: 2000ms');
  });

  it('renders the Response Time Metrics section', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    expect(screen.getByRole('heading', { name: 'Response Time Metrics' })).toBeInTheDocument();
  });

  it('displays minimum response time correctly', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    const minSection = screen.getByText('Minimum').closest('.p-4');
    expect(minSection).toHaveTextContent('50ms');
  });

  it('displays median (P50) response time correctly', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    const medianSection = screen.getByText('Median (P50)').closest('.p-4');
    expect(medianSection).toHaveTextContent('150ms');
  });

  it('displays maximum response time correctly', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    const maxSection = screen.getByText('Maximum').closest('.p-4');
    expect(maxSection).toHaveTextContent('2000ms');
  });

  it('renders performance insights section', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    expect(screen.getByText('Performance Insights')).toBeInTheDocument();
  });

  it('displays P50 insight correctly', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    expect(screen.getByText('50% of requests complete in 150ms or less')).toBeInTheDocument();
  });

  it('displays P90 insight correctly', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    expect(screen.getByText('90% of requests complete in 400ms or less')).toBeInTheDocument();
  });

  it('displays P99 insight correctly', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    expect(screen.getByText('The slowest 1% of requests take more than 1200ms')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    const gridContainer = screen.getByRole('heading', { name: 'Response Times Analysis' }).nextElementSibling;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'gap-6');
  });

  it('applies correct CSS classes for metrics grid', () => {
    render(<ResponseTimesTab testData={mockTestData} />);
    
    const metricsGrid = screen.getByText('Minimum').closest('.grid');
    expect(metricsGrid).toHaveClass('grid', 'grid-cols-1', 'gap-4', 'md:grid-cols-3');
  });

  it('handles different percentile values correctly', () => {
    const customTestData = {
      ...mockTestData,
      responseTimes: {
        ...mockTestData.responseTimes,
        percentiles: {
          '50.0': 75,
          '75.0': 125,
          '90.0': 200,
          '95.0': 300,
          '99.0': 500
        }
      }
    };

    render(<ResponseTimesTab testData={customTestData} />);
    
    expect(screen.getByText('50% of requests complete in 75ms or less')).toBeInTheDocument();
    expect(screen.getByText('90% of requests complete in 200ms or less')).toBeInTheDocument();
    expect(screen.getByText('The slowest 1% of requests take more than 500ms')).toBeInTheDocument();
  });

  it('handles extreme response time values', () => {
    const extremeTestData = {
      ...mockTestData,
      responseTimes: {
        min: 1,
        max: 30000,
        percentiles: {
          '50.0': 5000,
          '75.0': 10000,
          '90.0': 20000,
          '95.0': 25000,
          '99.0': 29000
        }
      }
    };

    render(<ResponseTimesTab testData={extremeTestData} />);
    
    const minSection = screen.getByText('Minimum').closest('.p-4');
    const maxSection = screen.getByText('Maximum').closest('.p-4');
    const medianSection = screen.getByText('Median (P50)').closest('.p-4');
    
    expect(minSection).toHaveTextContent('1ms');
    expect(maxSection).toHaveTextContent('30000ms');
    expect(medianSection).toHaveTextContent('5000ms');
  });

  it('passes correct responseTimes prop to detail chart', () => {
    const customTestData = {
      ...mockTestData,
      responseTimes: {
        min: 25,
        max: 5000,
        percentiles: {
          '50.0': 100,
          '75.0': 200,
          '90.0': 300,
          '95.0': 400,
          '99.0': 800
        }
      }
    };

    render(<ResponseTimesTab testData={customTestData} />);
    
    const detailChart = screen.getByTestId('response-times-detail-chart');
    expect(detailChart).toHaveTextContent('Min: 25ms, Max: 5000ms');
  });
});
