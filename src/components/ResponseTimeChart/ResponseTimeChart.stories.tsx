import type { Meta, StoryObj } from '@storybook/react';
import ResponseTimeChart from './ResponseTimeChart';

const meta: Meta<typeof ResponseTimeChart> = {
  title: 'Components/ResponseTimeChart',
  component: ResponseTimeChart,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    responseTimes: {
      description: 'Response time data including min, max, and percentiles',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with typical response times
export const Default: Story = {
  args: {
    responseTimes: {
      min: 45,
      max: 1850,
      percentiles: {
        "50.0": 120,
        "90.0": 480,
        "95.0": 720,
        "99.0": 1200,
        "99.9": 1650,
      },
    },
  },
};

// Fast response times (all values low)
export const FastResponses: Story = {
  args: {
    responseTimes: {
      min: 10,
      max: 150,
      percentiles: {
        "50.0": 25,
        "90.0": 45,
        "95.0": 65,
        "99.0": 95,
        "99.9": 130,
      },
    },
  },
};

// Slow response times (all values high)
export const SlowResponses: Story = {
  args: {
    responseTimes: {
      min: 500,
      max: 8000,
      percentiles: {
        "50.0": 1200,
        "90.0": 3500,
        "95.0": 4800,
        "99.0": 6500,
        "99.9": 7800,
      },
    },
  },
};

// Edge case: All zero values
export const ZeroValues: Story = {
  args: {
    responseTimes: {
      min: 0,
      max: 0,
      percentiles: {
        "50.0": 0,
        "90.0": 0,
        "95.0": 0,
        "99.0": 0,
        "99.9": 0,
      },
    },
  },
};

// Edge case: Very similar values (low variance)
export const LowVariance: Story = {
  args: {
    responseTimes: {
      min: 95,
      max: 105,
      percentiles: {
        "50.0": 98,
        "90.0": 101,
        "95.0": 102,
        "99.0": 103,
        "99.9": 104,
      },
    },
  },
};

// Edge case: High variance (big spread)
export const HighVariance: Story = {
  args: {
    responseTimes: {
      min: 5,
      max: 15000,
      percentiles: {
        "50.0": 50,
        "90.0": 200,
        "95.0": 1500,
        "99.0": 8000,
        "99.9": 14500,
      },
    },
  },
};

// Missing some percentile data
export const IncompleteData: Story = {
  args: {
    responseTimes: {
      min: 30,
      max: 800,
      percentiles: {
        "50.0": 85,
        "90.0": 250,
        // Missing 95th, 99th, and 99.9th percentiles
      },
    },
  },
};
