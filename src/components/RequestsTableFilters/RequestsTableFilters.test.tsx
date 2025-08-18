import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestsTableFilters } from './RequestsTableFilters';
import testData from '../../config/testReport.json';

describe('RequestsTableFilters', () => {
  // Correctly type the imported JSON data
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

  const mockProps = {
    testData: correctedTestData,
    availableStatuses: ['PASS', 'FAIL'],
    availableSeverities: ['CRITICAL', 'MINOR'],
    numericFields: [{ key: 'min', label: 'Min Response Time' }],
    selectedStatuses: new Set<string>(['PASS']),
    selectedSeverities: new Set<string>(),
    numericField: '',
    numericOperator: 'gt' as 'gt' | 'lt',
    numericValue: '',
    isNumericDropdownOpen: false,
    isAllExpanded: false,
    numericDropdownRef: React.createRef<HTMLDivElement>(),
    requestResults: correctedTestData.requestResults || [],
    onStatusToggle: jest.fn(),
    onSeverityToggle: jest.fn(),
    setNumericField: jest.fn(),
    setNumericOperator: jest.fn(),
    setNumericValue: jest.fn(),
    setIsNumericDropdownOpen: jest.fn(),
    toggleExpandAll: jest.fn(),
    clearFilters: jest.fn(),
  };

  it('renders all filter components when data is available', () => {
    render(<RequestsTableFilters {...mockProps} />);

    // Check if filter dropdowns are present
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Numeric Filter')).toBeInTheDocument();

    // Check for action buttons
    expect(screen.getByText('Expand All')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('does not render anything when no filters are available', () => {
    const props = {
      ...mockProps,
      testData: { ...mockProps.testData, testRequirements: undefined, severityVersion: undefined },
      availableStatuses: [],
      availableSeverities: [],
      numericFields: [],
      selectedStatuses: new Set<string>(),
      selectedSeverities: new Set<string>(),
    };
    render(<RequestsTableFilters {...props} />);
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.queryByText('Severity')).not.toBeInTheDocument();
    expect(screen.queryByText('Numeric Filter')).not.toBeInTheDocument();
    expect(screen.queryByText('Expand All')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('shows Status filter only when testRequirements is truthy and statuses available', () => {
    const base = { ...mockProps };
    // Visible
    render(<RequestsTableFilters {...base} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('hides Status filter when no statuses or no testRequirements', () => {
    const noStatuses = { ...mockProps, availableStatuses: [] };
    const { rerender } = render(<RequestsTableFilters {...noStatuses} />);
    expect(screen.queryByText('Status')).not.toBeInTheDocument();

    const noReqs = { ...mockProps, testData: { ...mockProps.testData, testRequirements: undefined } } as any;
    rerender(<RequestsTableFilters {...noReqs} />);
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('shows Severity filter only when severityVersion is truthy and severities available', () => {
    const base = { ...mockProps };
    render(<RequestsTableFilters {...base} />);
    expect(screen.getByText('Severity')).toBeInTheDocument();
  });

  it('hides Severity filter when no severities or no severityVersion', () => {
    const noSeverities = { ...mockProps, availableSeverities: [] };
    const { rerender } = render(<RequestsTableFilters {...noSeverities} />);
    expect(screen.queryByText('Severity')).not.toBeInTheDocument();

    const noVersion = { ...mockProps, testData: { ...mockProps.testData, severityVersion: undefined } } as any;
    rerender(<RequestsTableFilters {...noVersion} />);
    expect(screen.queryByText('Severity')).not.toBeInTheDocument();
  });

  it('shows or hides Numeric filter based on numericFields length', () => {
    const { rerender } = render(<RequestsTableFilters {...mockProps} />);
    expect(screen.getByText('Numeric Filter')).toBeInTheDocument();

    const noNumeric = { ...mockProps, numericFields: [] };
    rerender(<RequestsTableFilters {...noNumeric} />);
    expect(screen.queryByText('Numeric Filter')).not.toBeInTheDocument();
  });

  it('shows Clear button when any filter is active: statuses', () => {
    render(<RequestsTableFilters {...mockProps} />);
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('shows Clear button when numeric filter active, hides on edge cases', () => {
    const activeNumeric = {
      ...mockProps,
      selectedStatuses: new Set<string>(),
      selectedSeverities: new Set<string>(),
      numericField: 'min',
      numericValue: '100',
    };
    const { rerender } = render(<RequestsTableFilters {...activeNumeric} />);
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();

    // Field set but empty value => hidden
    const fieldOnly = { ...activeNumeric, numericValue: '' };
    rerender(<RequestsTableFilters {...fieldOnly} />);
    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();

    // Value set but empty field => hidden
    const valueOnly = { ...activeNumeric, numericField: '' } as any;
    rerender(<RequestsTableFilters {...valueOnly} />);
    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('hides Clear button when no filters are active', () => {
    const noneActive = {
      ...mockProps,
      selectedStatuses: new Set<string>(),
      selectedSeverities: new Set<string>(),
      numericField: '',
      numericValue: '',
    };
    render(<RequestsTableFilters {...noneActive} />);
    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('invokes clearFilters when Clear all filters is clicked', async () => {
    const user = userEvent.setup();
    const props = { ...mockProps, clearFilters: jest.fn() };
    render(<RequestsTableFilters {...props} />);
    await user.click(screen.getByText('Clear all filters'));
    expect(props.clearFilters).toHaveBeenCalledTimes(1);
  });

  it('toggle expand/collapse label and classes based on isAllExpanded', () => {
    const { rerender } = render(<RequestsTableFilters {...mockProps} />);
    const expandBtn = screen.getByRole('button', { name: /Expand All/i });
    expect(expandBtn).toBeInTheDocument();
    expect(expandBtn).toHaveClass('bg-slate-800/50');

    rerender(<RequestsTableFilters {...mockProps} isAllExpanded />);
    const collapseBtn = screen.getByRole('button', { name: /Collapse All/i });
    expect(collapseBtn).toBeInTheDocument();
    expect(collapseBtn).toHaveClass('bg-blue-500/20');
  });

  it('calls toggleExpandAll when the expand/collapse button is clicked', async () => {
    const user = userEvent.setup();
    const props = { ...mockProps, toggleExpandAll: jest.fn() };
    render(<RequestsTableFilters {...props} />);
    await user.click(screen.getByRole('button', { name: /Expand All/i }));
    expect(props.toggleExpandAll).toHaveBeenCalledTimes(1);
  });
});
