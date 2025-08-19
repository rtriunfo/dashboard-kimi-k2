import { Meta, StoryObj } from '@storybook/react';
import LineGraph from './LineGraph';
import { ResponseTimeData, RequirementData } from '../../types/chart.types';
import '../../index.css';

const mockResponseTimes: ResponseTimeData = {
  min: 45,
  max: 520,
  percentiles: {
    '50': 95,
    '75': 140,
    '90': 210,
    '95': 280,
    '99': 450,
  },
};

const mockRequirementsPass: RequirementData[] = [
  {
    status: 'PASS',
    percentile: 50,
    value: 120,
    difference: -25,
    percentageDifference: -20.8,
  },
  {
    status: 'PASS',
    percentile: 90,
    value: 300,
    difference: -90,
    percentageDifference: -30,
  },
  {
    status: 'PASS',
    percentile: 95,
    value: 400,
    difference: -120,
    percentageDifference: -30,
  },
];

const mockRequirementsFail: RequirementData[] = [
  {
    status: 'FAIL',
    percentile: 50,
    value: 80,
    difference: 15,
    percentageDifference: 18.75,
  },
  {
    status: 'FAIL',
    percentile: 90,
    value: 180,
    difference: 30,
    percentageDifference: 16.67,
  },
  {
    status: 'PASS',
    percentile: 95,
    value: 350,
    difference: -70,
    percentageDifference: -20,
  },
];

const mockRequirementsMixed: RequirementData[] = [
  {
    status: 'PASS',
    percentile: 50,
    value: 120,
    difference: -25,
    percentageDifference: -20.8,
  },
  {
    status: 'FAIL',
    percentile: 90,
    value: 180,
    difference: 30,
    percentageDifference: 16.67,
  },
];

const meta: Meta<typeof LineGraph> = {
  title: 'Components/LineGraph',
  component: LineGraph,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component:
          'A responsive line chart component for displaying response time percentiles vs requirements. Features interactive tooltips, accessibility support, and error handling.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    responseTimes: {
      description: 'Response time data with percentiles',
      control: { type: 'object' },
    },
    requirements: {
      description: 'Array of requirement data points',
      control: { type: 'object' },
    },
    title: {
      description: 'Chart title',
      control: { type: 'text' },
    },
    subtitle: {
      description: 'Chart subtitle',
      control: { type: 'text' },
    },
    loading: {
      description: 'Show loading state',
      control: { type: 'boolean' },
    },
    error: {
      description: 'Error object to display error state',
      control: { type: 'object' },
    },
    className: {
      description: 'Additional CSS classes',
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LineGraph>;

export const Default: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsPass,
    title: 'Response Time Performance',
    subtitle: 'Percentile distribution vs requirements',
  },
};

export const AllRequirementsPass: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsPass,
    title: 'All Requirements Passing',
    subtitle: 'Performance meets all SLA requirements',
  },
};

export const SomeRequirementsFail: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsFail,
    title: 'Some Requirements Failing',
    subtitle: 'Performance issues detected at lower percentiles',
  },
};

export const MixedRequirements: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsMixed,
    title: 'Mixed Performance Results',
    subtitle: 'Some requirements pass, others fail',
  },
};

export const NoRequirements: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: [],
    title: 'Response Times Only',
    subtitle: 'No requirements defined',
  },
};

export const EmbeddedMode: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsPass,
    // No title - triggers embedded mode
  },
};

export const WithCustomClass: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsMixed,
    title: 'Custom Styled Chart',
    className: 'border-2 border-blue-500 rounded-lg',
  },
};

export const LoadingState: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsPass,
    title: 'Loading Chart Data',
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    responseTimes: mockResponseTimes,
    requirements: mockRequirementsPass,
    title: 'Error Loading Data',
    error: new Error('Failed to load performance data from server'),
  },
};

export const MinimalData: Story = {
  args: {
    responseTimes: {
      min: 100,
      max: 200,
      percentiles: {
        '50': 120,
        '95': 180,
      },
    },
    requirements: [
      {
        status: 'PASS',
        percentile: 95,
        value: 200,
        difference: -20,
        percentageDifference: -10,
      },
    ],
    title: 'Minimal Dataset',
    subtitle: 'Chart with limited data points',
  },
};

export const HighVarianceData: Story = {
  args: {
    responseTimes: {
      min: 10,
      max: 2000,
      percentiles: {
        '50': 50,
        '75': 100,
        '90': 500,
        '95': 1200,
        '99': 1800,
        '99.9': 1950,
      },
    },
    requirements: [
      {
        status: 'PASS',
        percentile: 50,
        value: 100,
        difference: -50,
        percentageDifference: -50,
      },
      {
        status: 'PASS',
        percentile: 90,
        value: 800,
        difference: -300,
        percentageDifference: -37.5,
      },
      {
        status: 'FAIL',
        percentile: 95,
        value: 1000,
        difference: 200,
        percentageDifference: 20,
      },
    ],
    title: 'High Variance Performance',
    subtitle: 'Wide distribution of response times',
  },
};
