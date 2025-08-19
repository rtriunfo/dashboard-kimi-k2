import type { Meta, StoryObj } from '@storybook/react';
import RequestStats from './RequestStats';

const meta: Meta<typeof RequestStats> = {
  title: 'Components/RequestStats',
  component: RequestStats,
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
    stats: {
      description: 'Statistics object containing request counts',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with typical values
export const Default: Story = {
  args: {
    stats: {
      total: 100,
      passed: 85,
      failed: 10,
      unavailable: 5,
    },
  },
};

// High success rate scenario
export const HighSuccessRate: Story = {
  args: {
    stats: {
      total: 1000,
      passed: 950,
      failed: 30,
      unavailable: 20,
    },
  },
};

// Low success rate scenario
export const LowSuccessRate: Story = {
  args: {
    stats: {
      total: 100,
      passed: 45,
      failed: 40,
      unavailable: 15,
    },
  },
};

// Perfect success rate
export const PerfectSuccess: Story = {
  args: {
    stats: {
      total: 50,
      passed: 50,
      failed: 0,
      unavailable: 0,
    },
  },
};

// All failed scenario
export const AllFailed: Story = {
  args: {
    stats: {
      total: 25,
      passed: 0,
      failed: 25,
      unavailable: 0,
    },
  },
};

// High unavailable count
export const HighUnavailable: Story = {
  args: {
    stats: {
      total: 100,
      passed: 30,
      failed: 20,
      unavailable: 50,
    },
  },
};

// Small dataset
export const SmallDataset: Story = {
  args: {
    stats: {
      total: 5,
      passed: 3,
      failed: 1,
      unavailable: 1,
    },
  },
};

// Large dataset
export const LargeDataset: Story = {
  args: {
    stats: {
      total: 10000,
      passed: 8500,
      failed: 1000,
      unavailable: 500,
    },
  },
};

// Edge case: Only passed requests
export const OnlyPassed: Story = {
  args: {
    stats: {
      total: 100,
      passed: 100,
      failed: 0,
      unavailable: 0,
    },
  },
};

// Edge case: Only failed requests
export const OnlyFailed: Story = {
  args: {
    stats: {
      total: 50,
      passed: 0,
      failed: 50,
      unavailable: 0,
    },
  },
};

// Edge case: Only unavailable requests
export const OnlyUnavailable: Story = {
  args: {
    stats: {
      total: 30,
      passed: 0,
      failed: 0,
      unavailable: 30,
    },
  },
};

// Balanced distribution
export const Balanced: Story = {
  args: {
    stats: {
      total: 300,
      passed: 100,
      failed: 100,
      unavailable: 100,
    },
  },
};

// Edge case: Zero total (division by zero)
export const ZeroTotal: Story = {
  args: {
    stats: {
      total: 0,
      passed: 0,
      failed: 0,
      unavailable: 0,
    },
  },
};

// Realistic production scenario
export const Production: Story = {
  args: {
    stats: {
      total: 2500,
      passed: 2350,
      failed: 100,
      unavailable: 50,
    },
  },
};

// Development/testing scenario
export const Development: Story = {
  args: {
    stats: {
      total: 150,
      passed: 120,
      failed: 25,
      unavailable: 5,
    },
  },
};

// Critical failure scenario
export const CriticalFailure: Story = {
  args: {
    stats: {
      total: 100,
      passed: 10,
      failed: 80,
      unavailable: 10,
    },
  },
};

// Service degradation scenario
export const ServiceDegradation: Story = {
  args: {
    stats: {
      total: 200,
      passed: 100,
      failed: 20,
      unavailable: 80,
    },
  },
};
