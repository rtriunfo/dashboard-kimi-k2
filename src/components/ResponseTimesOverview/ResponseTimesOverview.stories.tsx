import type { Meta, StoryObj } from '@storybook/react';
import ResponseTimesOverview from './ResponseTimesOverview';

const meta: Meta<typeof ResponseTimesOverview> = {
  title: 'Components/ResponseTimesOverview',
  component: ResponseTimesOverview,
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
  argTypes: {
    responseTimes: {
      description: 'Response time data including min, max, and percentiles',
      control: { type: 'object' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ResponseTimesOverview>;

// Default story with typical response times
export const Default: Story = {
  args: {
    responseTimes: {
      min: 45,
      max: 2500,
      percentiles: {
        "50.0": 120,
        "75.0": 180,
        "90.0": 350,
        "95.0": 580,
        "99.0": 1200,
        "100.0": 2500
      }
    }
  }
};

// Fast response times (good performance)
export const FastResponseTimes: Story = {
  args: {
    responseTimes: {
      min: 10,
      max: 150,
      percentiles: {
        "50.0": 25,
        "75.0": 35,
        "90.0": 50,
        "95.0": 75,
        "99.0": 120,
        "100.0": 150
      }
    }
  }
};

// Slow response times (poor performance)
export const SlowResponseTimes: Story = {
  args: {
    responseTimes: {
      min: 500,
      max: 15000,
      percentiles: {
        "50.0": 2000,
        "75.0": 4000,
        "90.0": 8000,
        "95.0": 12000,
        "99.0": 14000,
        "100.0": 15000
      }
    }
  }
};

// Minimal percentiles
export const MinimalPercentiles: Story = {
  args: {
    responseTimes: {
      min: 100,
      max: 300,
      percentiles: {
        "50.0": 200,
        "90.0": 250
      }
    }
  }
};

// Single percentile
export const SinglePercentile: Story = {
  args: {
    responseTimes: {
      min: 80,
      max: 120,
      percentiles: {
        "50.0": 100
      }
    }
  }
};

// No percentiles (edge case)
export const NoPercentiles: Story = {
  args: {
    responseTimes: {
      min: 50,
      max: 100,
      percentiles: {}
    }
  }
};

// Zero values (edge case)
export const ZeroValues: Story = {
  args: {
    responseTimes: {
      min: 0,
      max: 0,
      percentiles: {
        "50.0": 0,
        "75.0": 0,
        "90.0": 0,
        "95.0": 0,
        "99.0": 0,
        "100.0": 0
      }
    }
  }
};

// Large numbers
export const LargeNumbers: Story = {
  args: {
    responseTimes: {
      min: 1000000,
      max: 9999999,
      percentiles: {
        "50.0": 3000000,
        "75.0": 5000000,
        "90.0": 7000000,
        "95.0": 8500000,
        "99.0": 9500000,
        "100.0": 9999999
      }
    }
  }
};

// Decimal percentiles
export const DecimalPercentiles: Story = {
  args: {
    responseTimes: {
      min: 25,
      max: 400,
      percentiles: {
        "50.5": 125,
        "75.25": 200,
        "90.1": 300,
        "99.9": 380
      }
    }
  }
};
