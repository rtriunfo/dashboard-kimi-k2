import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTableHeader } from './RequestsTableHeader';
import { TestResults } from '../../types';

const mockTestData: TestResults = {
  id: 1,
  test: {
    id: 1,
    description: 'Test Description',
    type: 'load',
    simulationName: 'TestSimulation',
  },
  status: 'completed',
  startTime: '2023-01-01T00:00:00Z',
  duration: 300,
  branch: null,
  gatlingVersion: '3.8.0',
  parserVersion: '1.0.0',
  environment: null,
  gitHash: null,
  totalRequests: 1000,
  errorRate: 0.05,
  rate: 10,
  rateGranularity: 'second',
  responseTimes: {
    min: 100,
    max: 5000,
    percentiles: {
      '50': 200,
      '95': 1000,
      '99': 2000,
    },
  },
  requestStats: {
    total: 1000,
    passed: 950,
    failed: 50,
    unavailable: 0,
  },
  assertionStats: {
    total: 1000,
    passed: 950,
    failed: 50,
    unavailable: 0,
  },
  severityStats: {
    blocker: 0,
    critical: 5,
    major: 10,
    minor: 35,
    none: 950,
  },
  gatlingReportLocation: '/path/to/report',
  gatlingLogLocation: '/path/to/log',
  testRequirements: true,
  requirementsFileLocation: '/path/to/requirements',
  createdTime: '2023-01-01T00:00:00Z',
  severityVersion: '1.0',
  requirementsVersion: '1.0',
  requestResults: [],
};

const meta: Meta<typeof RequestsTableHeader> = {
  title: 'Components/RequestsTableHeader',
  component: RequestsTableHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    sortColumn: {
      control: { type: 'select' },
      options: ['name', 'status', 'severity', 'min', 'max', 'totalCount', 'errorPercentage'],
    },
    sortDirection: {
      control: { type: 'select' },
      options: ['asc', 'desc'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    testData: mockTestData,
    availablePercentiles: ['50', '95', '99'],
    sortColumn: 'name',
    sortDirection: 'asc',
    onSort: (column) => console.log('Sort by:', column),
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <Story />
        </table>
      </div>
    ),
  ],
};

export const WithoutRequirements: Story = {
  args: {
    testData: { ...mockTestData, testRequirements: false },
    availablePercentiles: ['50', '95', '99'],
    sortColumn: 'name',
    sortDirection: 'asc',
    onSort: (column) => console.log('Sort by:', column),
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <Story />
        </table>
      </div>
    ),
  ],
};

export const WithoutSeverity: Story = {
  args: {
    testData: { ...mockTestData, severityVersion: '' },
    availablePercentiles: ['50', '95', '99'],
    sortColumn: 'name',
    sortDirection: 'asc',
    onSort: (column) => console.log('Sort by:', column),
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <Story />
        </table>
      </div>
    ),
  ],
};

export const MinimalPercentiles: Story = {
  args: {
    testData: mockTestData,
    availablePercentiles: ['50'],
    sortColumn: 'name',
    sortDirection: 'asc',
    onSort: (column) => console.log('Sort by:', column),
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <Story />
        </table>
      </div>
    ),
  ],
};

export const ManyPercentiles: Story = {
  args: {
    testData: mockTestData,
    availablePercentiles: ['25', '50', '75', '90', '95', '99', '99.9'],
    sortColumn: 'name',
    sortDirection: 'asc',
    onSort: (column) => console.log('Sort by:', column),
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <Story />
        </table>
      </div>
    ),
  ],
};

export const SortedByMax: Story = {
  args: {
    testData: mockTestData,
    availablePercentiles: ['50', '95', '99'],
    sortColumn: 'max',
    sortDirection: 'desc',
    onSort: (column) => console.log('Sort by:', column),
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-4">
        <table className="w-full border-collapse bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <Story />
        </table>
      </div>
    ),
  ],
};
