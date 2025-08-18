import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestsTableHeader } from './RequestsTableHeader';
import { TestResults } from '../../types';

// Mock the SortableHeader component
jest.mock('@components/SortableHeader', () => ({
  SortableHeader: ({ children, onSort, column, ...props }: any) => (
    <th {...props} onClick={() => onSort(column)} data-testid={`header-${column}`}>
      {children}
    </th>
  ),
}));

const mockTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Test Description',
    type: 'load',
    simulationName: 'TestSimulation',
  },
  status: 'completed',
  startTime: '2023-01-01T00:00:00Z',
  duration: 300,
  branch: null,
  gatlingVersion: '3.8.0',
  parserVersion: '1.0.0',
  environment: null,
  gitHash: null,
  totalRequests: 1000,
  errorRate: 0.05,
  rate: 10,
  rateGranularity: 'second',
  responseTimes: {
    min: 100,
    max: 5000,
    percentiles: {
      '50': 200,
      '95': 1000,
      '99': 2000,
    },
  },
  requestStats: {
    total: 1000,
    passed: 950,
    failed: 50,
    unavailable: 0,
  },
  assertionStats: {
    total: 1000,
    passed: 950,
    failed: 50,
    unavailable: 0,
  },
  severityStats: {
    blocker: 0,
    critical: 5,
    major: 10,
    minor: 35,
    none: 950,
  },
  gatlingReportLocation: '/path/to/report',
  gatlingLogLocation: '/path/to/log',
  testRequirements: true,
  requirementsFileLocation: '/path/to/requirements',
  createdTime: '2023-01-01T00:00:00Z',
  severityVersion: '1.0',
  requirementsVersion: '1.0',
  requestResults: [],
};

const mockProps = {
  testData: mockTestData,
  availablePercentiles: ['50', '95', '99'],
  sortColumn: 'name' as const,
  sortDirection: 'asc' as const,
  onSort: jest.fn(),
};

describe('RequestsTableHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required headers', () => {
    render(<RequestsTableHeader {...mockProps} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
  });

  it('renders percentile headers correctly', () => {
    render(<RequestsTableHeader {...mockProps} />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('handles 100th percentile display correctly', () => {
    const propsWithHundred = {
      ...mockProps,
      availablePercentiles: ['50', '95', '100.0'],
    };
    
    render(<RequestsTableHeader {...propsWithHundred} />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('does not render status header when testRequirements is false', () => {
    const propsWithoutRequirements = {
      ...mockProps,
      testData: { ...mockTestData, testRequirements: false },
    };
    
    render(<RequestsTableHeader {...propsWithoutRequirements} />);
    
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('does not render severity header when severityVersion is not present', () => {
    const propsWithoutSeverity = {
      ...mockProps,
      testData: { ...mockTestData, severityVersion: '' },
    };
    
    render(<RequestsTableHeader {...propsWithoutSeverity} />);
    
    expect(screen.queryByText('Severity')).not.toBeInTheDocument();
  });

  it('calls onSort when header is clicked', () => {
    render(<RequestsTableHeader {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('header-name'));
    expect(mockProps.onSort).toHaveBeenCalledWith('name');
    
    fireEvent.click(screen.getByTestId('header-min'));
    expect(mockProps.onSort).toHaveBeenCalledWith('min');
  });

  it('renders with empty percentiles array', () => {
    const propsWithoutPercentiles = {
      ...mockProps,
      availablePercentiles: [],
    };
    
    render(<RequestsTableHeader {...propsWithoutPercentiles} />);
    
    // Should still render basic headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });
});
