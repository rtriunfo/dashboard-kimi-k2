import type { Meta, StoryObj } from '@storybook/react';
import SummaryTab from './SummaryTab';
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

const meta: Meta<typeof SummaryTab> = {
  title: 'Components/SummaryTab',
  component: SummaryTab,
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

export const HighErrorRate: Story = {
  args: {
    testData: {
      ...mockTestData,
      errorRate: 0.15,
      requestStats: {
        successful: 850,
        failed: 150,
        total: 1000
      },
      assertionStats: {
        passed: 800,
        failed: 200,
        total: 1000
      },
      severityStats: {
        minor: 50,
        major: 25,
        critical: 10,
        total: 85
      }
    }
  }
};

export const PerfectTest: Story = {
  args: {
    testData: {
      ...mockTestData,
      errorRate: 0,
      requestStats: {
        successful: 1000,
        failed: 0,
        total: 1000
      },
      assertionStats: {
        passed: 1000,
        failed: 0,
        total: 1000
      },
      severityStats: {
        minor: 0,
        major: 0,
        critical: 0,
        total: 0
      }
    }
  }
};

export const SlowResponseTimes: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 500,
        max: 10000,
        percentiles: {
          '50.0': 2000,
          '75.0': 3500,
          '90.0': 5000,
          '95.0': 7000,
          '99.0': 9500
        }
      }
    }
  }
};

export const FastResponseTimes: Story = {
  args: {
    testData: {
      ...mockTestData,
      responseTimes: {
        min: 10,
        max: 200,
        percentiles: {
          '50.0': 25,
          '75.0': 45,
          '90.0': 75,
          '95.0': 120,
          '99.0': 180
        }
      }
    }
  }
};

export const LargeScale: Story = {
  args: {
    testData: {
      ...mockTestData,
      totalRequests: 100000,
      rate: 5000,
      requestStats: {
        successful: 98500,
        failed: 1500,
        total: 100000
      },
      assertionStats: {
        passed: 97000,
        failed: 3000,
        total: 100000
      }
    }
  }
};

export const SmallScale: Story = {
  args: {
    testData: {
      ...mockTestData,
      totalRequests: 50,
      rate: 10,
      requestStats: {
        successful: 48,
        failed: 2,
        total: 50
      },
      assertionStats: {
        passed: 45,
        failed: 5,
        total: 50
      },
      severityStats: {
        minor: 1,
        major: 0,
        critical: 0,
        total: 1
      }
    }
  }
};

export const HighSeverityIssues: Story = {
  args: {
    testData: {
      ...mockTestData,
      severityStats: {
        minor: 100,
        major: 50,
        critical: 25,
        total: 175
      }
    }
  }
};
