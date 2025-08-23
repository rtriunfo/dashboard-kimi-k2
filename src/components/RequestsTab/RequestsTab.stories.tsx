import type { Meta, StoryObj } from '@storybook/react';
import RequestsTab from './RequestsTab';
import { TestResults } from '../../types';

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

const meta: Meta<typeof RequestsTab> = {
  title: 'Components/RequestsTab',
  component: RequestsTab,
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
  args: {
    testData: mockTestData
  }
};

export const HighVolumeTest: Story = {
  args: {
    testData: {
      ...mockTestData,
      totalRequests: 50000,
      rate: 1000
    }
  }
};

export const LowVolumeTest: Story = {
  args: {
    testData: {
      ...mockTestData,
      totalRequests: 100,
      rate: 10
    }
  }
};

export const StressTest: Story = {
  args: {
    testData: {
      ...mockTestData,
      test: {
        id: 1,
        type: 'Stress Test',
        description: 'High load stress testing',
        simulationName: 'StressTestSimulation'
      },
      totalRequests: 25000,
      rate: 500,
      errorRate: 0.05
    }
  }
};
