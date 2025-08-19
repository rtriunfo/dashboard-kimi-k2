import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTableFilters } from './RequestsTableFilters';
import testData from '../../config/testReport.json';

const meta: Meta<typeof RequestsTableFilters> = {
  title: 'Components/RequestsTableFilters',
  component: RequestsTableFilters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RequestsTableFilters>;

const typedTestData = testData as any;

const correctedRequestResults = typedTestData.requestResults.map((r: any) => ({
  ...r,
  rate: parseFloat(r.rate),
  errorPercentage: parseFloat(r.errorPercentage),
}));

const correctedTestData = {
  ...typedTestData.testRun,
  requestResults: correctedRequestResults,
};

export const Default: Story = {
  args: {
    testData: correctedTestData,
    availableStatuses: ['PASS', 'FAIL'],
    availableSeverities: ['CRITICAL', 'MINOR', 'NONE'],
    numericFields: [
      { key: 'min', label: 'Min Response Time' },
      { key: 'max', label: 'Max Response Time' },
    ],
    selectedStatuses: new Set(['PASS']),
    selectedSeverities: new Set(),
    numericField: '',
    numericOperator: 'gt',
    numericValue: '',
    isNumericDropdownOpen: false,
    isAllExpanded: false,
    numericDropdownRef: React.createRef<HTMLDivElement>(),
    requestResults: correctedTestData.requestResults || [],
    onStatusToggle: () => console.log('Toggled status'),
    onSeverityToggle: () => console.log('Toggled severity'),
    setNumericField: () => console.log('Set numeric field'),
    setNumericOperator: () => console.log('Set numeric operator'),
    setNumericValue: () => console.log('Set numeric value'),
    setIsNumericDropdownOpen: () => console.log('Set numeric dropdown open'),
    toggleExpandAll: () => console.log('Toggled expand all'),
    clearFilters: () => console.log('Cleared filters'),
  },
};
