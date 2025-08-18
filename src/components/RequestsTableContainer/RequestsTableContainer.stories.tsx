import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTableContainer } from './RequestsTableContainer';
import { TestResults, RequestResult } from '../../types';

const mockTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Peak Hour Load Test',
    type: 'load',
    simulationName: 'PeakHourSimulation'
  },
  status: 'completed',
  startTime: '2024-01-15T00:00:00Z',
  duration: 9000,
  branch: null,
  gatlingVersion: '3.9.0',
  parserVersion: '1.0.0',
  environment: null,
  gitHash: null,
  totalRequests: 1500,
  errorRate: 5,
  rate: 10,
  rateGranularity: 'second',
  responseTimes: {
    min: 120,
    max: 800,
    percentiles: { '50': 245, '95': 650, '99': 750 }
  },
  requestStats: {
    total: 1500,
    passed: 1425,
    failed: 75,
    unavailable: 0
  },
  assertionStats: {
    total: 1500,
    passed: 1425,
    failed: 75,
    unavailable: 0
  },
  severityStats: {
    blocker: 0,
    critical: 25,
    major: 50,
    minor: 0,
    none: 1425
  },
  gatlingReportLocation: '/reports/gatling',
  gatlingLogLocation: '/logs/gatling',
  testRequirements: false,
  requirementsFileLocation: '',
  createdTime: '2024-01-15T00:00:00Z',
  severityVersion: '1.0.0',
  requirementsVersion: '1.0.0',
  requestResults: []
};

const mockRequestResults: RequestResult[] = [
  {
    id: 1,
    request: {
      id: 1,
      requestName: 'GET /api/users',
      requestDescription: null,
      requestPriority: null,
      tags: null,
      createdTime: '2024-01-15T00:00:00Z'
    },
    status: 'passed',
    severity: 'low',
    responseTimes: {
      min: 120,
      max: 450,
      percentiles: { '50': 200, '95': 380, '99': 420 }
    },
    totalCount: 500,
    passCount: 487,
    failCount: 13,
    errorPercentage: 2.5,
    rate: 10,
    rateGranularity: 'second',
    testRequirements: false,
    statistics: false,
    requirements: {
      status: 'passed',
      passed: 487,
      failed: 13,
      percentiles: []
    }
  },
  {
    id: 2,
    request: {
      id: 2,
      requestName: 'POST /api/orders',
      requestDescription: null,
      requestPriority: null,
      tags: null,
      createdTime: '2024-01-15T00:00:00Z'
    },
    status: 'failed',
    severity: 'high',
    responseTimes: {
      min: 180,
      max: 800,
      percentiles: { '50': 350, '95': 650, '99': 750 }
    },
    totalCount: 300,
    passCount: 254,
    failCount: 46,
    errorPercentage: 15.2,
    rate: 10,
    rateGranularity: 'second',
    testRequirements: false,
    statistics: false,
    requirements: {
      status: 'failed',
      passed: 254,
      failed: 46,
      percentiles: []
    }
  }
];

const mockChildren = (
  <>
    <thead>
      <tr className="bg-slate-700/50">
        <th className="px-4 py-3 text-left text-slate-300">Request Name</th>
        <th className="px-4 py-3 text-left text-slate-300">Status</th>
        <th className="px-4 py-3 text-left text-slate-300">Response Time</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t border-slate-600">
        <td className="px-4 py-3 text-slate-200">GET /api/users</td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">passed</span>
        </td>
        <td className="px-4 py-3 text-slate-200">200ms</td>
      </tr>
      <tr className="border-t border-slate-600">
        <td className="px-4 py-3 text-slate-200">POST /api/orders</td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">failed</span>
        </td>
        <td className="px-4 py-3 text-slate-200">350ms</td>
      </tr>
    </tbody>
  </>
);

const meta: Meta<typeof RequestsTableContainer> = {
  title: 'Components/RequestsTableContainer',
  component: RequestsTableContainer,
  parameters: {
    layout: 'padded',
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

export const WithData: Story = {
  args: {
    testData: mockTestData,
    requestResults: mockRequestResults,
    filteredAndSortedResults: mockRequestResults,
    children: mockChildren
  },
};

export const NoTestData: Story = {
  args: {
    testData: null as any,
    requestResults: [],
    filteredAndSortedResults: [],
    children: mockChildren
  },
};

export const NoRequestData: Story = {
  args: {
    testData: mockTestData,
    requestResults: [],
    filteredAndSortedResults: [],
    children: mockChildren
  },
};

export const NoFilteredResults: Story = {
  args: {
    testData: mockTestData,
    requestResults: mockRequestResults,
    filteredAndSortedResults: [],
    children: mockChildren
  },
};

export const EmptyTable: Story = {
  args: {
    testData: mockTestData,
    requestResults: mockRequestResults,
    filteredAndSortedResults: mockRequestResults,
    children: (
      <>
        <thead>
          <tr className="bg-slate-700/50">
            <th className="px-4 py-3 text-left text-slate-300">Request Name</th>
            <th className="px-4 py-3 text-left text-slate-300">Status</th>
            <th className="px-4 py-3 text-left text-slate-300">Response Time</th>
          </tr>
        </thead>
        <tbody>
          {/* No rows */}
        </tbody>
      </>
    )
  },
};
