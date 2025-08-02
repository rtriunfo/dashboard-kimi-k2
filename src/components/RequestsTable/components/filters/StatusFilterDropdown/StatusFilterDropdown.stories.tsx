import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { StatusFilterDropdown } from './StatusFilterDropdown';
import { RequestResult } from '../../../../../types';

export default {
  title: 'Components/RequestsTable/Filters/StatusFilterDropdown',
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
      action: 'statusToggled',
      description: 'Callback when a status is toggled',
    },
    onClearFilters: {
      action: 'filtersCleared',
      description: 'Callback to clear all filters',
    },
    hasActiveFilters: {
      control: 'boolean',
      description: 'Whether there are active filters to clear',
    },
  },
} as Meta<typeof StatusFilterDropdown>;

// Mock data
const mockRequestResults: RequestResult[] = [
  { id: 1, status: 'PASSED', request: { requestName: 'Test 1' } },
  { id: 2, status: 'FAILED', request: { requestName: 'Test 2' } },
  { id: 3, status: 'PASSED', request: { requestName: 'Test 3' } },
  { id: 4, status: 'SKIPPED', request: { requestName: 'Test 4' } },
];

const Template: StoryObj<typeof StatusFilterDropdown> = {
  render: (args) => {
    const [selected, setSelected] = useState<Set<string>>(new Set(args.selectedStatuses));
    
    const handleStatusToggle = (status: string) => {
      const newSelected = new Set(selected);
      if (newSelected.has(status)) {
        newSelected.delete(status);
      } else {
        newSelected.add(status);
      }
      setSelected(newSelected);
      args.onStatusToggle?.(status);
    };
    
    const handleClearFilters = () => {
      setSelected(new Set());
      args.onClearFilters?.();
    };
    
    return (
      <div className="p-4 bg-slate-900 rounded-lg">
        <StatusFilterDropdown
          {...args}
          selectedStatuses={selected}
          onStatusToggle={handleStatusToggle}
          onClearFilters={handleClearFilters}
          hasActiveFilters={selected.size > 0}
        />
      </div>
    );
  },
};

export const Default = {
  ...Template,
  args: {
    selectedStatuses: new Set(),
    availableStatuses: ['PASSED', 'FAILED', 'SKIPPED', 'BROKEN'],
    requestResults: mockRequestResults,
    hasActiveFilters: false,
  },
};

export const WithSelectedStatus = {
  ...Template,
  args: {
    ...Default.args,
    selectedStatuses: new Set(['PASSED']),
    hasActiveFilters: true,
  },
};

export const WithMultipleSelected = {
  ...Template,
  args: {
    ...Default.args,
    selectedStatuses: new Set(['PASSED', 'FAILED']),
    hasActiveFilters: true,
  },
};

export const WithManyStatuses = {
  ...Template,
  args: {
    ...Default.args,
    availableStatuses: [
      'PASSED', 'FAILED', 'SKIPPED', 'BROKEN', 
      'PENDING', 'RUNNING', 'COMPLETED', 'CANCELLED'
    ],
  },
};
