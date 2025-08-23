import type { Meta, StoryObj } from '@storybook/react-vite';
import RequestStats from './RequestStats';

const meta: Meta<typeof RequestStats> = {
  title: 'Components/RequestStats',
  component: RequestStats,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that displays request statistics with a pie chart visualization and detailed breakdown.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stats: {
      description: 'Statistics object containing request data',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with typical data
export const Default: Story = {
  args: {
    stats: {
      total: 100,
      passed: 75,
      failed: 20,
      unavailable: 5,
    },
  },
};

// High success rate scenario
export const HighSuccessRate: Story = {
  args: {
    stats: {
      total: 200,
      passed: 190,
      failed: 8,
      unavailable: 2,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with a high success rate (95%)',
      },
    },
  },
};

// Low success rate scenario
export const LowSuccessRate: Story = {
  args: {
    stats: {
      total: 100,
      passed: 30,
      failed: 60,
      unavailable: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with a low success rate (30%)',
      },
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
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with 100% success rate - only passed requests',
      },
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
  parameters: {
    docs: {
      description: {
        story: 'Shows the component when all requests have failed',
      },
    },
  },
};

// Mixed with unavailable services
export const ManyUnavailable: Story = {
  args: {
    stats: {
      total: 80,
      passed: 20,
      failed: 15,
      unavailable: 45,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component when many services are unavailable',
      },
    },
  },
};

// Small dataset
export const SmallDataset: Story = {
  args: {
    stats: {
      total: 3,
      passed: 2,
      failed: 1,
      unavailable: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with a very small dataset',
      },
    },
  },
};

// Large numbers
export const LargeNumbers: Story = {
  args: {
    stats: {
      total: 10000,
      passed: 8500,
      failed: 1200,
      unavailable: 300,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component handling large numbers',
      },
    },
  },
};

// Edge case: Zero total
export const ZeroTotal: Story = {
  args: {
    stats: {
      total: 0,
      passed: 0,
      failed: 0,
      unavailable: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge case: Shows the component when no requests have been made',
      },
    },
  },
};

// Equal distribution
export const EqualDistribution: Story = {
  args: {
    stats: {
      total: 90,
      passed: 30,
      failed: 30,
      unavailable: 30,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with equal distribution across all categories',
      },
    },
  },
};

// Interactive story for testing
export const Interactive: Story = {
  args: {
    stats: {
      total: 100,
      passed: 75,
      failed: 20,
      unavailable: 5,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version where you can modify the stats values',
      },
    },
  },
};