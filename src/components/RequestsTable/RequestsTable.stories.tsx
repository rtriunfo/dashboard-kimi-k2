import type { Meta, StoryObj } from '@storybook/react';
import RequestsTable from './RequestsTable';
import { TestResults } from '../../types';
import { ThemeProvider } from '../../contexts/ThemeContext';

const meta: Meta<typeof RequestsTable> = {
  title: 'Components/RequestsTable',
  component: RequestsTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive table component for displaying and managing request test results with filtering, sorting, and expansion capabilities.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    testData: {
      description: 'Test results data containing request results and metadata',
      control: { type: 'object' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof RequestsTable>;

// Sample test data for stories
const sampleTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Peak Hour Load Test',
    type: 'Load Test',
    simulationName: 'PeakHourSimulation'
  },
  status: 'PASS',
  startTime: '2024-01-01T00:00:00Z',
  duration: 3600,
  branch: 'main',
  gatlingVersion: '3.9.0',
  parserVersion: '1.0.0',
  environment: 'production',
  gitHash: 'abc123def',
  totalRequests: 5000,
  errorRate: 0.02,
  rate: 150,
  rateGranularity: 'minute',
  responseTimes: {
    min: 45,
    max: 500,
    percentiles: { '50': 120, '95': 400 }
  },
  requestStats: { total: 5000, passed: 4900, failed: 100, unavailable: 0 },
  assertionStats: { total: 500, passed: 490, failed: 10, unavailable: 0 },
  severityStats: { blocker: 0, critical: 10, major: 20, minor: 30, none: 4940 },
  gatlingReportLocation: '/reports/gatling',
  gatlingLogLocation: '/logs/gatling',
  testRequirements: true,
  requirementsFileLocation: '/requirements/test.json',
  createdTime: '2024-01-01T00:00:00Z',
  severityVersion: '1.0.0',
  requirementsVersion: '1.0.0',
  requestResults: [
    {
      id: 1,
      request: {
        id: 1,
        requestName: 'User Login',
        requestDescription: 'User authentication endpoint',
        requestPriority: 'HIGH',
        tags: 'auth,login',
        createdTime: '2024-01-01T00:00:00Z'
      },
      status: 'PASS',
      severity: 'HIGH',
      totalCount: 1000,
      passCount: 995,
      failCount: 5,
      errorPercentage: 0.5,
      rate: 20,
      rateGranularity: 'minute',
      responseTimes: {
        min: 45,
        max: 250,
        percentiles: {
          '50': 120,
          '75': 150,
          '90': 180,
          '95': 200,
          '99': 230
        }
      },
      testRequirements: true,
      statistics: true,
      requirements: {
        status: 'PASS',
        passed: 8,
        failed: 1,
        percentiles: []
      }
    },
    {
      id: 2,
      request: { requestName: 'Product Search' },
      status: 'FAIL',
      severity: 'HIGH',
      totalCount: 800,
      passCount: 720,
      failCount: 80,
      errorPercentage: '10.0',
      responseTimes: {
        min: 30,
        max: 500,
        percentiles: {
          '50': 200,
          '75': 280,
          '90': 350,
          '95': 420,
          '99': 480
        }
      },
      requirements: {
        passed: 5,
        failed: 4
      }
    },
    {
      id: 3,
      request: { requestName: 'Add to Cart' },
      status: 'PASS',
      severity: 'MEDIUM',
      totalCount: 600,
      passCount: 588,
      failCount: 12,
      errorPercentage: '2.0',
      responseTimes: {
        min: 25,
        max: 180,
        percentiles: {
          '50': 80,
          '75': 100,
          '90': 120,
          '95': 140,
          '99': 165
        }
      },
      requirements: {
        passed: 7,
        failed: 2
      }
    },
    {
      id: 4,
      request: { requestName: 'Checkout Process' },
      status: 'PASS',
      severity: 'HIGH',
      totalCount: 400,
      passCount: 396,
      failCount: 4,
      errorPercentage: '1.0',
      responseTimes: {
        min: 100,
        max: 300,
        percentiles: {
          '50': 180,
          '75': 220,
          '90': 250,
          '95': 270,
          '99': 290
        }
      },
      requirements: {
        passed: 9,
        failed: 0
      }
    },
    {
      id: 5,
      request: { requestName: 'User Logout' },
      status: 'PASS',
      severity: 'LOW',
      totalCount: 200,
      passCount: 200,
      failCount: 0,
      errorPercentage: '0.0',
      responseTimes: {
        min: 15,
        max: 60,
        percentiles: {
          '50': 30,
          '75': 40,
          '90': 45,
          '95': 50,
          '99': 55
        }
      },
      requirements: {
        passed: 3,
        failed: 0
      }
    }
  ]
};

const mixedStatusData: TestResults = {
  ...sampleTestData,
  test: {
    ...sampleTestData.test,
    description: 'Mixed Status Test'
  },
  requestResults: [
    {
      id: 1,
      request: { requestName: 'Critical API' },
      status: 'FAIL',
      severity: 'HIGH',
      totalCount: 100,
      passCount: 60,
      failCount: 40,
      errorPercentage: '40.0',
      responseTimes: {
        min: 50,
        max: 1000,
        percentiles: {
          '50': 300,
          '95': 800,
          '99': 950
        }
      },
      requirements: {
        passed: 2,
        failed: 8
      }
    },
    {
      id: 2,
      request: { requestName: 'Stable Service' },
      status: 'PASS',
      severity: 'MEDIUM',
      totalCount: 150,
      passCount: 150,
      failCount: 0,
      errorPercentage: '0.0',
      responseTimes: {
        min: 20,
        max: 100,
        percentiles: {
          '50': 45,
          '95': 80,
          '99': 95
        }
      },
      requirements: {
        passed: 10,
        failed: 0
      }
    }
  ]
};

const emptyData: TestResults = {
  ...sampleTestData,
  test: {
    ...sampleTestData.test,
    description: 'Empty Test Results'
  },
  requestResults: []
};

const minimalData: TestResults = {
  ...sampleTestData,
  test: {
    ...sampleTestData.test,
    description: 'Minimal Data Test'
  },
  requestResults: [
    {
      ...sampleTestData.requestResults[0],
      request: {
        ...sampleTestData.requestResults[0].request,
        requestName: 'Basic Request'
      },
      severity: 'LOW',
      totalCount: 10
    }
  ]
};

const largeDataset: TestResults = {
  ...sampleTestData,
  test: {
    ...sampleTestData.test,
    description: 'Large Dataset Performance Test'
  },
  requestResults: Array.from({ length: 20 }, (_, i) => ({
    ...sampleTestData.requestResults[0],
    id: i + 1,
    request: {
      ...sampleTestData.requestResults[0].request,
      id: i + 1,
      requestName: `Request ${i + 1}`
    },
    status: i % 3 === 0 ? 'FAIL' : 'PASS',
    severity: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
    totalCount: Math.floor(Math.random() * 1000) + 100,
    passCount: Math.floor(Math.random() * 900) + 50,
    failCount: Math.floor(Math.random() * 100),
    errorPercentage: Math.random() * 20,
    responseTimes: {
      min: Math.floor(Math.random() * 50) + 10,
      max: Math.floor(Math.random() * 500) + 100,
      percentiles: {
        '50': Math.floor(Math.random() * 200) + 50,
        '75': Math.floor(Math.random() * 300) + 100,
        '90': Math.floor(Math.random() * 400) + 150,
        '95': Math.floor(Math.random() * 450) + 200,
        '99': Math.floor(Math.random() * 500) + 250
      }
    },
    requirements: {
      status: i % 3 === 0 ? 'FAIL' : 'PASS',
      passed: Math.floor(Math.random() * 10),
      failed: Math.floor(Math.random() * 5),
      percentiles: []
    }
  }))
};

export const Default: Story = {
  args: {
    testData: sampleTestData
  },
  parameters: {
    docs: {
      description: {
        story: 'Default view of the RequestsTable with comprehensive test data including multiple requests with various statuses and response times.'
      }
    }
  }
};

export const MixedStatuses: Story = {
  args: {
    testData: mixedStatusData
  },
  parameters: {
    docs: {
      description: {
        story: 'Table showing requests with mixed pass/fail statuses, useful for testing filtering and sorting functionality.'
      }
    }
  }
};

export const EmptyState: Story = {
  args: {
    testData: emptyData
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no request results are available. Shows how the component handles empty data gracefully.'
      }
    }
  }
};

export const MinimalData: Story = {
  args: {
    testData: minimalData
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with minimal data showing how the component handles requests with limited information.'
      }
    }
  }
};

export const LargeDataset: Story = {
  args: {
    testData: largeDataset
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with a large dataset (20 requests) to demonstrate filtering, sorting, and expansion capabilities.'
      }
    }
  }
};

export const HighErrorRate: Story = {
  args: {
    testData: {
      ...sampleTestData,
      test: {
        ...sampleTestData.test,
        description: 'High Error Rate Scenario'
      },
      requestResults: [
        {
          id: 1,
          request: { requestName: 'Failing Service' },
          status: 'FAIL',
          severity: 'HIGH',
          totalCount: 100,
          passCount: 20,
          failCount: 80,
          errorPercentage: '80.0',
          responseTimes: {
            min: 100,
            max: 5000,
            percentiles: {
              '50': 2000,
              '95': 4500,
              '99': 4900
            }
          },
          requirements: {
            passed: 1,
            failed: 9
          }
        },
        {
          id: 2,
          request: { requestName: 'Timeout Service' },
          status: 'FAIL',
          severity: 'HIGH',
          totalCount: 50,
          passCount: 10,
          failCount: 40,
          errorPercentage: '80.0',
          responseTimes: {
            min: 200,
            max: 10000,
            percentiles: {
              '50': 5000,
              '95': 9000,
              '99': 9800
            }
          },
          requirements: {
            passed: 0,
            failed: 10
          }
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario with high error rates and slow response times, useful for testing error state visualization.'
      }
    }
  }
};

export const PerfectPerformance: Story = {
  args: {
    testData: {
      ...sampleTestData,
      test: {
        ...sampleTestData.test,
        description: 'Perfect Performance Scenario'
      },
      requestResults: [
        {
          id: 1,
          request: { requestName: 'Optimized API' },
          status: 'PASS',
          severity: 'HIGH',
          totalCount: 1000,
          passCount: 1000,
          failCount: 0,
          errorPercentage: '0.0',
          responseTimes: {
            min: 5,
            max: 25,
            percentiles: {
              '50': 12,
              '75': 15,
              '90': 18,
              '95': 20,
              '99': 23
            }
          },
          requirements: {
            passed: 10,
            failed: 0
          }
        },
        {
          id: 2,
          request: { requestName: 'Fast Service' },
          status: 'PASS',
          severity: 'MEDIUM',
          totalCount: 500,
          passCount: 500,
          failCount: 0,
          errorPercentage: '0.0',
          responseTimes: {
            min: 8,
            max: 30,
            percentiles: {
              '50': 15,
              '75': 20,
              '90': 25,
              '95': 27,
              '99': 29
            }
          },
          requirements: {
            passed: 8,
            failed: 0
          }
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Ideal scenario with perfect performance metrics - all tests passing with fast response times.'
      }
    }
  }
};

export const VariedSeverities: Story = {
  args: {
    testData: {
      ...sampleTestData,
      test: {
        ...sampleTestData.test,
        description: 'Varied Severities Test'
      },
      requestResults: [
        {
          id: 1,
          request: { requestName: 'Critical System' },
          status: 'PASS',
          severity: 'HIGH',
          totalCount: 200,
          passCount: 195,
          failCount: 5,
          errorPercentage: '2.5',
          responseTimes: {
            min: 50,
            max: 200,
            percentiles: { '50': 100, '95': 180 }
          },
          requirements: { passed: 9, failed: 1 }
        },
        {
          id: 2,
          request: { requestName: 'Important Feature' },
          status: 'PASS',
          severity: 'MEDIUM',
          totalCount: 150,
          passCount: 140,
          failCount: 10,
          errorPercentage: '6.7',
          responseTimes: {
            min: 30,
            max: 150,
            percentiles: { '50': 80, '95': 130 }
          },
          requirements: { passed: 7, failed: 2 }
        },
        {
          id: 3,
          request: { requestName: 'Nice to Have' },
          status: 'FAIL',
          severity: 'LOW',
          totalCount: 100,
          passCount: 85,
          failCount: 15,
          errorPercentage: '15.0',
          responseTimes: {
            min: 20,
            max: 300,
            percentiles: { '50': 120, '95': 250 }
          },
          requirements: { passed: 5, failed: 3 }
        }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates requests with different severity levels (HIGH, MEDIUM, LOW) for testing severity-based filtering.'
      }
    }
  }
};

export const InteractiveDemo: Story = {
  args: {
    testData: sampleTestData
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showcasing all features: sorting, filtering, row expansion, and data visualization. Try clicking on column headers to sort, use filters, and expand rows to see detailed charts.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    // This story can be used for interactive testing
    // Users can manually test sorting, filtering, and expansion features
  }
};
