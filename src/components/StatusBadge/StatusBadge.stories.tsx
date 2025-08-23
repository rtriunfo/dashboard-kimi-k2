import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'text',
      description: 'The status text to display',
    },
    size: {
      control: 'select',
      options: ['sm', 'lg'],
      description: 'Size variant of the badge',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show status icon',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story - default props
export const Default: Story = {
  args: {
    status: 'pass',
  },
};

// Status variants
export const PassStatus: Story = {
  args: {
    status: 'pass',
  },
};

export const FailStatus: Story = {
  args: {
    status: 'fail',
  },
};

export const UnknownStatus: Story = {
  args: {
    status: 'pending',
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    status: 'pass',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    status: 'pass',
    size: 'lg',
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    status: 'pass',
    showIcon: true,
  },
};

export const WithIconLarge: Story = {
  args: {
    status: 'pass',
    size: 'lg',
    showIcon: true,
  },
};

// Interactive story - all combinations
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small Size</h3>
        <div className="flex gap-2">
          <StatusBadge status="pass" size="sm" />
          <StatusBadge status="fail" size="sm" />
          <StatusBadge status="pending" size="sm" />
        </div>
        <div className="flex gap-2">
          <StatusBadge status="pass" size="sm" showIcon />
          <StatusBadge status="fail" size="sm" showIcon />
          <StatusBadge status="pending" size="sm" showIcon />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large Size</h3>
        <div className="flex gap-2">
          <StatusBadge status="pass" size="lg" />
          <StatusBadge status="fail" size="lg" />
          <StatusBadge status="pending" size="lg" />
        </div>
        <div className="flex gap-2">
          <StatusBadge status="pass" size="lg" showIcon />
          <StatusBadge status="fail" size="lg" showIcon />
          <StatusBadge status="pending" size="lg" showIcon />
        </div>
      </div>
    </div>
  ),
};

// Edge cases
export const EmptyStatus: Story = {
  args: {
    status: '',
  },
};

export const LongStatus: Story = {
  args: {
    status: 'very-long-status-name',
  },
};

export const MixedCaseStatus: Story = {
  args: {
    status: 'PaSs',
  },
};
