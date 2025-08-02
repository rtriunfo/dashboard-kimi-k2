import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPercentageCell } from './ErrorPercentageCell';

const meta: Meta<typeof ErrorPercentageCell> = {
  title: 'Components/ErrorPercentageCell',
  component: ErrorPercentageCell,
  parameters: {
    docs: {
      description: {
        component: 'A specialized table cell component for displaying error percentages with color-coded thresholds. Green for ≤1%, yellow for >1% and ≤5%, red for >5%.',
      },
    },
  },
  argTypes: {
    errorPercentage: {
      control: 'number',
      description: 'The error percentage value to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <table className="bg-slate-800 rounded-lg border border-slate-700">
        <tbody>
          <tr className="border-b border-slate-700">
            <Story />
          </tr>
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ErrorPercentageCell>;

// Primary usage story
export const Default: Story = {
  args: {
    errorPercentage: 2.5,
  },
};

// Color threshold examples
export const LowError: Story = {
  args: {
    errorPercentage: 0.5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Low error percentage (≤1%) displays in green',
      },
    },
  },
};

export const MediumError: Story = {
  args: {
    errorPercentage: 3.2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium error percentage (>1% and ≤5%) displays in yellow',
      },
    },
  },
};

export const HighError: Story = {
  args: {
    errorPercentage: 8.7,
  },
  parameters: {
    docs: {
      description: {
        story: 'High error percentage (>5%) displays in red',
      },
    },
  },
};

// Boundary values
export const ZeroError: Story = {
  args: {
    errorPercentage: 0,
  },
};

export const ExactlyOnePercent: Story = {
  args: {
    errorPercentage: 1.0,
  },
};

export const ExactlyFivePercent: Story = {
  args: {
    errorPercentage: 5.0,
  },
};

// Edge cases
export const NullValue: Story = {
  args: {
    errorPercentage: null,
  },
};

export const UndefinedValue: Story = {
  args: {
    errorPercentage: undefined,
  },
};

export const StringValue: Story = {
  args: {
    errorPercentage: "4.25",
  },
};

export const VeryHighError: Story = {
  args: {
    errorPercentage: 25.67,
  },
};

export const VeryLowError: Story = {
  args: {
    errorPercentage: 0.01,
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    errorPercentage: 3.5,
    className: 'bg-slate-700/50 border border-slate-600 rounded',
  },
};

// Table example with multiple error percentages
export const TableExample: Story = {
  render: () => (
    <table className="bg-slate-800 rounded-lg border border-slate-700 w-full">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="px-2 py-4 text-left text-sm font-semibold text-white">Request</th>
          <th className="px-2 py-4 text-center text-sm font-semibold text-white">Error Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-700">
          <td className="px-2 py-4 text-sm text-white">Login API</td>
          <ErrorPercentageCell errorPercentage={0.2} />
        </tr>
        <tr className="border-b border-slate-700">
          <td className="px-2 py-4 text-sm text-white">Search API</td>
          <ErrorPercentageCell errorPercentage={2.8} />
        </tr>
        <tr className="border-b border-slate-700">
          <td className="px-2 py-4 text-sm text-white">Upload API</td>
          <ErrorPercentageCell errorPercentage={7.5} />
        </tr>
        <tr className="border-b border-slate-700">
          <td className="px-2 py-4 text-sm text-white">Payment API</td>
          <ErrorPercentageCell errorPercentage={0} />
        </tr>
      </tbody>
    </table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing ErrorPercentageCell components in a complete table with different error rates',
      },
    },
  },
};

// All threshold examples in one view
export const AllThresholds: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-white text-sm font-semibold">Error Percentage Thresholds:</div>
      <table className="bg-slate-800 rounded-lg border border-slate-700 w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-2 py-4 text-left text-sm font-semibold text-white">Threshold</th>
            <th className="px-2 py-4 text-center text-sm font-semibold text-white">Example</th>
            <th className="px-2 py-4 text-left text-sm font-semibold text-white">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-700">
            <td className="px-2 py-4 text-sm text-slate-300">≤ 1%</td>
            <ErrorPercentageCell errorPercentage={0.5} />
            <td className="px-2 py-4 text-sm text-green-400">Green (Good)</td>
          </tr>
          <tr className="border-b border-slate-700">
            <td className="px-2 py-4 text-sm text-slate-300">> 1% and ≤ 5%</td>
            <ErrorPercentageCell errorPercentage={3.0} />
            <td className="px-2 py-4 text-sm text-yellow-400">Yellow (Warning)</td>
          </tr>
          <tr className="border-b border-slate-700">
            <td className="px-2 py-4 text-sm text-slate-300">> 5%</td>
            <ErrorPercentageCell errorPercentage={8.0} />
            <td className="px-2 py-4 text-sm text-red-400">Red (Critical)</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual guide showing all color thresholds for error percentages',
      },
    },
  },
};
