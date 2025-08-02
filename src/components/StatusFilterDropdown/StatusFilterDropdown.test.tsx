import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusFilterDropdown from './StatusFilterDropdown';
import '@testing-library/jest-dom';

describe('StatusFilterDropdown', () => {
  const mockRequestResults = [
    { 
      id: 1, 
      status: 'PASSED', 
      severity: 'minor',
      request: { requestName: 'Test 1' },
      totalCount: 100,
      passCount: 100,
      failCount: 0,
      errorPercentage: 0,
      responseTimes: { min: 10, max: 50, percentiles: { '50': 25, '95': 45 } },
      rate: 10,
      rateGranularity: 'second',
      testRequirements: true,
      statistics: {},
      requirements: []
    },
    { 
      id: 2, 
      status: 'FAILED', 
      severity: 'major',
      request: { requestName: 'Test 2' },
      totalCount: 100,
      passCount: 80,
      failCount: 20,
      errorPercentage: 20,
      responseTimes: { min: 15, max: 100, percentiles: { '50': 30, '95': 80 } },
      rate: 10,
      rateGranularity: 'second',
      testRequirements: true,
      statistics: {},
      requirements: []
    },
    { 
      id: 3, 
      status: 'PASSED', 
      severity: 'minor',
      request: { requestName: 'Test 3' },
      totalCount: 100,
      passCount: 100,
      failCount: 0,
      errorPercentage: 0,
      responseTimes: { min: 8, max: 40, percentiles: { '50': 20, '95': 35 } },
      rate: 10,
      rateGranularity: 'second',
      testRequirements: true,
      statistics: {},
      requirements: []
    },
  ];

  const defaultProps = {
    selectedStatuses: new Set<string>(),
    availableStatuses: ['PASSED', 'FAILED'],
    requestResults: mockRequestResults,
    onStatusToggle: jest.fn(),
    onClearFilters: jest.fn(),
    hasActiveFilters: false,
  };

  it('renders the dropdown button with default text', () => {
    render(<StatusFilterDropdown {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows the count of selected statuses', () => {
    const props = {
      ...defaultProps,
      selectedStatuses: new Set(['PASSED']),
      hasActiveFilters: true,
    };
    render(<StatusFilterDropdown {...props} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens dropdown when button is clicked', () => {
    render(<StatusFilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    expect(screen.getByText('PASSED')).toBeInTheDocument();
    expect(screen.getByText('FAILED')).toBeInTheDocument();
  });

  it('calls onStatusToggle when status is clicked', () => {
    const mockOnStatusToggle = jest.fn();
    const props = {
      ...defaultProps,
      onStatusToggle: mockOnStatusToggle,
    };
    render(<StatusFilterDropdown {...props} />);
    
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    
    const passedCheckbox = screen.getByRole('checkbox', { name: /passed/i });
    fireEvent.click(passedCheckbox);
    
    expect(mockOnStatusToggle).toHaveBeenCalledWith('PASSED');
  });

  it('shows clear filters option when filters are active', () => {
    const props = {
      ...defaultProps,
      hasActiveFilters: true,
    };
    render(<StatusFilterDropdown {...props} />);
    
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('calls onClearFilters when clear filters is clicked', () => {
    const mockOnClearFilters = jest.fn();
    const props = {
      ...defaultProps,
      hasActiveFilters: true,
      onClearFilters: mockOnClearFilters,
    };
    render(<StatusFilterDropdown {...props} />);
    
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    
    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('closes dropdown when clicking outside', () => {
    render(<StatusFilterDropdown {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    expect(screen.getByText('PASSED')).toBeInTheDocument();
    
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('PASSED')).not.toBeInTheDocument();
  });
});
