import type { Meta, StoryObj } from '@storybook/react';
// Using a simple mock function instead of @storybook/test
const fn = () => () => {};
import ScenarioSelector from './ScenarioSelector';

const mockScenarios = [
  {
    id: 'scenario-1',
    name: 'Peak Hour Load Test',
    description: 'High traffic simulation during peak hours',
  },
  {
    id: 'scenario-2',
    name: 'Baseline Performance Test',
    description: 'Standard performance baseline measurement',
  },
  {
    id: 'scenario-3',
    name: 'Stress Test',
    description: 'Maximum load capacity testing',
  },
  {
    id: 'scenario-4',
    name: 'Long Scenario Name That Might Overflow',
    description: 'This is a very long description to test how the component handles text overflow and wrapping in various scenarios',
  },
];

const meta: Meta<typeof ScenarioSelector> = {
  title: 'Components/ScenarioSelector',
  component: ScenarioSelector,
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
    selectedScenario: {
      control: 'select',
      options: mockScenarios.map(s => s.id),
      description: 'Currently selected scenario ID',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state of the component',
    },
    isDropdownOpen: {
      control: 'boolean',
      description: 'Whether the dropdown is open',
    },
    onScenarioChange: {
      action: 'scenario-changed',
      description: 'Callback fired when a scenario is selected',
    },
    onToggleDropdown: {
      action: 'dropdown-toggled',
      description: 'Callback fired when dropdown is toggled',
    },
    onCloseDropdown: {
      action: 'dropdown-closed',
      description: 'Callback fired when dropdown should close',
    },
  },
  args: {
    availableScenarios: mockScenarios,
    onScenarioChange: fn(),
    onToggleDropdown: fn(),
    onCloseDropdown: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedScenario: 'scenario-1',
    currentScenario: mockScenarios[0],
    isLoading: false,
    isDropdownOpen: false,
  },
};

export const Loading: Story = {
  args: {
    selectedScenario: 'scenario-1',
    currentScenario: mockScenarios[0],
    isLoading: true,
    isDropdownOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state shows "Loading..." text and disables the button.',
      },
    },
  },
};

export const DropdownOpen: Story = {
  args: {
    selectedScenario: 'scenario-1',
    currentScenario: mockScenarios[0],
    isLoading: false,
    isDropdownOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown open state showing all available scenarios with descriptions.',
      },
    },
  },
};

export const NoCurrentScenario: Story = {
  args: {
    selectedScenario: '',
    currentScenario: null,
    isLoading: false,
    isDropdownOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'State when no scenario is currently selected, showing "Select Scenario" placeholder.',
      },
    },
  },
};

export const DifferentSelections: Story = {
  args: {
    selectedScenario: 'scenario-2',
    currentScenario: mockScenarios[1],
    isLoading: false,
    isDropdownOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows different scenario selected (Baseline Performance Test) with dropdown open.',
      },
    },
  },
};

export const StressTestSelected: Story = {
  args: {
    selectedScenario: 'scenario-3',
    currentScenario: mockScenarios[2],
    isLoading: false,
    isDropdownOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stress Test scenario selected with dropdown showing selection highlight.',
      },
    },
  },
};

export const LongTextHandling: Story = {
  args: {
    selectedScenario: 'scenario-4',
    currentScenario: mockScenarios[3],
    isLoading: false,
    isDropdownOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests how the component handles long scenario names and descriptions.',
      },
    },
  },
};

export const EmptyScenarios: Story = {
  args: {
    selectedScenario: '',
    currentScenario: null,
    availableScenarios: [],
    isLoading: false,
    isDropdownOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge case with no available scenarios.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    selectedScenario: 'scenario-1',
    currentScenario: mockScenarios[0],
    isLoading: false,
    isDropdownOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example - click to toggle dropdown and select scenarios. Check Actions panel for events.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Default State</h3>
        <ScenarioSelector
          selectedScenario="scenario-1"
          currentScenario={mockScenarios[0]}
          availableScenarios={mockScenarios}
          isLoading={false}
          isDropdownOpen={false}
          onScenarioChange={fn()}
          onToggleDropdown={fn()}
          onCloseDropdown={fn()}
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Loading State</h3>
        <ScenarioSelector
          selectedScenario="scenario-1"
          currentScenario={mockScenarios[0]}
          availableScenarios={mockScenarios}
          isLoading={true}
          isDropdownOpen={false}
          onScenarioChange={fn()}
          onToggleDropdown={fn()}
          onCloseDropdown={fn()}
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Dropdown Open</h3>
        <ScenarioSelector
          selectedScenario="scenario-2"
          currentScenario={mockScenarios[1]}
          availableScenarios={mockScenarios}
          isLoading={false}
          isDropdownOpen={true}
          onScenarioChange={fn()}
          onToggleDropdown={fn()}
          onCloseDropdown={fn()}
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">No Current Scenario</h3>
        <ScenarioSelector
          selectedScenario=""
          currentScenario={null}
          availableScenarios={mockScenarios}
          isLoading={false}
          isDropdownOpen={false}
          onScenarioChange={fn()}
          onToggleDropdown={fn()}
          onCloseDropdown={fn()}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all possible states of the ScenarioSelector component.',
      },
    },
  },
};
