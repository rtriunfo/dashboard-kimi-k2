import React, { useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import NumericFilterDropdown, { NumericFieldDef } from './NumericFilterDropdown';
import '../../index.css';

const numericFields: NumericFieldDef[] = [
  { key: 'min', label: 'Min Response Time' },
  { key: 'max', label: 'Max Response Time' },
];

const meta: Meta<typeof NumericFilterDropdown> = {
  title: 'Components/NumericFilterDropdown',
  component: NumericFilterDropdown,
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
        component:
          'A dropdown component for filtering request results by numeric fields (e.g., min/max response time). Uses controlled props for field, operator, and value.',
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
    // Controlled props are managed internally in stories
    setNumericField: { control: { disable: true } },
    setNumericOperator: { control: { disable: true } },
    setNumericValue: { control: { disable: true } },
    setIsOpen: { control: { disable: true } },
    dropdownRef: { control: { disable: true } },
    onClearFilters: { control: { disable: true } },
    hasActiveFilters: { control: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof NumericFilterDropdown>;

export const Interactive: Story = {
  render: (args) => {
    const [numericField, setNumericField] = useState(args.numericField ?? '');
    const [numericOperator, setNumericOperator] = useState<'gt' | 'lt'>(args.numericOperator ?? 'gt');
    const [numericValue, setNumericValue] = useState(args.numericValue ?? '');
    const [isOpen, setIsOpen] = useState<boolean>(args.isOpen ?? true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hasActiveFilters = Boolean(numericField && numericValue);

    return (
      <NumericFilterDropdown
        {...args}
        numericFields={args.numericFields ?? numericFields}
        numericField={numericField}
        setNumericField={setNumericField}
        numericOperator={numericOperator}
        setNumericOperator={setNumericOperator}
        numericValue={numericValue}
        setNumericValue={setNumericValue}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dropdownRef={dropdownRef}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setNumericField('');
          setNumericValue('');
        }}
      />
    );
  },
  args: {
    numericFields,
    isOpen: true,
  },
};

export const DefaultClosed: Story = {
  ...Interactive,
  args: {
    numericFields,
    isOpen: false,
  },
};

export const WithSelection: Story = {
  ...Interactive,
  args: {
    numericFields,
    isOpen: true,
    numericField: 'min',
    numericOperator: 'gt',
    numericValue: '100',
  },
};
