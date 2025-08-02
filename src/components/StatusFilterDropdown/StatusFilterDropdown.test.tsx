import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusFilterDropdown from './StatusFilterDropdown';
import '@testing-library/jest-dom';

describe('StatusFilterDropdown', () => {
  const mockRequestResults = [
    { id: 1, status: 'PASSED', request: { requestName: 'Test 1' } },
    { id: 2, status: 'FAILED', request: { requestName: 'Test 2' } },
    { id: 3, status: 'PASSED', request: { requestName: 'Test 3' } },
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
    expect(screen.getByText('Status ▼')).toBeInTheDocument();
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
    const button = screen.getByText('Status ▼');
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
    
    const button = screen.getByText('Status ▼');
    fireEvent.click(button);
    
    const passedOption = screen.getByText('PASSED');
    fireEvent.click(passedOption);
    
    expect(mockOnStatusToggle).toHaveBeenCalledWith('PASSED');
  });

  it('shows clear filters option when filters are active', () => {
    const props = {
      ...defaultProps,
      hasActiveFilters: true,
    };
    render(<StatusFilterDropdown {...props} />);
    
    const button = screen.getByText('Status ▼');
    fireEvent.click(button);
    
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('calls onClearFilters when clear filters is clicked', () => {
    const mockOnClearFilters = jest.fn();
    const props = {
      ...defaultProps,
      hasActiveFilters: true,
      onClearFilters: mockOnClearFilters,
    };
    render(<StatusFilterDropdown {...props} />);
    
    const button = screen.getByText('Status ▼');
    fireEvent.click(button);
    
    const clearButton = screen.getByText('Clear filters');
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('closes dropdown when clicking outside', () => {
    render(<StatusFilterDropdown {...defaultProps} />);
    
    const button = screen.getByText('Status ▼');
    fireEvent.click(button);
    expect(screen.getByText('PASSED')).toBeInTheDocument();
    
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('PASSED')).not.toBeInTheDocument();
  });
});
