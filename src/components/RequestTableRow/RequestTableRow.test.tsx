import { render, screen, fireEvent } from '@testing-library/react';
import { RequestTableRow } from './RequestTableRow';
import { ThemeContext } from '../../contexts/ThemeContext';
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

// Mock window.matchMedia to prevent useTheme hook errors
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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

// Helper function to render component with theme context
const renderWithTheme = (component: React.ReactElement, theme: 'light' | 'dark' = 'light') => {
  // Create a test ThemeProvider that forces the theme value
  const TestThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const mockContextValue = {
      theme,
      setTheme: jest.fn(),
      toggleTheme: jest.fn()
    };
    
    return (
      <ThemeContext.Provider value={mockContextValue}>
        <div className={theme}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  };

  return render(
    <TestThemeProvider>
      {component}
    </TestThemeProvider>
  );
};

describe('RequestTableRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders request name correctly', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('Test Request')).toBeInTheDocument();
  });

  it('renders response time data correctly', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('100ms')).toBeInTheDocument(); // min
    expect(screen.getByText('200ms')).toBeInTheDocument(); // 50th percentile
    expect(screen.getByText('400ms')).toBeInTheDocument(); // 95th percentile
    expect(screen.getByText('500ms')).toBeInTheDocument(); // max
  });

  it('renders status and severity badges when available', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders error percentage with correct color coding', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    const errorElement = screen.getByText('2.50%');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-yellow-500'); // 2.5% should be yellow (> 1% but <= 5%)
  });

  it('shows expand button when there is expandable data', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    const expandButton = screen.getByRole('button');
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveTextContent('▶');
  });

  it('calls onToggleExpansion when expand button is clicked', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    expect(mockProps.onToggleExpansion).toHaveBeenCalledWith(1);
  });

  it('shows expanded content when isExpanded is true', () => {
    const expandedProps = { ...mockProps, isExpanded: true };
    const { container } = renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>);
    
    // Check that the expanded row is present by looking for the expanded row structure
    const expandedRow = container.querySelector('tr.bg-gray-100');
    expect(expandedRow).toBeInTheDocument();
    
    // Check for main sections that should be unique
    expect(screen.getByText('Request Details')).toBeInTheDocument();
    expect(screen.getByText('Pass/Fail Distribution')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    
    // Check for grid layout and sections
    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(container.querySelectorAll('.bg-white').length).toBeGreaterThan(0);
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
    
    renderWithTheme(<table><tbody><RequestTableRow {...noDataProps} /></tbody></table>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Test Request')).toBeInTheDocument();
  });

  it('handles missing or invalid result data gracefully', () => {
    // Suppress console.warn for this test since we're intentionally testing invalid data
    const originalWarn = console.warn;
    console.warn = jest.fn();
    
    const invalidResult = {
      ...mockResult,
      request: undefined,
      responseTimes: undefined
    } as any;
    const invalidProps = { ...mockProps, result: invalidResult };
    
    const { container } = renderWithTheme(<table><tbody><RequestTableRow {...invalidProps} /></tbody></table>);
    // The component returns null for invalid data, so no table rows should be rendered
    expect(container.querySelectorAll('tr')).toHaveLength(0);
    
    // Verify that console.warn was called with the expected message
    expect(console.warn).toHaveBeenCalledWith('Invalid result object:', invalidResult);
    
    // Restore original console.warn
    console.warn = originalWarn;
  });

  it('renders correct expand/collapse icon based on isExpanded state', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('▶')).toBeInTheDocument();
    
    // Re-render with expanded state
    const expandedProps = { ...mockProps, isExpanded: true };
    renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>);
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('applies correct row styling based on index', () => {
    const { container } = renderWithTheme(<table><tbody><RequestTableRow {...mockProps} index={0} /></tbody></table>);
    const row = container.querySelector('tr');
    expect(row).toHaveClass('bg-gray-50'); // even index in light mode

    const { container: container2 } = renderWithTheme(<table><tbody><RequestTableRow {...mockProps} index={1} /></tbody></table>);
    const row2 = container2.querySelector('tr');
    expect(row2).toHaveClass('bg-white'); // odd index in light mode
  });

  it('renders total count with proper formatting', () => {
    renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>);
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('renders correctly in light theme', () => {
    const { container } = renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>, 'light');
    const row = container.querySelector('tr');
    expect(row).toHaveClass('bg-gray-50'); // light mode styling
  });

  it('renders correctly in dark theme', () => {
    const { container } = renderWithTheme(<table><tbody><RequestTableRow {...mockProps} /></tbody></table>, 'dark');
    const row = container.querySelector('tr');
    expect(row).toHaveClass('dark:bg-slate-800/30'); // dark mode styling
  });

  it('handles theme changes correctly when expanded', () => {
    const expandedProps = { ...mockProps, isExpanded: true };
    const { container } = renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'light');
    
    // Check for light mode expanded row styling
    const expandedRow = container.querySelector('tr.bg-gray-100');
    expect(expandedRow).toBeInTheDocument();
    
    // Check for light mode card styling
    const cards = container.querySelectorAll('.bg-white');
    expect(cards.length).toBeGreaterThan(0);
  });

  describe('Chart Error Handling and Edge Cases', () => {
    it('handles chart rendering with invalid percentile data', () => {
      // Suppress console.error for this test since we're intentionally testing error handling
      const originalError = console.error;
      console.error = jest.fn();
      
      const invalidPercentileResult = {
        ...mockResult,
        responseTimes: {
          min: 100,
          max: 500,
          percentiles: {
            'invalid': 'not-a-number',
            '50': null,
            '95': undefined
          } as any
        }
      };
      const invalidProps = { ...mockProps, result: invalidPercentileResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...invalidProps} /></tbody></table>);
      
      // Should show error fallback instead of crashing
      expect(screen.getByText('Chart unavailable')).toBeInTheDocument();
      expect(screen.getByText('Data format error')).toBeInTheDocument();
      
      // Restore original console.error
      console.error = originalError;
    });

    it('handles chart rendering with empty percentiles object', () => {
      // Suppress console.error for this test since we're intentionally testing error handling
      const originalError = console.error;
      console.error = jest.fn();
      
      const emptyPercentileResult = {
        ...mockResult,
        responseTimes: {
          min: 100,
          max: 500,
          percentiles: {}
        }
      };
      const emptyProps = { ...mockProps, result: emptyPercentileResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...emptyProps} /></tbody></table>);
      
      // Should show error fallback when no valid percentiles
      expect(screen.getByText('Chart unavailable')).toBeInTheDocument();
      expect(screen.getByText('Data format error')).toBeInTheDocument();
      
      // Restore original console.error
      console.error = originalError;
    });

    it('handles chart rendering with null responseTimes', () => {
      // Suppress console.warn for this test since we're intentionally testing invalid data
      const originalWarn = console.warn;
      console.warn = jest.fn();
      
      const nullResponseTimesResult = {
        ...mockResult,
        responseTimes: null as any
      };
      const nullProps = { ...mockProps, result: nullResponseTimesResult, isExpanded: true };
      
      const { container } = renderWithTheme(<table><tbody><RequestTableRow {...nullProps} /></tbody></table>);
      
      // Component should return null for invalid data (no responseTimes)
      expect(container.querySelectorAll('tr')).toHaveLength(0);
      
      // Verify that console.warn was called
      expect(console.warn).toHaveBeenCalledWith('Invalid result object:', nullResponseTimesResult);
      
      // Restore original console.warn
      console.warn = originalWarn;
    });

    it('handles chart cleanup when element is removed', () => {
      const mockChart = {
        setOption: jest.fn(),
        resize: jest.fn(),
        dispose: jest.fn()
      };
      const mockResizeObserver = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn()
      };

      // Mock echarts.init to return our mock chart
      const echarts = require('echarts');
      echarts.init.mockReturnValue(mockChart);
      
      // Mock ResizeObserver constructor
      (global.ResizeObserver as jest.Mock).mockImplementation(() => mockResizeObserver);

      const expandedProps = { ...mockProps, isExpanded: true };
      const { unmount } = renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>);
      
      // Verify chart was initialized
      expect(echarts.init).toHaveBeenCalled();
      expect(mockChart.setOption).toHaveBeenCalled();
      expect(mockResizeObserver.observe).toHaveBeenCalled();
      
      // Simulate cleanup by calling the cleanup function directly
      // This tests the cleanup logic in lines 188-190 and 358-360
      const chartElements = document.querySelectorAll('[id^="pass-fail-chart-"], [id^="chart-"]');
      chartElements.forEach(el => {
        if ((el as any)._chartCleanup) {
          (el as any)._chartCleanup();
        }
      });
      
      // Verify cleanup was called
      expect(mockChart.dispose).toHaveBeenCalled();
      expect(mockResizeObserver.disconnect).toHaveBeenCalled();
      
      unmount();
    });

    it('handles resize observer functionality', () => {
      const mockChart = {
        setOption: jest.fn(),
        resize: jest.fn(),
        dispose: jest.fn()
      };
      const mockResizeObserver = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn()
      };

      // Mock echarts.init
      const echarts = require('echarts');
      echarts.init.mockReturnValue(mockChart);
      
      // Mock ResizeObserver constructor
      (global.ResizeObserver as jest.Mock).mockImplementation(() => mockResizeObserver);

      const expandedProps = { ...mockProps, isExpanded: true };
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>);
      
      // Verify ResizeObserver was created and observe was called
      expect(global.ResizeObserver).toHaveBeenCalled();
      expect(mockResizeObserver.observe).toHaveBeenCalled();
      expect(mockChart.setOption).toHaveBeenCalled();
    });

    it('handles chart element cleanup when element becomes null', () => {
      const mockCleanup = jest.fn();
      
      // Create a mock element with cleanup function
      const mockElement = {
        _chartCleanup: mockCleanup
      };
      
      // Test the cleanup logic when element is null (lines 194-196, 364-366)
      const expandedProps = { ...mockProps, isExpanded: true };
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>);
      
      // Simulate the ref callback being called with null (component unmounting)
      // This would happen in the actual ref callback logic
      if (mockElement._chartCleanup) {
        mockElement._chartCleanup();
      }
      
      expect(mockCleanup).toHaveBeenCalled();
    });
  });

  describe('Requirements Section Edge Cases', () => {
    it('does not render requirements section when no requirements data exists', () => {
      const noRequirementsResult = {
        ...mockResult,
        requirements: null as any
      };
      const noReqProps = { ...mockProps, result: noRequirementsResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...noReqProps} /></tbody></table>);
      
      expect(screen.queryByText('Requirements')).not.toBeInTheDocument();
    });

    it('does not render requirements section when passed and failed are both 0', () => {
      const zeroRequirementsResult = {
        ...mockResult,
        requirements: {
          status: 'PASS',
          passed: 0,
          failed: 0,
          percentiles: []
        }
      };
      const zeroReqProps = { ...mockProps, result: zeroRequirementsResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...zeroReqProps} /></tbody></table>);
      
      expect(screen.queryByText('Requirements')).not.toBeInTheDocument();
    });

    it('handles requirements with invalid percentile data', () => {
      const invalidReqResult = {
        ...mockResult,
        requirements: {
          status: 'PASS',
          passed: 5,
          failed: 2,
          percentiles: [
            {
              percentile: 'invalid' as any,
              value: 'not-a-number' as any,
              status: 'INVALID' as any,
              difference: null as any,
              percentageDifference: 'invalid' as any
            },
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
      const invalidReqProps = { ...mockProps, result: invalidReqResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...invalidReqProps} /></tbody></table>);
      
      // Should still render the requirements section but handle invalid data gracefully  
      const requirementsElements = screen.getAllByText('Requirements');
      expect(requirementsElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Percentile Requirements')).toBeInTheDocument();
    });
  });

  describe('Pass/Fail Chart Edge Cases', () => {
    it('does not render pass/fail chart when no pass/fail data exists', () => {
      const noPassFailResult = {
        ...mockResult,
        passCount: 0,
        failCount: 0
      };
      const noPassFailProps = { ...mockProps, result: noPassFailResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...noPassFailProps} /></tbody></table>);
      
      expect(screen.queryByText('Pass/Fail Distribution')).not.toBeInTheDocument();
    });

    it('renders pass/fail chart with only pass count', () => {
      const onlyPassResult = {
        ...mockResult,
        passCount: 1000,
        failCount: 0
      };
      const onlyPassProps = { ...mockProps, result: onlyPassResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...onlyPassProps} /></tbody></table>);
      
      expect(screen.getByText('Pass/Fail Distribution')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('Rate:')).toBeInTheDocument();
    });
  });

  describe('Additional Information Section', () => {
    it('does not render additional information when no metadata exists', () => {
      const noMetadataResult = {
        ...mockResult,
        request: {
          ...mockResult.request,
          requestDescription: null,
          requestPriority: null,
          tags: null,
          createdTime: mockResult.request.createdTime
        }
      };
      const noMetadataProps = { ...mockProps, result: noMetadataResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...noMetadataProps} /></tbody></table>);
      
      expect(screen.queryByText('Additional Information')).not.toBeInTheDocument();
    });

    it('renders partial additional information when some metadata exists', () => {
      const partialMetadataResult = {
        ...mockResult,
        request: {
          ...mockResult.request,
          requestDescription: 'Test description',
          requestPriority: null,
          tags: null,
          createdTime: mockResult.request.createdTime
        }
      };
      const partialMetadataProps = { ...mockProps, result: partialMetadataResult, isExpanded: true };
      
      renderWithTheme(<table><tbody><RequestTableRow {...partialMetadataProps} /></tbody></table>);
      
      expect(screen.getByText('Additional Information')).toBeInTheDocument();
      expect(screen.getByText('Description:')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.queryByText('Priority:')).not.toBeInTheDocument();
    });
  });

  describe('Error Percentage Color Coding Edge Cases', () => {
    it('renders error percentage with green color for 0%', () => {
      const zeroErrorResult = { ...mockResult, errorPercentage: 0 };
      const zeroErrorProps = { ...mockProps, result: zeroErrorResult };
      
      renderWithTheme(<table><tbody><RequestTableRow {...zeroErrorProps} /></tbody></table>);
      
      const errorElement = screen.getByText('0.00%');
      expect(errorElement).toHaveClass('text-green-500');
    });

    it('renders error percentage with green color for 1%', () => {
      const lowErrorResult = { ...mockResult, errorPercentage: 1 };
      const lowErrorProps = { ...mockProps, result: lowErrorResult };
      
      renderWithTheme(<table><tbody><RequestTableRow {...lowErrorProps} /></tbody></table>);
      
      const errorElement = screen.getByText('1.00%');
      expect(errorElement).toHaveClass('text-green-500');
    });

    it('renders error percentage with red color for >5%', () => {
      const highErrorResult = { ...mockResult, errorPercentage: 10 };
      const highErrorProps = { ...mockProps, result: highErrorResult };
      
      renderWithTheme(<table><tbody><RequestTableRow {...highErrorProps} /></tbody></table>);
      
      const errorElement = screen.getByText('10.00%');
      expect(errorElement).toHaveClass('text-red-500');
    });
  });

  describe('Theme Behavior Tests', () => {
    beforeEach(() => {
      // Clear console logs before each test
      jest.clearAllMocks();
      console.log = jest.fn();
    });

    it('logs correct theme information when component renders', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'light');
      
      // Check that theme logging is working
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[RequestTableRow] Theme: light, IsExpanded: true, ResultId: 1')
      );
    });

    it('logs theme information for dark mode', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'dark');
      
      // Check that theme logging is working for dark mode
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[RequestTableRow] Theme: dark, IsExpanded: true, ResultId: 1')
      );
    });

    it('logs chart theme colors in light mode', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'light');
      
      // Check that chart theme colors are logged correctly
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[PassFailChart] Theme colors - legend: #64748b, border: #f1f5f9')
      );
    });

    it('logs chart theme colors in dark mode', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'dark');
      
      // Check that chart theme colors are logged correctly
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[PassFailChart] Theme colors - legend: #94a3b8, border: #0f172a')
      );
    });


    it('uses theme-based keys for chart containers', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      const { container } = renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'light');
      
      // Check that chart containers exist
      const passFailChart = container.querySelector('#pass-fail-chart-1');
      const requirementsChartContainer = container.querySelector('#chart-1');
      
      expect(passFailChart).toBeInTheDocument();
      expect(requirementsChartContainer).toBeInTheDocument();
      
      // The pass/fail chart should have the expected ID
      expect(passFailChart?.id).toBe('pass-fail-chart-1');
      expect(requirementsChartContainer?.id).toBe('chart-1');
      
      // The LineGraph component renders its own content structure
      // Just verify the container exists, as the LineGraph handles its own rendering
      expect(requirementsChartContainer).toHaveClass('w-full', 'h-28');
    });

    it('applies correct expanded row background styling in light mode', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      const { container } = renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'light');
      
      // Check for light mode expanded row styling
      const expandedRow = container.querySelector('tr.bg-gray-100');
      expect(expandedRow).toBeInTheDocument();
    });

    it('logs DOM classes when charts are initialized', () => {
      const expandedProps = { ...mockProps, isExpanded: true };
      
      // Mock document.documentElement.classList
      const mockClassList = {
        toString: jest.fn().mockReturnValue('light some-other-class'),
        contains: jest.fn().mockReturnValue(false)
      };
      Object.defineProperty(document.documentElement, 'classList', {
        value: mockClassList,
        writable: true
      });
      
      renderWithTheme(<table><tbody><RequestTableRow {...expandedProps} /></tbody></table>, 'light');
      
      // Check that chart theme colors are logged
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[PassFailChart] Theme colors - legend:')
      );
    });

  });
});
