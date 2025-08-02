import type { Meta, StoryObj } from '@storybook/react';
import { SortableHeader } from './SortableHeader';

const meta: Meta<typeof SortableHeader> = {
  title: 'Components/SortableHeader',
  component: SortableHeader,
  parameters: {
    docs: {
      description: {
        component: 'A sortable table header component that displays sort indicators and handles click events. Used in data tables to provide sorting functionality with visual feedback.',
      },
    },
  },
  argTypes: {
    column: {
      control: 'select',
      options: ['name', 'status', 'severity', 'min', 'max', 'totalCount', 'errorPercentage'],
      description: 'The column identifier for sorting',
    },
    sortColumn: {
      control: 'select',
      options: ['name', 'status', 'severity', 'min', 'max', 'totalCount', 'errorPercentage'],
      description: 'Currently active sort column',
    },
    sortDirection: {
      control: 'select',
      options: ['asc', 'desc'],
      description: 'Current sort direction',
    },
    children: {
      control: 'text',
      description: 'Header content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onSort: {
      action: 'sorted',
      description: 'Callback fired when header is clicked',
    },
  },
  decorators: [
    (Story) => (
      <table className="bg-slate-800 rounded-lg">
        <thead>
          <tr className="border-b border-slate-700">
            <Story />
          </tr>
        </thead>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SortableHeader>;

// Primary usage story
export const Default: Story = {
  args: {
    column: 'name',
    sortColumn: 'name',
    sortDirection: 'asc',
    children: 'Request Name',
  },
};

// Variants for different prop combinations and edge cases
export const NotSorted: Story = {
  args: {
    column: 'status',
    sortColumn: 'name',
    sortDirection: 'asc',
    children: 'Status',
  },
};

export const SortedDescending: Story = {
  args: {
    column: 'name',
    sortColumn: 'name',
    sortDirection: 'desc',
    children: 'Request Name',
  },
};

export const NumericColumn: Story = {
  args: {
    column: 'min',
    sortColumn: 'min',
    sortDirection: 'asc',
    children: 'Min Response Time',
  },
};

export const PercentileColumn: Story = {
  args: {
    column: '95.0',
    sortColumn: '95.0',
    sortDirection: 'desc',
    children: '95th',
  },
};

export const CustomClassName: Story = {
  args: {
    column: 'name',
    sortColumn: 'name',
    sortDirection: 'asc',
    children: 'Custom Styled Header',
    className: 'px-8 py-6 text-left text-lg font-bold text-blue-400 bg-slate-900',
  },
};

export const LongHeaderText: Story = {
  args: {
    column: 'errorPercentage',
    sortColumn: 'errorPercentage',
    sortDirection: 'asc',
    children: 'Error Percentage Rate',
  },
};

export const AllColumns: Story = {
  render: () => (
    <table className="bg-slate-800 rounded-lg w-full">
      <thead>
        <tr className="border-b border-slate-700">
          <SortableHeader
            column="name"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
            className="px-6 py-4 text-left text-sm font-semibold text-white"
          >
            Name
          </SortableHeader>
          <SortableHeader
            column="status"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          >
            Status
          </SortableHeader>
          <SortableHeader
            column="severity"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          >
            Severity
          </SortableHeader>
          <SortableHeader
            column="min"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          >
            Min
          </SortableHeader>
          <SortableHeader
            column="max"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          >
            Max
          </SortableHeader>
          <SortableHeader
            column="totalCount"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          >
            Count
          </SortableHeader>
          <SortableHeader
            column="errorPercentage"
            sortColumn="name"
            sortDirection="asc"
            onSort={() => {}}
          >
            Errors
          </SortableHeader>
        </tr>
      </thead>
    </table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing all column types in a complete table header',
      },
    },
  },
};
