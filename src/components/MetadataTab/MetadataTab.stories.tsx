import type { Meta, StoryObj } from '@storybook/react';
import MetadataTab from './MetadataTab';
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

const meta: Meta<typeof MetadataTab> = {
  title: 'Components/MetadataTab',
  component: MetadataTab,
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

export const ProductionEnvironment: Story = {
  args: {
    testData: {
      ...mockTestData,
      environment: 'production',
      branch: 'release/v2.1.0',
      gitHash: 'a1b2c3d4e5f6g7h8i9j0',
      testRequirements: true
    }
  }
};

export const DevelopmentEnvironment: Story = {
  args: {
    testData: {
      ...mockTestData,
      environment: 'development',
      branch: 'feature/new-api',
      gitHash: 'dev123abc456def789',
      testRequirements: false
    }
  }
};

export const StagingEnvironment: Story = {
  args: {
    testData: {
      ...mockTestData,
      environment: 'staging',
      branch: 'staging',
      gitHash: 'staging789xyz123',
      testRequirements: true,
      test: {
        id: 1,
        type: 'Stress Test',
        description: 'Pre-production validation',
        simulationName: 'StagingValidationSimulation'
      }
    }
  }
};

export const MissingOptionalData: Story = {
  args: {
    testData: {
      ...mockTestData,
      environment: null,
      branch: null,
      gitHash: null,
      testRequirements: false
    }
  }
};

export const LongFilePaths: Story = {
  args: {
    testData: {
      ...mockTestData,
      gatlingReportLocation: '/very/long/path/to/gatling/reports/simulation-20240115-100000/index.html',
      gatlingLogLocation: '/very/long/path/to/gatling/logs/simulation-20240115-100000/simulation.log',
      requirementsFileLocation: '/very/long/path/to/requirements/files/test-requirements-v1.0.0.json'
    }
  }
};

export const NewerVersions: Story = {
  args: {
    testData: {
      ...mockTestData,
      gatlingVersion: '4.2.1',
      parserVersion: '2.5.0',
      severityVersion: '3.1.0',
      requirementsVersion: '4.0.0',
      rateGranularity: 'millisecond'
    }
  }
};

export const OlderVersions: Story = {
  args: {
    testData: {
      ...mockTestData,
      gatlingVersion: '2.8.0',
      parserVersion: '0.9.0',
      severityVersion: '0.5.0',
      requirementsVersion: '0.8.0',
      rateGranularity: 'minute'
    }
  }
};

export const DifferentTestTypes: Story = {
  args: {
    testData: {
      ...mockTestData,
      test: {
        id: 1,
        type: 'Spike Test',
        description: 'Testing system behavior under sudden load spikes',
        simulationName: 'SpikeTestSimulation'
      }
    }
  }
};

export const RecentTest: Story = {
  args: {
    testData: {
      ...mockTestData,
      createdTime: new Date().toISOString(),
      startTime: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
    }
  }
};
