import type { Meta, StoryObj } from '@storybook/react';
import DashboardHeader from './DashboardHeader';
import { TestResults } from '../../types';
import { TestScenario } from '../../config/testReportAdapter';

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

const defaultArgs = {
  testData: mockTestData,
  selectedScenario: 'test-scenario',
  currentScenario: mockScenario,
  availableScenarios: [mockScenario],
  isLoading: false,
  isScenarioDropdownOpen: false,
  onScenarioChange: () => {},
  onToggleDropdown: () => {},
  onCloseDropdown: () => {},
};

const meta: Meta<typeof DashboardHeader> = {
  title: 'Components/DashboardHeader',
  component: DashboardHeader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' }
      ]
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: defaultArgs
};

export const PassedTest: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      status: 'PASSED',
      errorRate: 0.01
    }
  }
};

export const FailedTest: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      status: 'FAILED',
      errorRate: 0.15
    }
  }
};

export const HighVolumeTest: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      totalRequests: 1000000,
      rate: 5000,
      duration: 3600, // 1 hour
      test: {
        id: 1,
        type: 'Load Test',
        description: 'High Volume Load Test - 1M Requests',
        simulationName: 'HighVolumeSimulation'
      }
    }
  }
};

export const LongDurationTest: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      duration: 90061, // 1 day, 1 hour, 1 minute, 1 second
      test: {
        id: 1,
        type: 'Endurance Test',
        description: 'Long Running Endurance Test',
        simulationName: 'EnduranceSimulation'
      }
    }
  }
};

export const HighErrorRate: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      status: 'FAILED',
      errorRate: 0.25,
      test: {
        id: 1,
        type: 'Stress Test',
        description: 'High Error Rate Stress Test',
        simulationName: 'StressTestSimulation'
      }
    }
  }
};

export const FastResponseTimes: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 5,
        max: 100,
        percentiles: {
          '50.0': 15,
          '75.0': 25,
          '90.0': 40,
          '95.0': 60,
          '99.0': 85
        }
      },
      test: {
        id: 1,
        type: 'Performance Test',
        description: 'Optimized API Performance Test',
        simulationName: 'OptimizedSimulation'
      }
    }
  }
};

export const SlowResponseTimes: Story = {
  args: {
    ...defaultArgs,
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 1000,
        max: 30000,
        percentiles: {
          '50.0': 5000,
          '75.0': 10000,
          '90.0': 15000,
          '95.0': 20000,
          '99.0': 25000
        }
      },
      test: {
        id: 1,
        type: 'Load Test',
        description: 'Heavy Database Load Test',
        simulationName: 'DatabaseLoadSimulation'
      }
    }
  }
};

export const MultipleScenarios: Story = {
  args: {
    ...defaultArgs,
    availableScenarios: [
      { id: 'scenario-1', name: 'Peak Hour Test', data: mockTestData },
      { id: 'scenario-2', name: 'Off Peak Test', data: mockTestData },
      { id: 'scenario-3', name: 'Stress Test', data: mockTestData }
    ],
    selectedScenario: 'scenario-1'
  }
};

export const LoadingState: Story = {
  args: {
    ...defaultArgs,
    isLoading: true
  }
};

export const DropdownOpen: Story = {
  args: {
    ...defaultArgs,
    isScenarioDropdownOpen: true,
    availableScenarios: [
      { id: 'scenario-1', name: 'Peak Hour Test', data: mockTestData },
      { id: 'scenario-2', name: 'Off Peak Test', data: mockTestData }
    ]
  }
};
