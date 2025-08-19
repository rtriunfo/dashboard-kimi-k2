import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import SeverityFilterDropdown from './SeverityFilterDropdown';
import { RequestResult } from '../../types';
import '../../index.css';

export default {
  title: 'Components/SeverityFilterDropdown',
  component: SeverityFilterDropdown,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component: 'A dropdown component for filtering request results by severity.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-slate-900 min-h-screen">
        <div className="flex gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    selectedSeverities: {
      control: { type: 'object' },
      description: 'Set of currently selected severities',
    },
    availableSeverities: {
      control: { type: 'array' },
      description: 'Array of available severity options',
    },
    requestResults: {
      control: { disable: true },
      description: 'Array of request results to calculate counts from',
    },
    onSeverityToggle: {
      action: 'severity-toggled',
      description: 'Callback when a severity is toggled',
    },
    onClearFilters: {
      action: 'filters-cleared',
      description: 'Callback when filters are cleared',
    },
    hasActiveFilters: {
      control: { type: 'boolean' },
      description: 'Whether there are active filters',
    },
  },
} as Meta<typeof SeverityFilterDropdown>;

type Story = StoryObj<typeof SeverityFilterDropdown>;

const mockRequestResults: RequestResult[] = [
  { id: 1, status: 'PASSED', severity: 'minor', request: { requestName: 'Test 1' } },
  { id: 2, status: 'FAILED', severity: 'major', request: { requestName: 'Test 2' } },
  { id: 3, status: 'PASSED', severity: 'minor', request: { requestName: 'Test 3' } },
  { id: 4, status: 'SKIPPED', severity: 'critical', request: { requestName: 'Test 4' } },
];

export const Default: Story = {
  args: {
    selectedSeverities: new Set(),
    availableSeverities: ['minor', 'major', 'critical'],
    requestResults: mockRequestResults,
    hasActiveFilters: false,
  },
};

export const WithSelectedFilters: Story = {
  args: {
    selectedSeverities: new Set(['minor', 'major']),
    availableSeverities: ['minor', 'major', 'critical'],
    requestResults: mockRequestResults,
    hasActiveFilters: true,
  },
};

export const SingleSelection: Story = {
  args: {
    selectedSeverities: new Set(['major']),
    availableSeverities: ['minor', 'major', 'critical'],
    requestResults: mockRequestResults,
    hasActiveFilters: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [selectedSeverities, setSelectedSeverities] = useState<Set<string>>(new Set());
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const handleSeverityToggle = (severity: string) => {
      const newSelectedSeverities = new Set(selectedSeverities);
      if (newSelectedSeverities.has(severity)) {
        newSelectedSeverities.delete(severity);
      } else {
        newSelectedSeverities.add(severity);
      }
      setSelectedSeverities(newSelectedSeverities);
      setHasActiveFilters(newSelectedSeverities.size > 0);
    };

    const handleClearFilters = () => {
      setSelectedSeverities(new Set());
      setHasActiveFilters(false);
    };

    return (
      <SeverityFilterDropdown
        {...args}
        selectedSeverities={selectedSeverities}
        hasActiveFilters={hasActiveFilters}
        onSeverityToggle={handleSeverityToggle}
        onClearFilters={handleClearFilters}
      />
    );
  },
  args: {
    availableSeverities: ['minor', 'major', 'critical'],
    requestResults: mockRequestResults,
  },
};
