import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Clock, TrendingUp, Zap, Users, DollarSign, Percent, Timer, Calendar, BarChart3 } from 'lucide-react';
import MetricCard from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
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
    icon: {
      description: 'Lucide React icon component',
    },
    title: {
      description: 'Title text displayed above the value',
      control: 'text',
    },
    value: {
      description: 'Main value to display',
      control: 'text',
    },
    color: {
      description: 'Tailwind CSS color class for the icon',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with activity icon
export const Default: Story = {
  args: {
    icon: Activity,
    title: 'Total Requests',
    value: '1,234',
    color: 'text-blue-400',
  },
};

// Different color variations
export const BlueMetric: Story = {
  args: {
    icon: Clock,
    title: 'Response Time',
    value: '245ms',
    color: 'text-blue-400',
  },
};

export const GreenMetric: Story = {
  args: {
    icon: TrendingUp,
    title: 'Success Rate',
    value: '99.5%',
    color: 'text-green-400',
  },
};

export const RedMetric: Story = {
  args: {
    icon: Activity,
    title: 'Error Rate',
    value: '0.5%',
    color: 'text-red-400',
  },
};

export const YellowMetric: Story = {
  args: {
    icon: Timer,
    title: 'Duration',
    value: '2h 30m',
    color: 'text-yellow-400',
  },
};

export const PurpleMetric: Story = {
  args: {
    icon: Zap,
    title: 'Throughput',
    value: '1.2K/min',
    color: 'text-purple-400',
  },
};

export const CyanMetric: Story = {
  args: {
    icon: Users,
    title: 'Active Users',
    value: '847',
    color: 'text-cyan-400',
  },
};

// Different value formats
export const LargeNumber: Story = {
  args: {
    icon: BarChart3,
    title: 'Total Events',
    value: '2,847,392',
    color: 'text-indigo-400',
  },
};

export const CurrencyValue: Story = {
  args: {
    icon: DollarSign,
    title: 'Revenue',
    value: '$12,345.67',
    color: 'text-green-400',
  },
};

export const PercentageValue: Story = {
  args: {
    icon: Percent,
    title: 'CPU Usage',
    value: '87.3%',
    color: 'text-orange-400',
  },
};

export const TimeValue: Story = {
  args: {
    icon: Calendar,
    title: 'Uptime',
    value: '15d 4h',
    color: 'text-blue-400',
  },
};

// Edge cases
export const LongTitle: Story = {
  args: {
    icon: Activity,
    title: 'Average Response Time Over Last 24 Hours',
    value: '156ms',
    color: 'text-blue-400',
  },
};

export const VeryLargeValue: Story = {
  args: {
    icon: TrendingUp,
    title: 'Total Requests',
    value: '999,999,999,999',
    color: 'text-green-400',
  },
};

export const SmallValue: Story = {
  args: {
    icon: Activity,
    title: 'Errors',
    value: '0',
    color: 'text-gray-400',
  },
};

export const DecimalValue: Story = {
  args: {
    icon: Clock,
    title: 'Avg Response',
    value: '0.123s',
    color: 'text-blue-400',
  },
};

// Different icon examples
export const WithZapIcon: Story = {
  args: {
    icon: Zap,
    title: 'Power Usage',
    value: '2.4kW',
    color: 'text-yellow-400',
  },
};

export const WithUsersIcon: Story = {
  args: {
    icon: Users,
    title: 'Team Members',
    value: '12',
    color: 'text-purple-400',
  },
};

export const WithTimerIcon: Story = {
  args: {
    icon: Timer,
    title: 'Session Duration',
    value: '45m 12s',
    color: 'text-cyan-400',
  },
};
