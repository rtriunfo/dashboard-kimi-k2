import type { Meta, StoryObj } from '@storybook/react';
import PieChart from './PieChart';

const meta: Meta<typeof PieChart> = {
  title: 'Components/PieChart',
  component: PieChart,
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
    data: {
      description: 'Array of data items with label, value, and color',
    },
    size: {
      description: 'Size of the pie chart in pixels',
      control: { type: 'range', min: 80, max: 300, step: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story with typical test results data
export const Default: Story = {
  args: {
    data: [
      { label: 'Pass', value: 150, color: '#10b981' },
      { label: 'Fail', value: 25, color: '#ef4444' },
      { label: 'Warning', value: 10, color: '#f59e0b' },
    ],
    size: 120,
  },
};

// Request status distribution
export const RequestStatus: Story = {
  args: {
    data: [
      { label: 'Success', value: 1250, color: '#10b981' },
      { label: 'Error', value: 45, color: '#ef4444' },
      { label: 'Timeout', value: 15, color: '#f59e0b' },
    ],
    size: 140,
  },
};

// Severity distribution
export const SeverityLevels: Story = {
  args: {
    data: [
      { label: 'Critical', value: 5, color: '#dc2626' },
      { label: 'Major', value: 12, color: '#ea580c' },
      { label: 'Minor', value: 28, color: '#f59e0b' },
      { label: 'Info', value: 155, color: '#3b82f6' },
    ],
    size: 160,
  },
};

// Large size chart
export const LargeSize: Story = {
  args: {
    data: [
      { label: 'Completed', value: 85, color: '#10b981' },
      { label: 'In Progress', value: 12, color: '#3b82f6' },
      { label: 'Pending', value: 3, color: '#6b7280' },
    ],
    size: 200,
  },
};

// Small size chart
export const SmallSize: Story = {
  args: {
    data: [
      { label: 'Active', value: 75, color: '#10b981' },
      { label: 'Inactive', value: 25, color: '#6b7280' },
    ],
    size: 80,
  },
};

// Single segment (100% of one type)
export const SingleSegment: Story = {
  args: {
    data: [
      { label: 'All Pass', value: 100, color: '#10b981' },
    ],
    size: 120,
  },
};

// Two segments (50/50 split)
export const EvenSplit: Story = {
  args: {
    data: [
      { label: 'Type A', value: 50, color: '#3b82f6' },
      { label: 'Type B', value: 50, color: '#8b5cf6' },
    ],
    size: 120,
  },
};

// Many small segments
export const ManySegments: Story = {
  args: {
    data: [
      { label: 'Segment 1', value: 25, color: '#ef4444' },
      { label: 'Segment 2', value: 20, color: '#f59e0b' },
      { label: 'Segment 3', value: 18, color: '#eab308' },
      { label: 'Segment 4', value: 15, color: '#22c55e' },
      { label: 'Segment 5', value: 12, color: '#06b6d4' },
      { label: 'Segment 6', value: 10, color: '#3b82f6' },
    ],
    size: 150,
  },
};

// Edge case: Very small values
export const SmallValues: Story = {
  args: {
    data: [
      { label: 'Tiny 1', value: 0.1, color: '#10b981' },
      { label: 'Tiny 2', value: 0.05, color: '#ef4444' },
      { label: 'Tiny 3', value: 0.03, color: '#f59e0b' },
    ],
    size: 120,
  },
};

// Edge case: Large numbers
export const LargeNumbers: Story = {
  args: {
    data: [
      { label: 'Million', value: 1000000, color: '#10b981' },
      { label: 'Half Million', value: 500000, color: '#3b82f6' },
      { label: 'Quarter Million', value: 250000, color: '#8b5cf6' },
    ],
    size: 140,
  },
};

// Empty data (should render nothing)
export const EmptyData: Story = {
  args: {
    data: [],
    size: 120,
  },
};

// Zero values (should render nothing)
export const ZeroValues: Story = {
  args: {
    data: [
      { label: 'Zero', value: 0, color: '#10b981' },
    ],
    size: 120,
  },
};
