import type { Meta, StoryObj } from '@storybook/react';
import SeverityStats from './SeverityStats';

const meta: Meta<typeof SeverityStats> = {
  title: 'Components/SeverityStats',
  component: SeverityStats,
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
      description: 'Object containing severity statistics',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with balanced data
export const Default: Story = {
  args: {
    stats: {
      blocker: 5,
      critical: 10,
      major: 15,
      minor: 20,
      none: 50,
    },
  },
};

// Story with high severity issues
export const HighSeverity: Story = {
  args: {
    stats: {
      blocker: 25,
      critical: 30,
      major: 20,
      minor: 15,
      none: 10,
    },
  },
};

// Story with mostly minor issues
export const LowSeverity: Story = {
  args: {
    stats: {
      blocker: 1,
      critical: 2,
      major: 5,
      minor: 40,
      none: 52,
    },
  },
};

// Story with no issues (all none)
export const NoIssues: Story = {
  args: {
    stats: {
      blocker: 0,
      critical: 0,
      major: 0,
      minor: 0,
      none: 100,
    },
  },
};

// Story with all zero values
export const AllZero: Story = {
  args: {
    stats: {
      blocker: 0,
      critical: 0,
      major: 0,
      minor: 0,
      none: 0,
    },
  },
};

// Story with only critical issues
export const OnlyCritical: Story = {
  args: {
    stats: {
      blocker: 0,
      critical: 50,
      major: 0,
      minor: 0,
      none: 0,
    },
  },
};

// Story with mixed severity (realistic scenario)
export const RealisticMix: Story = {
  args: {
    stats: {
      blocker: 2,
      critical: 8,
      major: 25,
      minor: 45,
      none: 120,
    },
  },
};

// Story with large numbers
export const LargeNumbers: Story = {
  args: {
    stats: {
      blocker: 150,
      critical: 300,
      major: 750,
      minor: 1200,
      none: 2500,
    },
  },
};

// Story with single digit numbers
export const SmallNumbers: Story = {
  args: {
    stats: {
      blocker: 1,
      critical: 2,
      major: 3,
      minor: 4,
      none: 5,
    },
  },
};

// Story demonstrating edge case with some zero values
export const PartialZeros: Story = {
  args: {
    stats: {
      blocker: 0,
      critical: 5,
      major: 0,
      minor: 10,
      none: 0,
    },
  },
};
