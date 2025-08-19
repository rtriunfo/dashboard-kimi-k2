import type { Meta, StoryObj } from '@storybook/react';
import AssertionStats from './AssertionStats';

const meta: Meta<typeof AssertionStats> = {
  title: 'Components/AssertionStats',
  component: AssertionStats,
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
      description: 'Assertion statistics object with total, passed, failed, and unavailable counts',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with typical assertion results
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

// High pass rate scenario
export const HighPassRate: Story = {
  args: {
    stats: {
      total: 250,
      passed: 240,
      failed: 8,
      unavailable: 2,
    },
  },
};

// Low pass rate scenario
export const LowPassRate: Story = {
  args: {
    stats: {
      total: 150,
      passed: 75,
      failed: 60,
      unavailable: 15,
    },
  },
};

// Perfect pass rate (100%)
export const PerfectPassRate: Story = {
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
      total: 30,
      passed: 0,
      failed: 30,
      unavailable: 0,
    },
  },
};

// Mostly unavailable scenario
export const MostlyUnavailable: Story = {
  args: {
    stats: {
      total: 80,
      passed: 10,
      failed: 5,
      unavailable: 65,
    },
  },
};

// Small numbers
export const SmallNumbers: Story = {
  args: {
    stats: {
      total: 5,
      passed: 3,
      failed: 1,
      unavailable: 1,
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
};

// Edge case: Single assertion
export const SingleAssertion: Story = {
  args: {
    stats: {
      total: 1,
      passed: 1,
      failed: 0,
      unavailable: 0,
    },
  },
};

// Edge case: Single failed assertion
export const SingleFailedAssertion: Story = {
  args: {
    stats: {
      total: 1,
      passed: 0,
      failed: 1,
      unavailable: 0,
    },
  },
};

// Balanced distribution
export const BalancedDistribution: Story = {
  args: {
    stats: {
      total: 90,
      passed: 30,
      failed: 30,
      unavailable: 30,
    },
  },
};

// Decimal pass rate scenario
export const DecimalPassRate: Story = {
  args: {
    stats: {
      total: 37,
      passed: 25,
      failed: 8,
      unavailable: 4,
    },
  },
};

// No failures, some unavailable
export const NoFailures: Story = {
  args: {
    stats: {
      total: 120,
      passed: 100,
      failed: 0,
      unavailable: 20,
    },
  },
};

// Critical scenario (high failures)
export const CriticalScenario: Story = {
  args: {
    stats: {
      total: 200,
      passed: 20,
      failed: 150,
      unavailable: 30,
    },
  },
};
