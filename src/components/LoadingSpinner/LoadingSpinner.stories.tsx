import type { Meta, StoryObj } from '@storybook/react';
// Using a simple mock function instead of @storybook/test
const fn = () => () => {};
import LoadingSpinner from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Loading message to display',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the spinner and text',
    },
    fullScreen: {
      control: 'boolean',
      description: 'Whether to use full screen layout with gradient background',
    },
  },
  args: {
    message: 'Loading...',
    size: 'lg',
    fullScreen: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Loading...',
    size: 'lg',
    fullScreen: true,
  },
};

export const DashboardLoading: Story = {
  args: {
    message: 'Loading dashboard...',
    size: 'lg',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state for the main dashboard with custom message.',
      },
    },
  },
};

export const SmallSpinner: Story = {
  args: {
    message: 'Loading...',
    size: 'sm',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small spinner variant for compact loading states.',
      },
    },
  },
};

export const MediumSpinner: Story = {
  args: {
    message: 'Processing data...',
    size: 'md',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium spinner variant with custom message.',
      },
    },
  },
};

export const LargeSpinner: Story = {
  args: {
    message: 'Loading application...',
    size: 'lg',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large spinner variant for full application loading.',
      },
    },
  },
};

export const CompactLayout: Story = {
  args: {
    message: 'Loading...',
    size: 'md',
    fullScreen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout without full screen background, suitable for embedding in other components.',
      },
    },
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Fetching test results...',
    size: 'lg',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner with a custom descriptive message.',
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    message: 'Loading performance data and generating comprehensive analytics dashboard...',
    size: 'md',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner with a longer message to test text wrapping and layout.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="space-y-12">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Small Spinner</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <LoadingSpinner size="sm" message="Small loading..." fullScreen={false} />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Medium Spinner</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <LoadingSpinner size="md" message="Medium loading..." fullScreen={false} />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Large Spinner</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <LoadingSpinner size="lg" message="Large loading..." fullScreen={false} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all spinner sizes in compact layout.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    message: 'Loading...',
    size: 'lg',
    fullScreen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example - adjust props to see different spinner configurations.',
      },
    },
  },
};
