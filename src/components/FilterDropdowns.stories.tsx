import type { Meta, StoryObj } from '@storybook/react';
import { FilterDropdowns } from './FilterDropdowns';
import { TestResults, RequestResult } from '../types';

// Mock test data
const mockTestData: TestResults = {
  testRequirements: true,
  severityVersion: '1.0',
  scenarios: []
};

const mockRequestResults: RequestResult[] = [
  {
    id: '1',
    name: 'Login Request',
    status: 'PASS',
    severity: 'LOW',
    responseTime: { min: 100, max: 200, p50: 150, p95: 180, p99: 190 }
  },
  {
    id: '2',
    name: 'Search Request',
    status: 'FAIL',
    severity: 'HIGH',
    responseTime: { min: 200, max: 400, p50: 300, p95: 380, p99: 390 }
  },
  {
    id: '3',
    name: 'Profile Request',
    status: 'PASS',
    severity: 'MEDIUM',
    responseTime: { min: 50, max: 150, p50: 100, p95: 140, p99: 145 }
  }
];

const mockNumericFields = [
  { key: 'responseTime.min', label: 'Min Response Time' },
  { key: 'responseTime.max', label: 'Max Response Time' },
  { key: 'responseTime.p50', label: 'P50 Response Time' },
  { key: 'responseTime.p95', label: 'P95 Response Time' }
];

const meta: Meta<typeof FilterDropdowns> = {
  title: 'Components/FilterDropdowns',
  component: FilterDropdowns,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FilterDropdowns component provides filtering controls for status, severity, and numeric fields with expand/collapse functionality for table data.',
      },
    },
  },
  argTypes: {
    testData: {
      description: 'Test data configuration object',
      control: { type: 'object' }
    },
    requestResults: {
      description: 'Array of request results to filter',
      control: { type: 'object' }
    },
    availableStatuses: {
      description: 'Available status options for filtering',
      control: { type: 'object' }
    },
    availableSeverities: {
      description: 'Available severity options for filtering',
      control: { type: 'object' }
    },
    numericFields: {
      description: 'Available numeric fields for filtering',
      control: { type: 'object' }
    },
    selectedStatuses: {
      description: 'Currently selected status filters',
      control: { type: 'object' }
    },
    selectedSeverities: {
      description: 'Currently selected severity filters',
      control: { type: 'object' }
    },
    isAllExpanded: {
      description: 'Whether all rows are expanded',
      control: { type: 'boolean' }
    },
    numericOperator: {
      description: 'Numeric filter operator (gt or lt)',
      control: { type: 'select' },
      options: ['gt', 'lt']
    }
  },
};

export default meta;
type Story = StoryObj<typeof FilterDropdowns>;

// Default story with all filters available
export const Default: Story = {
  args: {
    testData: mockTestData,
    requestResults: mockRequestResults,
    availableStatuses: ['PASS', 'FAIL'],
    availableSeverities: ['LOW', 'MEDIUM', 'HIGH'],
    numericFields: mockNumericFields,
    selectedStatuses: new Set(),
    isDropdownOpen: false,
    setIsDropdownOpen: () => {},
    handleStatusToggle: () => {},
    selectedSeverities: new Set(),
    isSeverityDropdownOpen: false,
    setIsSeverityDropdownOpen: () => {},
    handleSeverityToggle: () => {},
    numericField: '',
    numericOperator: 'gt',
    numericValue: '',
    isNumericDropdownOpen: false,
    setNumericField: () => {},
    setNumericOperator: () => {},
    setNumericValue: () => {},
    setIsNumericDropdownOpen: () => {},
    isAllExpanded: false,
    toggleExpandAll: () => {},
    clearFilters: () => {}
  },
};

// Story with status dropdown open
export const StatusDropdownOpen: Story = {
  args: {
    ...Default.args,
    isDropdownOpen: true,
  },
};

// Story with severity dropdown open
export const SeverityDropdownOpen: Story = {
  args: {
    ...Default.args,
    isSeverityDropdownOpen: true,
  },
};

// Story with numeric dropdown open
export const NumericDropdownOpen: Story = {
  args: {
    ...Default.args,
    isNumericDropdownOpen: true,
  },
};

// Story with active filters
export const WithActiveFilters: Story = {
  args: {
    ...Default.args,
    selectedStatuses: new Set(['PASS']),
    selectedSeverities: new Set(['HIGH', 'MEDIUM']),
    numericField: 'responseTime.min',
    numericValue: '100',
  },
};

// Story with all expanded
export const AllExpanded: Story = {
  args: {
    ...Default.args,
    isAllExpanded: true,
  },
};

// Story with only status filter available
export const StatusFilterOnly: Story = {
  args: {
    ...Default.args,
    testData: { ...mockTestData, severityVersion: undefined },
    availableSeverities: [],
    numericFields: [],
  },
};

// Story with only severity filter available
export const SeverityFilterOnly: Story = {
  args: {
    ...Default.args,
    testData: { ...mockTestData, testRequirements: false },
    availableStatuses: [],
    numericFields: [],
  },
};

// Story with only numeric filter available
export const NumericFilterOnly: Story = {
  args: {
    ...Default.args,
    testData: { ...mockTestData, testRequirements: false, severityVersion: undefined },
    availableStatuses: [],
    availableSeverities: [],
  },
};

// Story with no filters available
export const NoFiltersAvailable: Story = {
  args: {
    ...Default.args,
    testData: { ...mockTestData, testRequirements: false, severityVersion: undefined },
    availableStatuses: [],
    availableSeverities: [],
    numericFields: [],
  },
};

// Story with numeric filter configured
export const NumericFilterConfigured: Story = {
  args: {
    ...Default.args,
    isNumericDropdownOpen: true,
    numericField: 'responseTime.p95',
    numericOperator: 'lt',
    numericValue: '200',
  },
};

// Interactive story for testing all functionality
export const Interactive: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version of FilterDropdowns where you can test all filtering functionality including dropdowns, selections, and expand/collapse controls.',
      },
    },
  },
};
