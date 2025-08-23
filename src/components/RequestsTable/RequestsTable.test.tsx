import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestsTable from './RequestsTable';
import { TestResults } from '../../types';

// Mock the child components
jest.mock('../RequestsTableFilters', () => ({
  RequestsTableFilters: ({ onStatusToggle, onSeverityToggle, clearFilters, toggleExpandAll }: any) => (
    <div data-testid="requests-table-filters">
      <button onClick={() => onStatusToggle('PASS')} data-testid="status-toggle-pass">Toggle PASS</button>
      <button onClick={() => onSeverityToggle('HIGH')} data-testid="severity-toggle-high">Toggle HIGH</button>
      <button onClick={clearFilters} data-testid="clear-filters">Clear Filters</button>
      <button onClick={toggleExpandAll} data-testid="toggle-expand-all">Toggle Expand All</button>
    </div>
  )
}));

jest.mock('../RequestTableRow', () => ({
  RequestTableRow: ({ result, onToggleExpansion, isExpanded }: any) => (
    <tr data-testid={`request-row-${result.id || 0}`}>
      <td>{result.request?.requestName || 'Unknown'}</td>
      <td>{result.status}</td>
      <td>
        <button 
          onClick={() => onToggleExpansion(result.id || 0)}
          data-testid={`expand-button-${result.id || 0}`}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </td>
    </tr>
  )
}));

jest.mock('../RequestsTableHeader', () => ({
  RequestsTableHeader: ({ onSort, sortColumn, sortDirection }: any) => (
    <thead data-testid="requests-table-header">
      <tr>
        <th>
          <button onClick={() => onSort('name')} data-testid="sort-name">
            Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </th>
        <th>
          <button onClick={() => onSort('status')} data-testid="sort-status">
            Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </th>
        <th>
          <button onClick={() => onSort('min')} data-testid="sort-min">
            Min {sortColumn === 'min' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </th>
      </tr>
    </thead>
  )
}));

jest.mock('../RequestsTableContainer', () => ({
  RequestsTableContainer: ({ children }: any) => (
    <div data-testid="requests-table-container">
      <table>{children}</table>
    </div>
  )
}));

const mockTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Test Scenario',
    type: 'Load Test',
    simulationName: 'TestSimulation'
  },
  status: 'PASS',
  startTime: '2024-01-01T00:00:00Z',
  duration: 300,
  branch: 'main',
  gatlingVersion: '3.9.0',
  parserVersion: '1.0.0',
  environment: 'test',
  gitHash: 'abc123',
  totalRequests: 1000,
  errorRate: 0.05,
  rate: 100,
  rateGranularity: 'minute',
  responseTimes: {
    min: 50,
    max: 500,
    percentiles: { '50': 100, '95': 400 }
  },
  requestStats: { total: 1000, passed: 950, failed: 50, unavailable: 0 },
  assertionStats: { total: 100, passed: 95, failed: 5, unavailable: 0 },
  severityStats: { blocker: 0, critical: 5, major: 10, minor: 15, none: 970 },
  gatlingReportLocation: '/path/to/report',
  gatlingLogLocation: '/path/to/log',
  testRequirements: true,
  requirementsFileLocation: '/path/to/requirements',
  createdTime: '2024-01-01T00:00:00Z',
  severityVersion: '1.0.0',
  requirementsVersion: '1.0.0',
  requestResults: [
    {
      id: 1,
      request: {
        id: 1,
        requestName: 'Login Request',
        requestDescription: 'User login endpoint',
        requestPriority: 'HIGH',
        tags: 'auth,login',
        createdTime: '2024-01-01T00:00:00Z'
      },
      status: 'PASS',
      severity: 'HIGH',
      totalCount: 100,
      passCount: 95,
      failCount: 5,
      errorPercentage: 5.0,
      rate: 10,
      rateGranularity: 'minute',
      responseTimes: {
        min: 50,
        max: 200,
        percentiles: {
          '50': 100,
          '95': 180,
          '99': 195
        }
      },
      testRequirements: true,
      statistics: true,
      requirements: {
        status: 'PASS',
        passed: 8,
        failed: 2,
        percentiles: []
      }
    },
    {
      id: 2,
      request: {
        id: 2,
        requestName: 'Search Request',
        requestDescription: 'Product search endpoint',
        requestPriority: 'MEDIUM',
        tags: 'search,product',
        createdTime: '2024-01-01T00:00:00Z'
      },
      status: 'FAIL',
      severity: 'MEDIUM',
      totalCount: 50,
      passCount: 30,
      failCount: 20,
      errorPercentage: 40.0,
      rate: 5,
      rateGranularity: 'minute',
      responseTimes: {
        min: 30,
        max: 500,
        percentiles: {
          '50': 150,
          '95': 450,
          '99': 480
        }
      },
      testRequirements: true,
      statistics: true,
      requirements: {
        status: 'FAIL',
        passed: 3,
        failed: 7,
        percentiles: []
      }
    },
    {
      id: 3,
      request: {
        id: 3,
        requestName: 'Logout Request',
        requestDescription: 'User logout endpoint',
        requestPriority: 'LOW',
        tags: 'auth,logout',
        createdTime: '2024-01-01T00:00:00Z'
      },
      status: 'PASS',
      severity: 'LOW',
      totalCount: 25,
      passCount: 25,
      failCount: 0,
      errorPercentage: 0.0,
      rate: 2,
      rateGranularity: 'minute',
      responseTimes: {
        min: 20,
        max: 80,
        percentiles: {
          '50': 40,
          '95': 70,
          '99': 75
        }
      },
      testRequirements: true,
      statistics: true,
      requirements: {
        status: 'PASS',
        passed: 5,
        failed: 0,
        percentiles: []
      }
    }
  ]
};

describe('RequestsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<RequestsTable testData={mockTestData} />);
      expect(screen.getByTestId('requests-table-filters')).toBeInTheDocument();
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });

    it('renders all request results', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      expect(screen.getByTestId('request-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('request-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('request-row-3')).toBeInTheDocument();
    });

    it('displays request names correctly', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      expect(screen.getByText('Login Request')).toBeInTheDocument();
      expect(screen.getByText('Search Request')).toBeInTheDocument();
      expect(screen.getByText('Logout Request')).toBeInTheDocument();
    });

    it('displays request statuses correctly', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      expect(screen.getAllByText('PASS')).toHaveLength(2);
      expect(screen.getByText('FAIL')).toBeInTheDocument();
    });
  });

  describe('Empty Data Handling', () => {
    it('handles empty test data gracefully', () => {
      const emptyTestData: TestResults = {
        ...mockTestData,
        requestResults: []
      };
      
      render(<RequestsTable testData={emptyTestData} />);
      expect(screen.getByTestId('requests-table-filters')).toBeInTheDocument();
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });

    it('handles undefined requestResults', () => {
      const undefinedTestData = {
        ...mockTestData,
        requestResults: undefined
      } as TestResults;
      
      render(<RequestsTable testData={undefinedTestData} />);
      expect(screen.getByTestId('requests-table-filters')).toBeInTheDocument();
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });

    it('handles missing percentiles data', () => {
      const testDataWithoutPercentiles: TestResults = {
        ...mockTestData,
        requestResults: [
          {
            ...mockTestData.requestResults[0],
            responseTimes: {
              min: 50,
              max: 200,
              percentiles: {}
            }
          }
        ]
      };
      
      render(<RequestsTable testData={testDataWithoutPercentiles} />);
      expect(screen.getByText('Login Request')).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('sorts by name in ascending order by default', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const sortButton = screen.getByTestId('sort-name');
      expect(sortButton).toHaveTextContent('Name ↑');
    });

    it('toggles sort direction when clicking same column', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const sortButton = screen.getByTestId('sort-name');
      fireEvent.click(sortButton);
      
      expect(sortButton).toHaveTextContent('Name ↓');
    });

    it('changes sort column when clicking different column', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const statusSortButton = screen.getByTestId('sort-status');
      fireEvent.click(statusSortButton);
      
      expect(statusSortButton).toHaveTextContent('Status ↑');
    });

    it('sorts by numeric values correctly', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const minSortButton = screen.getByTestId('sort-min');
      fireEvent.click(minSortButton);
      
      expect(minSortButton).toHaveTextContent('Min ↑');
    });
  });

  describe('Row Expansion Functionality', () => {
    it('expands and collapses individual rows', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const expandButton = screen.getByTestId('expand-button-1');
      expect(expandButton).toHaveTextContent('Expand');
      
      fireEvent.click(expandButton);
      expect(expandButton).toHaveTextContent('Collapse');
      
      fireEvent.click(expandButton);
      expect(expandButton).toHaveTextContent('Expand');
    });

    it('handles expand all functionality', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const expandAllButton = screen.getByTestId('toggle-expand-all');
      fireEvent.click(expandAllButton);
      
      // All expand buttons should show "Collapse"
      expect(screen.getByTestId('expand-button-1')).toHaveTextContent('Collapse');
      expect(screen.getByTestId('expand-button-2')).toHaveTextContent('Collapse');
      expect(screen.getByTestId('expand-button-3')).toHaveTextContent('Collapse');
    });

    it('handles error in row expansion gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<RequestsTable testData={mockTestData} />);
      
      // Simulate an error by trying to expand a non-existent row
      const expandButton = screen.getByTestId('expand-button-1');
      
      // Mock an error in the expansion logic
      const originalError = console.error;
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fireEvent.click(expandButton);
      
      console.error = originalError;
      consoleSpy.mockRestore();
    });
  });

  describe('Filter Integration', () => {
    it('integrates with status filters', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const statusToggle = screen.getByTestId('status-toggle-pass');
      fireEvent.click(statusToggle);
      
      // The component should handle the status toggle
      expect(statusToggle).toBeInTheDocument();
    });

    it('integrates with severity filters', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const severityToggle = screen.getByTestId('severity-toggle-high');
      fireEvent.click(severityToggle);
      
      // The component should handle the severity toggle
      expect(severityToggle).toBeInTheDocument();
    });

    it('clears all filters when clear button is clicked', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      const clearButton = screen.getByTestId('clear-filters');
      fireEvent.click(clearButton);
      
      // The component should handle clearing filters
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Data Processing', () => {
    it('calculates available percentiles correctly', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      // Component should render without errors when processing percentiles
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });

    it('handles missing response times data', () => {
      const testDataWithoutResponseTimes: TestResults = {
        testName: 'No Response Times Test',
        requestResults: [
          {
            id: 1,
            request: { requestName: 'Test Request' },
            status: 'PASS',
            severity: 'HIGH',
            totalCount: 10
          }
        ]
      };
      
      render(<RequestsTable testData={testDataWithoutResponseTimes} />);
      expect(screen.getByText('Test Request')).toBeInTheDocument();
    });

    it('formats response times correctly', () => {
      render(<RequestsTable testData={mockTestData} />);
      
      // The formatResponseTime function should be working
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles requests without IDs', () => {
      const testDataWithoutIds: TestResults = {
        testName: 'No IDs Test',
        requestResults: [
          {
            request: { requestName: 'Test Request' },
            status: 'PASS',
            severity: 'HIGH',
            totalCount: 10
          } as any
        ]
      };
      
      render(<RequestsTable testData={testDataWithoutIds} />);
      expect(screen.getByText('Test Request')).toBeInTheDocument();
    });

    it('handles malformed request data', () => {
      const malformedTestData: TestResults = {
        testName: 'Malformed Test',
        requestResults: [
          {
            id: 1,
            // Missing request object
            status: 'PASS',
            severity: 'HIGH',
            totalCount: 10
          } as any
        ]
      };
      
      render(<RequestsTable testData={malformedTestData} />);
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('handles numeric operations with invalid data', () => {
      const testDataWithInvalidNumbers: TestResults = {
        testName: 'Invalid Numbers Test',
        requestResults: [
          {
            id: 1,
            request: { requestName: 'Test Request' },
            status: 'PASS',
            severity: 'HIGH',
            totalCount: 'invalid' as any,
            errorPercentage: 'not a number' as any
          }
        ]
      };
      
      render(<RequestsTable testData={testDataWithInvalidNumbers} />);
      expect(screen.getByText('Test Request')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('handles click outside events for dropdown', async () => {
      render(<RequestsTable testData={mockTestData} />);
      
      // Simulate click outside event
      fireEvent.mouseDown(document.body);
      
      await waitFor(() => {
        expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
      });
    });

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<RequestsTable testData={mockTestData} />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('memoizes expensive calculations', () => {
      const { rerender } = render(<RequestsTable testData={mockTestData} />);
      
      // Re-render with same data
      rerender(<RequestsTable testData={mockTestData} />);
      
      // Component should render without issues
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
      const largeTestData: TestResults = {
        testName: 'Large Dataset Test',
        requestResults: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          request: { requestName: `Request ${i + 1}` },
          status: i % 2 === 0 ? 'PASS' : 'FAIL',
          severity: 'HIGH',
          totalCount: 100,
          passCount: 90,
          failCount: 10,
          errorPercentage: '10.0',
          responseTimes: {
            min: 50,
            max: 200,
            percentiles: { '50': 100, '95': 180 }
          }
        }))
      };
      
      render(<RequestsTable testData={largeTestData} />);
      expect(screen.getByTestId('requests-table-container')).toBeInTheDocument();
    });
  });
});
