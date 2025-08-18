import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestTableRow } from './RequestTableRow';
import { RequestResult, TestResults } from '../../types';

// Mock echarts to avoid canvas issues in tests
jest.mock('echarts', () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  })),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Test',
    type: 'load',
    simulationName: 'TestSimulation'
  },
  status: 'PASS',
  startTime: '2023-01-01T00:00:00Z',
  duration: 60000,
  branch: null,
  gatlingVersion: '3.8.0',
  parserVersion: '1.0.0',
  environment: null,
  gitHash: null,
  totalRequests: 1000,
  errorRate: 2.5,
  rate: 10,
  rateGranularity: 'req/s',
  responseTimes: {
    min: 100,
    max: 500,
    percentiles: { '50': 200, '95': 400 }
  },
  requestStats: {
    total: 1000,
    passed: 975,
    failed: 25,
    unavailable: 0
  },
  assertionStats: {
    total: 1000,
    passed: 975,
    failed: 25,
    unavailable: 0
  },
  severityStats: {
    blocker: 0,
    critical: 5,
    major: 10,
    minor: 10,
    none: 975
  },
  gatlingReportLocation: '/reports/gatling',
  gatlingLogLocation: '/logs/gatling',
  testRequirements: true,
  requirementsFileLocation: '/requirements.json',
  createdTime: '2023-01-01T00:00:00Z',
  severityVersion: 'v1.0',
  requirementsVersion: 'v1.0',
  requestResults: []
};

const mockResult: RequestResult = {
  id: 1,
  request: {
    id: 1,
    requestName: 'Test Request',
    requestDescription: 'Test description',
    requestPriority: 'High',
    tags: 'api,test',
    createdTime: '2023-01-01T00:00:00Z'
  },
  responseTimes: {
    min: 100,
    max: 500,
    percentiles: {
      '50': 200,
      '95': 400
    }
  },
  status: 'PASS',
  severity: 'LOW',
  totalCount: 1000,
  errorPercentage: 2.5,
  passCount: 975,
  failCount: 25,
  rate: 10,
  rateGranularity: 'req/s',
  testRequirements: true,
  statistics: true,
  requirements: {
    status: 'PASS',
    passed: 8,
    failed: 2,
    percentiles: [
      {
        percentile: 95,
        value: 400,
        status: 'PASS',
        difference: -10,
        percentageDifference: -2.5
      }
    ]
  }
};

const mockProps = {
  result: mockResult,
  index: 0,
  testData: mockTestData,
  availablePercentiles: ['50', '95'],
  isExpanded: false,
  onToggleExpansion: jest.fn(),
  formatResponseTime: (time: number) => `${time}ms`
};

describe('RequestTableRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders request name correctly', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('Test Request')).toBeInTheDocument();
  });

  it('renders response time data correctly', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('100ms')).toBeInTheDocument(); // min
    expect(screen.getByText('200ms')).toBeInTheDocument(); // 50th percentile
    expect(screen.getByText('400ms')).toBeInTheDocument(); // 95th percentile
    expect(screen.getByText('500ms')).toBeInTheDocument(); // max
  });

  it('renders status and severity badges when available', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders error percentage with correct color coding', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    const errorElement = screen.getByText('2.50%');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-yellow-400'); // 2.5% should be yellow (> 1% but <= 5%)
  });

  it('shows expand button when there is expandable data', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveTextContent('▶');
  });

  it('calls onToggleExpansion when expand button is clicked', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    expect(mockProps.onToggleExpansion).toHaveBeenCalledWith(1);
  });

  it('shows expanded content when isExpanded is true', () => {
    const expandedProps = { ...mockProps, isExpanded: true };
    render(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>);
    expect(screen.getByText('Request Details')).toBeInTheDocument();
    expect(screen.getByText('Pass/Fail Distribution')).toBeInTheDocument();
    expect(screen.getByText('Response Times')).toBeInTheDocument();
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
  });

  it('does not show expand button when there is no expandable data', () => {
    const noDataResult = {
      ...mockResult,
      passCount: 0,
      failCount: 0,
      requirements: {
        status: 'PASS',
        passed: 0,
        failed: 0,
        percentiles: []
      }
    };
    const noDataProps = { ...mockProps, result: noDataResult };
    
    render(<table><tbody><RequestTableRow {...noDataProps} /></tbody></table>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Test Request')).toBeInTheDocument();
  });

  it('handles missing or invalid result data gracefully', () => {
    const invalidResult = {
      ...mockResult,
      request: undefined,
      responseTimes: undefined
    } as any;
    const invalidProps = { ...mockProps, result: invalidResult };
    
    const { container } = render(<table><tbody><RequestTableRow {...invalidProps} /></tbody></table>);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders correct expand/collapse icon based on isExpanded state', () => {
    const { rerender } = render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('▶')).toBeInTheDocument();
    
    rerender(<table><tbody><RequestTableRow {...mockProps} isExpanded={true} /></tbody></table>);
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('applies correct row styling based on index', () => {
    const { container } = render(<table><tbody><RequestTableRow {...mockProps} index={0} /></tbody></table>);
    const row = container.querySelector('tr');
    expect(row).toHaveClass('bg-slate-800/30'); // even index

    const { container: container2 } = render(<table><tbody><RequestTableRow {...mockProps} index={1} /></tbody></table>);
    const row2 = container2.querySelector('tr');
    expect(row2).toHaveClass('bg-slate-800/10'); // odd index
  });

  it('renders total count with proper formatting', () => {
    render(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });
});
