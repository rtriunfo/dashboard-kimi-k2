import type { Meta, StoryObj } from '@storybook/react';
import SeverityBadge from './SeverityBadge';

const meta: Meta<typeof SeverityBadge> = {
  title: 'Components/SeverityBadge',
  component: SeverityBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'NONE', 'UNKNOWN'],
      description: 'The severity level to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with default props
export const Default: Story = {
  args: {
    severity: 'CRITICAL',
  },
};

// All severity variants
export const Blocker: Story = {
  args: {
    severity: 'BLOCKER',
  },
};

export const Critical: Story = {
  args: {
    severity: 'CRITICAL',
  },
};

export const Major: Story = {
  args: {
    severity: 'MAJOR',
  },
};

export const Minor: Story = {
  args: {
    severity: 'MINOR',
  },
};

export const None: Story = {
  args: {
    severity: 'NONE',
  },
};

export const Unknown: Story = {
  args: {
    severity: 'UNKNOWN_SEVERITY',
  },
};

// Edge cases
export const EmptySeverity: Story = {
  args: {
    severity: '',
  },
};

export const CaseInsensitive: Story = {
  args: {
    severity: 'critical',
  },
};

// All severities showcase
export const AllSeverities: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SeverityBadge severity="BLOCKER" />
      <SeverityBadge severity="CRITICAL" />
      <SeverityBadge severity="MAJOR" />
      <SeverityBadge severity="MINOR" />
      <SeverityBadge severity="NONE" />
      <SeverityBadge severity="UNKNOWN_SEVERITY" />
      <SeverityBadge severity="" />
    </div>
  ),
};
