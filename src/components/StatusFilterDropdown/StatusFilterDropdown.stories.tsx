import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import StatusFilterDropdown from './StatusFilterDropdown';
import { RequestResult } from '../../types';

export default {
  title: 'Components/StatusFilterDropdown',
  component: StatusFilterDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dropdown component for filtering request results by status.',
      },
    },
  },
  argTypes: {
    selectedStatuses: {
      control: { type: 'object' },
      description: 'Set of currently selected statuses',
    },
    availableStatuses: {
      control: { type: 'array' },
      description: 'Array of available status options',
    },
    requestResults: {
      control: { disable: true },
      description: 'Array of request results to calculate counts from',
    },
    onStatusToggle: {
      action: 'status-toggled',
      description: 'Callback when a status is toggled',
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
} as Meta<typeof StatusFilterDropdown>;

type Story = StoryObj<typeof StatusFilterDropdown>;

const mockRequestResults: RequestResult[] = [
  { id: 1, status: 'PASSED', request: { requestName: 'Test 1' } },
  { id: 2, status: 'FAILED', request: { requestName: 'Test 2' } },
  { id: 3, status: 'PASSED', request: { requestName: 'Test 3' } },
  { id: 4, status: 'SKIPPED', request: { requestName: 'Test 4' } },
];

export const Default: Story = {
  args: {
    selectedStatuses: new Set(),
    availableStatuses: ['PASSED', 'FAILED', 'SKIPPED'],
    requestResults: mockRequestResults,
    hasActiveFilters: false,
  },
};

export const WithSelectedFilters: Story = {
  args: {
    selectedStatuses: new Set(['PASSED', 'FAILED']),
    availableStatuses: ['PASSED', 'FAILED', 'SKIPPED'],
    requestResults: mockRequestResults,
    hasActiveFilters: true,
  },
};

export const SingleSelection: Story = {
  args: {
    selectedStatuses: new Set(['FAILED']),
    availableStatuses: ['PASSED', 'FAILED', 'SKIPPED'],
    requestResults: mockRequestResults,
    hasActiveFilters: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const handleStatusToggle = (status: string) => {
      const newSelectedStatuses = new Set(selectedStatuses);
      if (newSelectedStatuses.has(status)) {
        newSelectedStatuses.delete(status);
      } else {
        newSelectedStatuses.add(status);
      }
      setSelectedStatuses(newSelectedStatuses);
      setHasActiveFilters(newSelectedStatuses.size > 0);
    };

    const handleClearFilters = () => {
      setSelectedStatuses(new Set());
      setHasActiveFilters(false);
    };

    return (
      <StatusFilterDropdown
        {...args}
        selectedStatuses={selectedStatuses}
        hasActiveFilters={hasActiveFilters}
        onStatusToggle={handleStatusToggle}
        onClearFilters={handleClearFilters}
      />
    );
  },
  args: {
    availableStatuses: ['PASSED', 'FAILED', 'SKIPPED'],
    requestResults: mockRequestResults,
  },
};
