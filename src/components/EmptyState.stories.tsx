import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: 'A reusable empty state component that displays a centered message with consistent styling across the application. Used to inform users when no data is available or when filters return no results.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'The message to display in the empty state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// Primary usage story
export const Default: Story = {
  args: {
    message: 'No data available',
  },
};

// Variants for different use cases
export const NoTestData: Story = {
  args: {
    message: 'No test data available',
  },
};

export const NoRequestData: Story = {
  args: {
    message: 'No request data available',
  },
};

export const NoMatchingFilters: Story = {
  args: {
    message: 'No requests match the selected filters',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'This is a longer message that demonstrates how the empty state component handles extended text content that might wrap to multiple lines',
  },
};

export const CustomStyling: Story = {
  args: {
    message: 'Custom styled empty state',
    className: 'text-center py-12 text-blue-400 text-lg font-semibold bg-slate-800/50 rounded-lg border border-blue-500/20',
  },
};

export const ErrorState: Story = {
  args: {
    message: 'Failed to load data. Please try again.',
    className: 'text-center py-8 text-red-400',
  },
};

export const SuccessState: Story = {
  args: {
    message: 'All tasks completed successfully!',
    className: 'text-center py-8 text-green-400',
  },
};

export const MinimalPadding: Story = {
  args: {
    message: 'Compact empty state',
    className: 'text-center py-4 text-slate-400 text-sm',
  },
};

export const LargePadding: Story = {
  args: {
    message: 'Spacious empty state',
    className: 'text-center py-16 text-slate-400 text-xl',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="bg-slate-800/30 rounded-lg">
        <EmptyState message="Default styling" />
      </div>
      <div className="bg-slate-800/30 rounded-lg">
        <EmptyState 
          message="Error state" 
          className="text-center py-8 text-red-400" 
        />
      </div>
      <div className="bg-slate-800/30 rounded-lg">
        <EmptyState 
          message="Success state" 
          className="text-center py-8 text-green-400" 
        />
      </div>
      <div className="bg-slate-800/30 rounded-lg">
        <EmptyState 
          message="Warning state" 
          className="text-center py-8 text-yellow-400" 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing different styling variants of the EmptyState component',
      },
    },
  },
};
