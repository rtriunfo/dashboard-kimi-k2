import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusFilterDropdown } from './StatusFilterDropdown';
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
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows the count of selected statuses', () => {
    const props = {
      ...defaultProps,
      selectedStatuses: new Set(['PASSED']),
    };
    render(<StatusFilterDropdown {...props} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', () => {
    render(<StatusFilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('calls onStatusToggle when a status is toggled', () => {
    const onStatusToggle = jest.fn();
    render(
      <StatusFilterDropdown
        {...defaultProps}
        onStatusToggle={onStatusToggle}
      />
    );
    
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    
    const passedCheckbox = screen.getByLabelText('Filter by PASSED status');
    fireEvent.click(passedCheckbox);
    
    expect(onStatusToggle).toHaveBeenCalledWith('PASSED');
  });

  it('shows the correct count for each status', () => {
    render(<StatusFilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    
    // Should show 2 PASSED (from mock data)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onClearFilters when clear button is clicked', () => {
    const onClearFilters = jest.fn();
    render(
      <StatusFilterDropdown
        {...defaultProps}
        hasActiveFilters={true}
        onClearFilters={onClearFilters}
      />
    );
    
    const button = screen.getByRole('button', { name: /status/i });
    fireEvent.click(button);
    
    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    
    expect(onClearFilters).toHaveBeenCalled();
  });
});
