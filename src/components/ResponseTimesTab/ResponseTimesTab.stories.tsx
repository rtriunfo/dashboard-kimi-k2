import type { Meta, StoryObj } from '@storybook/react';
import ResponseTimesTab from './ResponseTimesTab';
import { TestResults } from '../../types';

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

const meta: Meta<typeof ResponseTimesTab> = {
  title: 'Components/ResponseTimesTab',
  component: ResponseTimesTab,
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

export const FastResponseTimes: Story = {
  args: {
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
      }
    }
  }
};

export const SlowResponseTimes: Story = {
  args: {
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
      }
    }
  }
};

export const HighVariability: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 10,
        max: 50000,
        percentiles: {
          '50.0': 200,
          '75.0': 1000,
          '90.0': 5000,
          '95.0': 15000,
          '99.0': 45000
        }
      }
    }
  }
};

export const LowVariability: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 95,
        max: 105,
        percentiles: {
          '50.0': 100,
          '75.0': 101,
          '90.0': 102,
          '95.0': 103,
          '99.0': 104
        }
      }
    }
  }
};

export const ExtremeValues: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 1,
        max: 120000,
        percentiles: {
          '50.0': 50,
          '75.0': 100,
          '90.0': 500,
          '95.0': 2000,
          '99.0': 60000
        }
      }
    }
  }
};

export const MediumPerformance: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 100,
        max: 5000,
        percentiles: {
          '50.0': 500,
          '75.0': 1000,
          '90.0': 2000,
          '95.0': 3000,
          '99.0': 4500
        }
      }
    }
  }
};

export const OptimalPerformance: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 20,
        max: 200,
        percentiles: {
          '50.0': 50,
          '75.0': 75,
          '90.0': 100,
          '95.0': 130,
          '99.0': 180
        }
      }
    }
  }
};
