import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Users, Clock, TrendingUp, Zap, Database, Globe, Shield } from 'lucide-react';
import CompactMetricCard from './CompactMetricCard';

const meta: Meta<typeof CompactMetricCard> = {
  title: 'Components/CompactMetricCard',
  component: CompactMetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A compact metric card component that displays an icon, label, and value in a sleek card format.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: 'Lucide icon component to display',
      control: false,
    },
    label: {
      description: 'Label text for the metric',
      control: 'text',
    },
    value: {
      description: 'Value to display for the metric',
      control: 'text',
    },
    color: {
      description: 'Tailwind color class for the icon',
      control: 'select',
      options: [
        'text-blue-400',
        'text-green-400',
        'text-red-400',
        'text-yellow-400',
        'text-purple-400',
        'text-pink-400',
        'text-indigo-400',
        'text-cyan-400',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Activity,
    label: 'Active Users',
    value: '1,234',
    color: 'text-blue-400',
  },
};

export const Performance: Story = {
  args: {
    icon: TrendingUp,
    label: 'Performance Score',
    value: '98.5%',
    color: 'text-green-400',
  },
};

export const ResponseTime: Story = {
  args: {
    icon: Clock,
    label: 'Avg Response Time',
    value: '245ms',
    color: 'text-yellow-400',
  },
};

export const ErrorRate: Story = {
  args: {
    icon: Shield,
    label: 'Error Rate',
    value: '0.02%',
    color: 'text-red-400',
  },
};

export const TotalUsers: Story = {
  args: {
    icon: Users,
    label: 'Total Users',
    value: '15.2K',
    color: 'text-purple-400',
  },
};

export const ServerLoad: Story = {
  args: {
    icon: Zap,
    label: 'Server Load',
    value: '67%',
    color: 'text-cyan-400',
  },
};

export const DatabaseConnections: Story = {
  args: {
    icon: Database,
    label: 'DB Connections',
    value: '42/100',
    color: 'text-indigo-400',
  },
};

export const NetworkTraffic: Story = {
  args: {
    icon: Globe,
    label: 'Network Traffic',
    value: '2.1 GB/s',
    color: 'text-pink-400',
  },
};

export const LongLabel: Story = {
  args: {
    icon: Activity,
    label: 'Very Long Metric Label That Should Truncate',
    value: '999',
    color: 'text-blue-400',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component handles long labels with truncation.',
      },
    },
  },
};

export const LongValue: Story = {
  args: {
    icon: TrendingUp,
    label: 'Large Number',
    value: 'Very Long Value That Should Also Truncate Properly',
    color: 'text-green-400',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component handles long values with truncation.',
      },
    },
  },
};

export const ZeroValue: Story = {
  args: {
    icon: Users,
    label: 'Inactive Sessions',
    value: '0',
    color: 'text-red-400',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component displays zero values.',
      },
    },
  },
};

export const EmptyValue: Story = {
  args: {
    icon: Clock,
    label: 'Loading...',
    value: '',
    color: 'text-gray-400',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component handles empty values (loading state).',
      },
    },
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <CompactMetricCard
        icon={Activity}
        label="Active Users"
        value="1,234"
        color="text-blue-400"
      />
      <CompactMetricCard
        icon={TrendingUp}
        label="Performance"
        value="98.5%"
        color="text-green-400"
      />
      <CompactMetricCard
        icon={Clock}
        label="Response Time"
        value="245ms"
        color="text-yellow-400"
      />
      <CompactMetricCard
        icon={Users}
        label="Total Users"
        value="15.2K"
        color="text-purple-400"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates multiple cards in a grid layout.',
      },
    },
  },
};
