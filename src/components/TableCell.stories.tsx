import type { Meta, StoryObj } from '@storybook/react';
import { TableCell } from './TableCell';

const meta: Meta<typeof TableCell> = {
  title: 'Components/TableCell',
  component: TableCell,
  parameters: {
    docs: {
      description: {
        component: 'A reusable table cell component with consistent styling and alignment options. Provides standardized padding, text sizing, and alignment for table data.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to display in the cell',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment within the cell',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
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
type Story = StoryObj<typeof TableCell>;

// Primary usage story
export const Default: Story = {
  args: {
    children: 'Default cell',
  },
};

// Alignment variants
export const LeftAligned: Story = {
  args: {
    children: 'Left aligned text',
    align: 'left',
  },
};

export const CenterAligned: Story = {
  args: {
    children: 'Center aligned text',
    align: 'center',
  },
};

export const RightAligned: Story = {
  args: {
    children: 'Right aligned text',
    align: 'right',
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    children: 'Small text',
    size: 'sm',
  },
};

export const MediumSize: Story = {
  args: {
    children: 'Medium text',
    size: 'md',
  },
};

export const LargeSize: Story = {
  args: {
    children: 'Large text',
    size: 'lg',
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    children: 'Custom styled cell',
    className: 'text-blue-400 font-bold bg-slate-700/50',
  },
};

export const NumericData: Story = {
  args: {
    children: '1,234.56',
    align: 'right',
    className: 'text-slate-300 font-mono',
  },
};

export const StatusCell: Story = {
  args: {
    children: 'PASSED',
    className: 'text-green-400 font-semibold',
  },
};

export const ErrorCell: Story = {
  args: {
    children: '2.45%',
    className: 'text-red-400 font-medium',
  },
};

// Complex content
export const ComplexContent: Story = {
  args: {
    children: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        <span>Active</span>
      </div>
    ),
  },
};

// Table example with multiple cells
export const TableExample: Story = {
  render: () => (
    <table className="bg-slate-800 rounded-lg border border-slate-700 w-full">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="px-2 py-4 text-left text-sm font-semibold text-white">Name</th>
          <th className="px-2 py-4 text-center text-sm font-semibold text-white">Status</th>
          <th className="px-2 py-4 text-center text-sm font-semibold text-white">Value</th>
          <th className="px-2 py-4 text-right text-sm font-semibold text-white">Count</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-700">
          <TableCell align="left" className="text-white font-medium">
            Request A
          </TableCell>
          <TableCell className="text-green-400">
            PASSED
          </TableCell>
          <TableCell className="text-slate-300">
            125ms
          </TableCell>
          <TableCell align="right" className="text-slate-300 font-mono">
            1,234
          </TableCell>
        </tr>
        <tr className="border-b border-slate-700">
          <TableCell align="left" className="text-white font-medium">
            Request B
          </TableCell>
          <TableCell className="text-red-400">
            FAILED
          </TableCell>
          <TableCell className="text-slate-300">
            2,456ms
          </TableCell>
          <TableCell align="right" className="text-slate-300 font-mono">
            567
          </TableCell>
        </tr>
      </tbody>
    </table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing TableCell components in a complete table structure',
      },
    },
  },
};
