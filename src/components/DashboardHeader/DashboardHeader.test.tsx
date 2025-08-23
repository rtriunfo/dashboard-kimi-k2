import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardHeader from './DashboardHeader';
import { TestResults } from '../../types';
import { TestScenario } from '../../config/testReportAdapter';

// Mock the child components
jest.mock('../StatusBadge', () => {
  return function MockStatusBadge({ status, size, showIcon }: any) {
    return <div data-testid="status-badge">Status: {status} Size: {size} Icon: {showIcon.toString()}</div>;
  };
});

jest.mock('../CompactMetricCard', () => {
  return function MockCompactMetricCard({ icon, label, value, color }: any) {
    return <div data-testid={`metric-card-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      {label}: {typeof value === 'object' ? 'Complex Value' : value} ({color})
    </div>;
  };
});

jest.mock('../ResponseTimesOverview', () => {
  return function MockResponseTimesOverview({ responseTimes }: any) {
    return <div data-testid="response-times-overview">Response Times: {responseTimes.min}-{responseTimes.max}ms</div>;
  };
});

jest.mock('../ScenarioSelector', () => {
  return function MockScenarioSelector({ selectedScenario, onScenarioChange }: any) {
    return (
      <div data-testid="scenario-selector">
        Selected: {selectedScenario}
        <button onClick={() => onScenarioChange('new-scenario')}>Change Scenario</button>
      </div>
    );
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

const mockScenario: TestScenario = {
  id: 'test-scenario',
  name: 'Test Scenario',
  data: mockTestData
};

const defaultProps = {
  testData: mockTestData,
  selectedScenario: 'test-scenario',
  currentScenario: mockScenario,
  availableScenarios: [mockScenario],
  isLoading: false,
  isScenarioDropdownOpen: false,
  onScenarioChange: jest.fn(),
  onToggleDropdown: jest.fn(),
  onCloseDropdown: jest.fn(),
};

describe('DashboardHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the performance report title', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Performance Report' })).toBeInTheDocument();
  });

  it('displays test description with activity icon', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByText('Peak Hour Load Test')).toBeInTheDocument();
  });

  it('displays scenario badge', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByText('Scenario: test-scenario')).toBeInTheDocument();
  });

  it('renders scenario selector component', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const scenarioSelector = screen.getByTestId('scenario-selector');
    expect(scenarioSelector).toBeInTheDocument();
    expect(scenarioSelector).toHaveTextContent('Selected: test-scenario');
  });

  it('renders status badge component', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const statusBadge = screen.getByTestId('status-badge');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Status: PASSED Size: lg Icon: true');
  });

  it('renders all compact metric cards', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByTestId('metric-card-start-time')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card-duration')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card-total-requests')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card-requests-min')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card-error-rate')).toBeInTheDocument();
  });

  it('displays correct metric values', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByTestId('metric-card-duration')).toHaveTextContent('Duration: 0h 5m 0s');
    expect(screen.getByTestId('metric-card-total-requests')).toHaveTextContent('Total Requests: 1,000');
    expect(screen.getByTestId('metric-card-requests-min')).toHaveTextContent('Requests/Min: 200');
    expect(screen.getByTestId('metric-card-error-rate')).toHaveTextContent('Error Rate: 2.00%');
  });

  it('renders response times overview component', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const responseTimesOverview = screen.getByTestId('response-times-overview');
    expect(responseTimesOverview).toBeInTheDocument();
    expect(responseTimesOverview).toHaveTextContent('Response Times: 50-2000ms');
  });

  it('formats duration correctly for different values', () => {
    const testDataWithLongDuration = {
      ...mockTestData,
      duration: 90061 // 1 day, 1 hour, 1 minute, 1 second
    };

    render(<DashboardHeader {...defaultProps} testData={testDataWithLongDuration} />);
    
    expect(screen.getByTestId('metric-card-duration')).toHaveTextContent('Duration: 1d 1h 1m 1s');
  });

  it('formats start time correctly', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const startTimeCard = screen.getByTestId('metric-card-start-time');
    expect(startTimeCard).toHaveTextContent('Start Time: Complex Value');
  });

  it('handles scenario change callback', () => {
    const onScenarioChange = jest.fn();
    render(<DashboardHeader {...defaultProps} onScenarioChange={onScenarioChange} />);
    
    const changeButton = screen.getByText('Change Scenario');
    changeButton.click();
    
    expect(onScenarioChange).toHaveBeenCalledWith('new-scenario');
  });

  it('applies correct CSS classes for layout', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('relative', 'z-20', 'border-b', 'bg-slate-800/50', 'backdrop-blur-sm', 'border-slate-700');
  });

  it('applies correct grid classes for metric cards', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const metricsGrid = screen.getByTestId('metric-card-start-time').closest('.grid');
    expect(metricsGrid).toHaveClass('grid', 'grid-cols-2', 'gap-3', 'mt-4', 'sm:grid-cols-3', 'lg:grid-cols-5');
  });

  it('handles different test statuses', () => {
    const failedTestData = {
      ...mockTestData,
      status: 'FAILED'
    };

    render(<DashboardHeader {...defaultProps} testData={failedTestData} />);
    
    const statusBadge = screen.getByTestId('status-badge');
    expect(statusBadge).toHaveTextContent('Status: FAILED');
  });

  it('handles high error rates correctly', () => {
    const highErrorTestData = {
      ...mockTestData,
      errorRate: 0.15
    };

    render(<DashboardHeader {...defaultProps} testData={highErrorTestData} />);
    
    expect(screen.getByTestId('metric-card-error-rate')).toHaveTextContent('Error Rate: 15.00%');
  });

  it('formats large request numbers with commas', () => {
    const largeVolumeTestData = {
      ...mockTestData,
      totalRequests: 1234567,
      rate: 5000
    };

    render(<DashboardHeader {...defaultProps} testData={largeVolumeTestData} />);
    
    expect(screen.getByTestId('metric-card-total-requests')).toHaveTextContent('Total Requests: 1,234,567');
    expect(screen.getByTestId('metric-card-requests-min')).toHaveTextContent('Requests/Min: 5,000');
  });

  it('handles different test descriptions', () => {
    const customTestData = {
      ...mockTestData,
      test: {
        ...mockTestData.test,
        description: 'Custom Stress Test Description'
      }
    };

    render(<DashboardHeader {...defaultProps} testData={customTestData} />);
    
    expect(screen.getByText('Custom Stress Test Description')).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    // Verify ScenarioSelector receives correct props
    const scenarioSelector = screen.getByTestId('scenario-selector');
    expect(scenarioSelector).toHaveTextContent('Selected: test-scenario');
    
    // Verify StatusBadge receives correct props
    const statusBadge = screen.getByTestId('status-badge');
    expect(statusBadge).toHaveTextContent('Size: lg Icon: true');
    
    // Verify ResponseTimesOverview receives correct props
    const responseTimesOverview = screen.getByTestId('response-times-overview');
    expect(responseTimesOverview).toHaveTextContent('50-2000ms');
  });
});
