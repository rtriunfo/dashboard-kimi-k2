import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    name: 'Test Request 1',
    status: 'PASS',
    severity: 'LOW',
    responseTime: { min: 100, max: 200, p50: 150, p95: 180, p99: 190 }
  },
  {
    id: '2',
    name: 'Test Request 2',
    status: 'FAIL',
    severity: 'HIGH',
    responseTime: { min: 200, max: 400, p50: 300, p95: 380, p99: 390 }
  }
];

const mockNumericFields = [
  { key: 'responseTime.min', label: 'Min Response Time' },
  { key: 'responseTime.max', label: 'Max Response Time' }
];

const defaultProps = {
  testData: mockTestData,
  requestResults: mockRequestResults,
  availableStatuses: ['PASS', 'FAIL'],
  availableSeverities: ['LOW', 'HIGH'],
  numericFields: mockNumericFields,
  selectedStatuses: new Set<string>(),
  isDropdownOpen: false,
  setIsDropdownOpen: jest.fn(),
  handleStatusToggle: jest.fn(),
  selectedSeverities: new Set<string>(),
  isSeverityDropdownOpen: false,
  setIsSeverityDropdownOpen: jest.fn(),
  handleSeverityToggle: jest.fn(),
  numericField: '',
  numericOperator: 'gt' as const,
  numericValue: '',
  isNumericDropdownOpen: false,
  setNumericField: jest.fn(),
  setNumericOperator: jest.fn(),
  setNumericValue: jest.fn(),
  setIsNumericDropdownOpen: jest.fn(),
  isAllExpanded: false,
  toggleExpandAll: jest.fn(),
  clearFilters: jest.fn()
};

describe('FilterDropdowns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders status filter dropdown when test requirements exist', () => {
    render(<FilterDropdowns {...defaultProps} />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders severity filter dropdown when severity version exists', () => {
    render(<FilterDropdowns {...defaultProps} />);
    
    expect(screen.getByText('Severity')).toBeInTheDocument();
  });

  it('renders numeric filter dropdown when numeric fields exist', () => {
    render(<FilterDropdowns {...defaultProps} />);
    
    expect(screen.getByText('Numeric Filter')).toBeInTheDocument();
  });

  it('renders expand all button', () => {
    render(<FilterDropdowns {...defaultProps} />);
    
    expect(screen.getByText('Expand All')).toBeInTheDocument();
  });

  it('shows collapse all when isAllExpanded is true', () => {
    render(<FilterDropdowns {...defaultProps} isAllExpanded={true} />);
    
    expect(screen.getByText('Collapse All')).toBeInTheDocument();
  });

  it('calls setIsDropdownOpen when status button is clicked', () => {
    const mockSetIsDropdownOpen = jest.fn();
    render(<FilterDropdowns {...defaultProps} setIsDropdownOpen={mockSetIsDropdownOpen} />);
    
    fireEvent.click(screen.getByText('Status'));
    
    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(true);
  });

  it('calls setIsSeverityDropdownOpen when severity button is clicked', () => {
    const mockSetIsSeverityDropdownOpen = jest.fn();
    render(<FilterDropdowns {...defaultProps} setIsSeverityDropdownOpen={mockSetIsSeverityDropdownOpen} />);
    
    fireEvent.click(screen.getByText('Severity'));
    
    expect(mockSetIsSeverityDropdownOpen).toHaveBeenCalledWith(true);
  });

  it('calls toggleExpandAll when expand all button is clicked', () => {
    const mockToggleExpandAll = jest.fn();
    render(<FilterDropdowns {...defaultProps} toggleExpandAll={mockToggleExpandAll} />);
    
    fireEvent.click(screen.getByText('Expand All'));
    
    expect(mockToggleExpandAll).toHaveBeenCalled();
  });

  it('shows selected status count badge', () => {
    const selectedStatuses = new Set(['PASS']);
    render(<FilterDropdowns {...defaultProps} selectedStatuses={selectedStatuses} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows selected severity count badge', () => {
    const selectedSeverities = new Set(['HIGH']);
    render(<FilterDropdowns {...defaultProps} selectedSeverities={selectedSeverities} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows numeric filter active badge when field and value are set', () => {
    render(<FilterDropdowns {...defaultProps} numericField="responseTime.min" numericValue="100" />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows clear filters button when filters are active', () => {
    const selectedStatuses = new Set(['PASS']);
    render(<FilterDropdowns {...defaultProps} selectedStatuses={selectedStatuses} />);
    
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('calls clearFilters when clear filters button is clicked', () => {
    const mockClearFilters = jest.fn();
    const selectedStatuses = new Set(['PASS']);
    render(<FilterDropdowns {...defaultProps} selectedStatuses={selectedStatuses} clearFilters={mockClearFilters} />);
    
    fireEvent.click(screen.getByText('Clear all filters'));
    
    expect(mockClearFilters).toHaveBeenCalled();
  });

  it('shows status dropdown content when isDropdownOpen is true', () => {
    render(<FilterDropdowns {...defaultProps} isDropdownOpen={true} />);
    
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('FAIL')).toBeInTheDocument();
  });

  it('shows severity dropdown content when isSeverityDropdownOpen is true', () => {
    render(<FilterDropdowns {...defaultProps} isSeverityDropdownOpen={true} />);
    
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('shows numeric dropdown content when isNumericDropdownOpen is true', () => {
    render(<FilterDropdowns {...defaultProps} isNumericDropdownOpen={true} />);
    
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('calls handleStatusToggle when status checkbox is clicked', () => {
    const mockHandleStatusToggle = jest.fn();
    render(<FilterDropdowns {...defaultProps} isDropdownOpen={true} handleStatusToggle={mockHandleStatusToggle} />);
    
    const passCheckbox = screen.getByRole('checkbox', { name: /PASS/i });
    fireEvent.click(passCheckbox);
    
    expect(mockHandleStatusToggle).toHaveBeenCalledWith('PASS');
  });

  it('calls handleSeverityToggle when severity checkbox is clicked', () => {
    const mockHandleSeverityToggle = jest.fn();
    render(<FilterDropdowns {...defaultProps} isSeverityDropdownOpen={true} handleSeverityToggle={mockHandleSeverityToggle} />);
    
    const lowCheckbox = screen.getByRole('checkbox', { name: /LOW/i });
    fireEvent.click(lowCheckbox);
    
    expect(mockHandleSeverityToggle).toHaveBeenCalledWith('LOW');
  });

  it('calls setNumericField when field select changes', () => {
    const mockSetNumericField = jest.fn();
    render(<FilterDropdowns {...defaultProps} isNumericDropdownOpen={true} setNumericField={mockSetNumericField} />);
    
    const fieldSelect = screen.getByDisplayValue('Select field...');
    fireEvent.change(fieldSelect, { target: { value: 'responseTime.min' } });
    
    expect(mockSetNumericField).toHaveBeenCalledWith('responseTime.min');
  });

  it('calls setNumericOperator when operator select changes', () => {
    const mockSetNumericOperator = jest.fn();
    render(<FilterDropdowns {...defaultProps} isNumericDropdownOpen={true} setNumericOperator={mockSetNumericOperator} />);
    
    const operatorSelect = screen.getByDisplayValue('Greater than');
    fireEvent.change(operatorSelect, { target: { value: 'lt' } });
    
    expect(mockSetNumericOperator).toHaveBeenCalledWith('lt');
  });

  it('calls setNumericValue when value input changes', () => {
    const mockSetNumericValue = jest.fn();
    render(<FilterDropdowns {...defaultProps} isNumericDropdownOpen={true} setNumericValue={mockSetNumericValue} />);
    
    const valueInput = screen.getByPlaceholderText('Enter number...');
    fireEvent.change(valueInput, { target: { value: '100' } });
    
    expect(mockSetNumericValue).toHaveBeenCalledWith('100');
  });

  it('shows numeric filter description when field and value are set', () => {
    render(<FilterDropdowns {...defaultProps} 
      isNumericDropdownOpen={true} 
      numericField="responseTime.min" 
      numericValue="100" 
    />);
    
    expect(screen.getByText(/Showing requests where/)).toBeInTheDocument();
    expect(screen.getByText(/Min Response Time/)).toBeInTheDocument();
    expect(screen.getByText(/greater than/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('handles edge case with no available statuses', () => {
    render(<FilterDropdowns {...defaultProps} availableStatuses={[]} />);
    
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('handles edge case with no available severities', () => {
    render(<FilterDropdowns {...defaultProps} availableSeverities={[]} />);
    
    expect(screen.queryByText('Severity')).not.toBeInTheDocument();
  });

  it('handles edge case with no numeric fields', () => {
    render(<FilterDropdowns {...defaultProps} numericFields={[]} />);
    
    expect(screen.queryByText('Numeric Filter')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<FilterDropdowns {...defaultProps} />);
    
    const statusButton = screen.getByText('Status');
    expect(statusButton).toHaveAttribute('type', 'button');
    
    const expandButton = screen.getByText('Expand All');
    expect(expandButton).toHaveAttribute('type', 'button');
  });
});
