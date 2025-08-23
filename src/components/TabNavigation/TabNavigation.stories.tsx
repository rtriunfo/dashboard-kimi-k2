import type { Meta, StoryObj } from '@storybook/react';
// Using a simple mock function instead of @storybook/test
const fn = () => () => {};
import TabNavigation from './TabNavigation';

const meta: Meta<typeof TabNavigation> = {
  title: 'Components/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['summary', 'responseTimes', 'metadata', 'requests'],
      description: 'Currently active tab',
    },
    onTabChange: {
      action: 'tab-changed',
      description: 'Callback fired when a tab is clicked',
    },
  },
  args: {
    onTabChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeTab: 'summary',
  },
};

export const SummaryActive: Story = {
  args: {
    activeTab: 'summary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Summary tab is active, showing blue highlight and border.',
      },
    },
  },
};

export const ResponseTimesActive: Story = {
  args: {
    activeTab: 'responseTimes',
  },
  parameters: {
    docs: {
      description: {
        story: 'Response Times tab is active.',
      },
    },
  },
};

export const MetadataActive: Story = {
  args: {
    activeTab: 'metadata',
  },
  parameters: {
    docs: {
      description: {
        story: 'Metadata tab is active.',
      },
    },
  },
};

export const RequestsActive: Story = {
  args: {
    activeTab: 'requests',
  },
  parameters: {
    docs: {
      description: {
        story: 'Requests tab is active.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    activeTab: 'summary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example - click tabs to see state changes. Check the Actions panel to see callback events.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Summary Active</h3>
        <TabNavigation activeTab="summary" onTabChange={fn()} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Response Times Active</h3>
        <TabNavigation activeTab="responseTimes" onTabChange={fn()} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Metadata Active</h3>
        <TabNavigation activeTab="metadata" onTabChange={fn()} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Requests Active</h3>
        <TabNavigation activeTab="requests" onTabChange={fn()} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all possible active states for the tab navigation component.',
      },
    },
  },
};
