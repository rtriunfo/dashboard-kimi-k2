import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { getTestScenario, getAvailableScenarios } from './config/testReportAdapter';

// Mock all child components
jest.mock('./components/TabNavigation', () => {
  return function MockTabNavigation({ activeTab, onTabChange }: any) {
    return (
      <div data-testid="tab-navigation">
        <button onClick={() => onTabChange('summary')} data-testid="summary-tab">
          Summary {activeTab === 'summary' && '(active)'}
        </button>
        <button onClick={() => onTabChange('responseTimes')} data-testid="response-times-tab">
          Response Times {activeTab === 'responseTimes' && '(active)'}
        </button>
        <button onClick={() => onTabChange('requests')} data-testid="requests-tab">
          Requests {activeTab === 'requests' && '(active)'}
        </button>
        <button onClick={() => onTabChange('metadata')} data-testid="metadata-tab">
          Metadata {activeTab === 'metadata' && '(active)'}
        </button>
      </div>
    );
  };
});

jest.mock('./components/LoadingSpinner', () => {
  return function MockLoadingSpinner({ message }: any) {
    return <div data-testid="loading-spinner">{message}</div>;
  };
});

jest.mock('./components/DashboardHeader', () => {
  return function MockDashboardHeader({ 
    selectedScenario, 
    onScenarioChange, 
    onToggleDropdown,
    onCloseDropdown,
    isScenarioDropdownOpen,
    availableScenarios 
  }: any) {
    return (
      <div data-testid="dashboard-header">
        <div data-testid="selected-scenario">{selectedScenario}</div>
        <button 
          onClick={onToggleDropdown}
          data-testid="dropdown-toggle"
        >
          Toggle Dropdown {isScenarioDropdownOpen && '(open)'}
        </button>
        <button onClick={onCloseDropdown} data-testid="close-dropdown">Close</button>
        {availableScenarios.map((scenario: any) => (
          <button 
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            data-testid={`scenario-${scenario.id}`}
          >
            {scenario.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('./components/SummaryTab', () => {
  return function MockSummaryTab({ testData }: any) {
    return <div data-testid="summary-tab-content">Summary: {testData?.totalRequests || 0} requests</div>;
  };
});

jest.mock('./components/ResponseTimesTab', () => {
  return function MockResponseTimesTab({ testData }: any) {
    return <div data-testid="response-times-tab-content">Response Times: {testData?.duration || 0}s</div>;
  };
});

jest.mock('./components/RequestsTab', () => {
  return function MockRequestsTab({ testData }: any) {
    return <div data-testid="requests-tab-content">Requests: {testData?.requestResults?.length || 0} items</div>;
  };
});

jest.mock('./components/MetadataTab', () => {
  return function MockMetadataTab({ testData }: any) {
    return <div data-testid="metadata-tab-content">Metadata: {testData?.gatlingVersion || 'N/A'}</div>;
  };
});

jest.mock('./components/DashboardFooter', () => {
  return function MockDashboardFooter({ gatlingVersion, parserVersion }: any) {
    return (
      <div data-testid="dashboard-footer">
        Gatling: {gatlingVersion}, Parser: {parserVersion}
      </div>
    );
  };
});

// Mock the config adapter to avoid import.meta.glob issues
jest.mock('./config/testReportAdapter');

const mockGetTestScenario = getTestScenario as jest.MockedFunction<typeof getTestScenario>;
const mockGetAvailableScenarios = getAvailableScenarios as jest.MockedFunction<typeof getAvailableScenarios>;

describe('App', () => {
  const mockTestData = {
    id: 1,
    test: {
      id: 1,
      description: 'Peak Hour Load Test',
      type: 'load',
      simulationName: 'PeakHourSimulation'
    },
    status: 'completed',
    startTime: '2023-08-24T10:00:00Z',
    duration: 300,
    branch: 'main',
    gatlingVersion: '3.8.0',
    parserVersion: '1.0.0',
    environment: 'production',
    gitHash: 'abc123',
    totalRequests: 1000,
    errorRate: 0.05,
    rate: 50,
    rateGranularity: 'per_second',
    responseTimes: {
      min: 10,
      max: 500,
      percentiles: {
        '50': 100,
        '95': 200,
        '99': 300
      }
    },
    requestStats: {
      total: 1000,
      passed: 950,
      failed: 50,
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
      critical: 0,
      major: 2,
      minor: 5,
      none: 993
    },
    gatlingReportLocation: '/reports/gatling',
    gatlingLogLocation: '/logs/gatling',
    testRequirements: true,
    requirementsFileLocation: '/requirements.json',
    createdTime: '2023-08-24T10:00:00Z',
    severityVersion: '1.0.0',
    requirementsVersion: '1.0.0',
    requestResults: [
      {
        id: 1,
        request: {
          id: 1,
          requestName: 'Test Request 1',
          requestDescription: 'First test request',
          requestPriority: 'high',
          tags: 'api,critical',
          createdTime: '2023-08-24T10:00:00Z'
        },
        severity: 'minor',
        totalCount: 500,
        passCount: 475,
        failCount: 25,
        errorPercentage: 5,
        rate: 25,
        rateGranularity: 'per_second',
        responseTimes: {
          min: 10,
          max: 200,
          percentiles: {
            '50': 50,
            '95': 100,
            '99': 150
          }
        },
        status: 'completed',
        testRequirements: true,
        statistics: true,
        requirements: {
          status: 'passed',
          passed: 3,
          failed: 0,
          percentiles: [
            {
              status: 'passed',
              percentile: 95,
              value: 100,
              difference: -10,
              percentageDifference: -9.09
            }
          ]
        }
      },
      {
        id: 2,
        request: {
          id: 2,
          requestName: 'Test Request 2',
          requestDescription: 'Second test request',
          requestPriority: 'medium',
          tags: 'api,standard',
          createdTime: '2023-08-24T10:00:00Z'
        },
        severity: 'major',
        totalCount: 500,
        passCount: 475,
        failCount: 25,
        errorPercentage: 5,
        rate: 25,
        rateGranularity: 'per_second',
        responseTimes: {
          min: 15,
          max: 300,
          percentiles: {
            '50': 75,
            '95': 150,
            '99': 200
          }
        },
        status: 'completed',
        testRequirements: true,
        statistics: true,
        requirements: {
          status: 'passed',
          passed: 2,
          failed: 1,
          percentiles: [
            {
              status: 'failed',
              percentile: 95,
              value: 150,
              difference: 25,
              percentageDifference: 20
            }
          ]
        }
      }
    ]
  };

  const mockScenario = {
    id: 'test-report-data',
    name: 'Peak Hour Load Test',
    description: 'Test scenario',
    data: mockTestData
  };

  const mockAvailableScenarios = [
    mockScenario,
    {
      id: 'scenario-2',
      name: 'Stress Test',
      description: 'Stress test scenario',
      data: { ...mockTestData, totalRequests: 2000, test: { ...mockTestData.test, description: 'Stress Test' } }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAvailableScenarios.mockResolvedValue(mockAvailableScenarios);
    mockGetTestScenario.mockResolvedValue(mockScenario);
  });

  describe('Initial Rendering and Loading States', () => {
    it('shows loading spinner initially', async () => {
      // Delay the mock resolution to catch the loading state
      mockGetAvailableScenarios.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockAvailableScenarios), 100))
      );
      mockGetTestScenario.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockScenario), 100))
      );

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('renders main content after loading completes', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
      expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('summary-tab-content')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-footer')).toBeInTheDocument();
    });

    it('applies correct CSS classes and structure', async () => {
      let container: any;
      await act(async () => {
        const result = render(<App />);
        container = result.container;
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'via-indigo-50', 'to-purple-50');
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('px-4', 'py-8', 'mx-auto', 'max-w-7xl', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Data Loading and Error Handling', () => {
    it('loads scenarios on mount', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(mockGetAvailableScenarios).toHaveBeenCalledTimes(1);
        expect(mockGetTestScenario).toHaveBeenCalledWith('test-report-data');
      });
    });

    it('handles scenario loading errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetAvailableScenarios.mockRejectedValue(new Error('Network error'));

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('❌ [App] Failed to load scenarios:', expect.any(Error));
      });

      // Should still show loading spinner when data fails to load
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('handles empty scenarios list', async () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetAvailableScenarios.mockResolvedValue([]);

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(consoleWarn).toHaveBeenCalledWith('⚠️ [App] No scenarios found!');
      });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('handles null scenario data', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetTestScenario.mockResolvedValue(null as any);

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('❌ [App] Failed to load scenario:', 'test-report-data');
      });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('logs data metrics when testData changes', async () => {
      const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      expect(consoleLog).toHaveBeenCalledWith('🔄 Header cards re-rendering with scenario:', 'test-report-data');
      expect(consoleLog).toHaveBeenCalledWith('📊 Current data metrics:', {
        totalRequests: 1000,
        duration: 300,
        errorRate: 0.05,
        rate: 50,
        severityMinor: 5
      });

      consoleLog.mockRestore();
    });
  });

  describe('Tab Navigation Functionality', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<App />);
      });
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('starts with summary tab active', () => {
      expect(screen.getByText('Summary (active)')).toBeInTheDocument();
      expect(screen.getByTestId('summary-tab-content')).toBeInTheDocument();
    });

    it('switches to response times tab when clicked', async () => {
      await act(async () => {
        fireEvent.click(screen.getByTestId('response-times-tab'));
      });

      await waitFor(() => {
        expect(screen.getByText('Response Times (active)')).toBeInTheDocument();
        expect(screen.getByTestId('response-times-tab-content')).toBeInTheDocument();
        expect(screen.queryByTestId('summary-tab-content')).not.toBeInTheDocument();
      });
    });

    it('switches to requests tab when clicked', async () => {
      await act(async () => {
        fireEvent.click(screen.getByTestId('requests-tab'));
      });

      await waitFor(() => {
        expect(screen.getByText('Requests (active)')).toBeInTheDocument();
        expect(screen.getByTestId('requests-tab-content')).toBeInTheDocument();
        expect(screen.queryByTestId('summary-tab-content')).not.toBeInTheDocument();
      });
    });

    it('switches to metadata tab when clicked', async () => {
      await act(async () => {
        fireEvent.click(screen.getByTestId('metadata-tab'));
      });

      await waitFor(() => {
        expect(screen.getByText('Metadata (active)')).toBeInTheDocument();
        expect(screen.getByTestId('metadata-tab-content')).toBeInTheDocument();
        expect(screen.queryByTestId('summary-tab-content')).not.toBeInTheDocument();
      });
    });

    it('passes correct testData to all tab components', async () => {
      expect(screen.getByText('Summary: 1000 requests')).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('response-times-tab'));
      });
      expect(screen.getByText('Response Times: 300s')).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('requests-tab'));
      });
      expect(screen.getByText('Requests: 2 items')).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('metadata-tab'));
      });
      expect(screen.getByText('Metadata: 3.8.0')).toBeInTheDocument();
    });
  });

  describe('Scenario Selection and Data Updates', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<App />);
      });
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('displays current selected scenario', () => {
      expect(screen.getByTestId('selected-scenario')).toHaveTextContent('test-report-data');
    });

    it('shows available scenarios in header', () => {
      expect(screen.getByTestId('scenario-test-report-data')).toBeInTheDocument();
      expect(screen.getByTestId('scenario-scenario-2')).toBeInTheDocument();
    });

    it('changes scenario when different scenario is selected', async () => {
      const newScenario = {
        id: 'scenario-2',
        name: 'Stress Test',
        description: 'Stress test scenario',
        data: { ...mockTestData, totalRequests: 2000, test: { ...mockTestData.test, description: 'Stress Test' } }
      };
      mockGetTestScenario.mockResolvedValue(newScenario);

      await act(async () => {
        fireEvent.click(screen.getByTestId('scenario-scenario-2'));
      });

      await waitFor(() => {
        expect(mockGetTestScenario).toHaveBeenCalledWith('scenario-2');
      });

      await waitFor(() => {
        expect(screen.getByText('Summary: 2000 requests')).toBeInTheDocument();
      });
    });

    it('handles dropdown toggle functionality', async () => {
      const dropdownToggle = screen.getByTestId('dropdown-toggle');
      
      expect(dropdownToggle).toHaveTextContent('Toggle Dropdown');
      
      await act(async () => {
        fireEvent.click(dropdownToggle);
      });
      expect(dropdownToggle).toHaveTextContent('Toggle Dropdown (open)');
    });

    it('handles dropdown close functionality', async () => {
      // Open dropdown first
      await act(async () => {
        fireEvent.click(screen.getByTestId('dropdown-toggle'));
      });
      expect(screen.getByText('Toggle Dropdown (open)')).toBeInTheDocument();
      
      // Close dropdown
      await act(async () => {
        fireEvent.click(screen.getByTestId('close-dropdown'));
      });
      expect(screen.getByText('Toggle Dropdown')).toBeInTheDocument();
    });
  });

  describe('Component Mounting and Unmounting', () => {
    it('properly mounts all child components with correct props', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Verify all components are mounted
      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
      expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('summary-tab-content')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-footer')).toBeInTheDocument();
      
      // Verify footer receives correct props
      expect(screen.getByText('Gatling: 3.8.0, Parser: 1.0.0')).toBeInTheDocument();
    });

    it('unmounts cleanly without errors', async () => {
      let unmount: any;
      await act(async () => {
        const result = render(<App />);
        unmount = result.unmount;
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid scenario changes without race conditions', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Reset mock call count after initial load
      mockGetTestScenario.mockClear();

      // Simulate rapid scenario changes
      await act(async () => {
        fireEvent.click(screen.getByTestId('scenario-scenario-2'));
      });
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('scenario-test-report-data'));
      });
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('scenario-scenario-2'));
      });

      // Should handle multiple calls gracefully (3 changes after initial load)
      expect(mockGetTestScenario).toHaveBeenCalledTimes(3);
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes to main container', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('sm:px-6', 'lg:px-8');
    });

    it('maintains layout structure across different viewport sizes', async () => {
      let container: any;
      await act(async () => {
        const result = render(<App />);
        container = result.container;
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Verify the nested structure is maintained
      const mainContainer = container.firstChild as HTMLElement;
      const relativeContainer = mainContainer.querySelector('.relative.z-10');
      expect(relativeContainer).toBeInTheDocument();
      
      const mainElement = relativeContainer?.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('completes full user workflow: load → navigate tabs → change scenario', async () => {
      await act(async () => {
        render(<App />);
      });

      // 1. Wait for initial load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // 2. Verify initial state
      expect(screen.getByText('Summary (active)')).toBeInTheDocument();
      expect(screen.getByText('Summary: 1000 requests')).toBeInTheDocument();

      // 3. Navigate to different tab
      await act(async () => {
        fireEvent.click(screen.getByTestId('response-times-tab'));
      });
      await waitFor(() => {
        expect(screen.getByText('Response Times (active)')).toBeInTheDocument();
        expect(screen.getByText('Response Times: 300s')).toBeInTheDocument();
      });

      // 4. Change scenario
      const newScenario = {
        id: 'scenario-2',
        name: 'Stress Test',
        description: 'Stress test scenario',
        data: { ...mockTestData, totalRequests: 2000, duration: 600, test: { ...mockTestData.test, description: 'Stress Test' } }
      };
      mockGetTestScenario.mockResolvedValue(newScenario);

      await act(async () => {
        fireEvent.click(screen.getByTestId('scenario-scenario-2'));
      });

      // 5. Verify data updates in current tab
      await waitFor(() => {
        expect(screen.getByText('Response Times: 600s')).toBeInTheDocument();
      });

      // 6. Verify data persists when switching back to summary
      await act(async () => {
        fireEvent.click(screen.getByTestId('summary-tab'));
      });
      await waitFor(() => {
        expect(screen.getByText('Summary: 2000 requests')).toBeInTheDocument();
      });
    });

    it('handles error recovery and retry scenarios', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Start with error
      mockGetTestScenario.mockRejectedValueOnce(new Error('Network error'));
      
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      // Should still show loading
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe('State Management', () => {
    it('maintains independent state for different UI elements', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Change tab
      await act(async () => {
        fireEvent.click(screen.getByTestId('requests-tab'));
      });
      
      // Open dropdown
      await act(async () => {
        fireEvent.click(screen.getByTestId('dropdown-toggle'));
      });
      
      // Verify both states are maintained
      expect(screen.getByText('Requests (active)')).toBeInTheDocument();
      expect(screen.getByText('Toggle Dropdown (open)')).toBeInTheDocument();
    });

    it('resets loading state correctly after scenario changes', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Change scenario - this should trigger loading state
      const newScenario = { ...mockScenario, id: 'scenario-2' };
      mockGetTestScenario.mockResolvedValue(newScenario);

      await act(async () => {
        fireEvent.click(screen.getByTestId('scenario-scenario-2'));
      });

      // Should eventually resolve and show content again
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });
});
