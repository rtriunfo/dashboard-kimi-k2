import type { Meta, StoryObj } from '@storybook/react';
import { RequestTableRow } from './RequestTableRow';
import { RequestResult, TestResults } from '../../types';

const meta: Meta<typeof RequestTableRow> = {
  title: 'Components/RequestTableRow',
  component: RequestTableRow,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Severity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Min</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">50th</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">95th</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Max</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Count</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Errors</th>
            </tr>
          </thead>
          <tbody>
            <Story />
          </tbody>
        </table>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RequestTableRow>;

const mockTestData: TestResults = {
  testRequirements: true,
  severityVersion: true,
  requestResults: []
};

const baseResult: RequestResult = {
  id: 1,
  request: {
    requestName: 'API Login Request',
    requestDescription: 'User authentication endpoint',
    requestPriority: 'High',
    tags: 'api,auth,critical'
  },
  responseTimes: {
    min: 85,
    max: 450,
    percentiles: {
      '50': 120,
      '95': 380
    }
  },
  status: 'PASS',
  severity: 'LOW',
  totalCount: 5000,
  errorPercentage: 1.2,
  passCount: 4940,
  failCount: 60,
  requirements: {
    passed: 8,
    failed: 2,
    percentiles: [
      {
        percentile: 95,
        value: 380,
        status: 'PASS',
        difference: -20,
        percentageDifference: -5.0
      }
    ]
  }
};

export const Default: Story = {
  args: {
    result: baseResult,
    index: 0,
    testData: mockTestData,
    availablePercentiles: ['50', '95'],
    isExpanded: false,
    onToggleExpansion: (id) => console.log('Toggle expansion for:', id),
    formatResponseTime: (time) => `${time}ms`
  },
};

export const Expanded: Story = {
  args: {
    ...Default.args,
    isExpanded: true,
  },
};

export const HighErrorRate: Story = {
  args: {
    ...Default.args,
    result: {
      ...baseResult,
      errorPercentage: 8.5,
      passCount: 4575,
      failCount: 425,
      status: 'FAIL',
      severity: 'HIGH'
    }
  },
};

export const NoExpandableData: Story = {
  args: {
    ...Default.args,
    result: {
      ...baseResult,
      passCount: 0,
      failCount: 0,
      requirements: undefined
    }
  },
};

export const OddRowIndex: Story = {
  args: {
    ...Default.args,
    index: 1,
  },
};

export const MinimalData: Story = {
  args: {
    ...Default.args,
    result: {
      id: 2,
      request: {
        requestName: 'Simple GET Request'
      },
      responseTimes: {
        min: 50,
        max: 200,
        percentiles: {
          '50': 75,
          '95': 150
        }
      },
      totalCount: 100,
      errorPercentage: 0
    } as RequestResult
  },
};

export const WithoutStatusAndSeverity: Story = {
  args: {
    ...Default.args,
    testData: {
      testRequirements: false,
      severityVersion: false,
      requestResults: []
    }
  },
};
