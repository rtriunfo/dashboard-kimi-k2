import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SeverityFilterDropdown from './SeverityFilterDropdown';
import '@testing-library/jest-dom';

describe('SeverityFilterDropdown', () => {
  const mockRequestResults = [
    {
      id: 1,
      status: 'PASSED',
      severity: 'minor',
      request: {
        id: 1,
        requestName: 'Test 1',
        requestDescription: 'Test description 1',
        requestPriority: 'high',
        tags: 'tag1,tag2',
        createdTime: '2023-01-01T00:00:00Z',
      },
      totalCount: 100,
      passCount: 100,
      failCount: 0,
      errorPercentage: 0,
      responseTimes: { min: 10, max: 50, percentiles: { '50': 25, '95': 45 } },
      rate: 10,
      rateGranularity: 'second',
      testRequirements: true,
      statistics: true,
      requirements: {
        status: 'PASSED',
        passed: 100,
        failed: 0,
        percentiles: [],
      },
    },
    {
      id: 2,
      status: 'FAILED',
      severity: 'major',
      request: {
        id: 2,
        requestName: 'Test 2',
        requestDescription: 'Test description 2',
        requestPriority: 'medium',
        tags: 'tag3,tag4',
        createdTime: '2023-01-02T00:00:00Z',
      },
      totalCount: 100,
      passCount: 80,
      failCount: 20,
      errorPercentage: 20,
      responseTimes: { min: 15, max: 100, percentiles: { '50': 30, '95': 80 } },
      rate: 10,
      rateGranularity: 'second',
      testRequirements: true,
      statistics: true,
      requirements: {
        status: 'FAILED',
        passed: 80,
        failed: 20,
        percentiles: [],
      },
    },
  ];

  const defaultProps = {
    selectedSeverities: new Set<string>(),
    availableSeverities: ['minor', 'major'],
    requestResults: mockRequestResults,
    onSeverityToggle: jest.fn(),
    onClearFilters: jest.fn(),
    hasActiveFilters: false,
  };

  it('renders the dropdown button with default text', () => {
    render(<SeverityFilterDropdown {...defaultProps} />);
    expect(screen.getByText('Severity')).toBeInTheDocument();
  });

  it('shows the count of selected severities', () => {
    const props = {
      ...defaultProps,
      selectedSeverities: new Set(['minor']),
      hasActiveFilters: true,
    };
    render(<SeverityFilterDropdown {...props} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens dropdown when button is clicked', () => {
    render(<SeverityFilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button', { name: /severity/i });
    fireEvent.click(button);
    expect(screen.getByText('minor')).toBeInTheDocument();
    expect(screen.getByText('major')).toBeInTheDocument();
  });

  it('calls onSeverityToggle when severity is clicked', () => {
    const mockOnSeverityToggle = jest.fn();
    const props = {
      ...defaultProps,
      onSeverityToggle: mockOnSeverityToggle,
    };
    render(<SeverityFilterDropdown {...props} />);

    const button = screen.getByRole('button', { name: /severity/i });
    fireEvent.click(button);

    const minorCheckbox = screen.getByRole('checkbox', { name: /minor/i });
    fireEvent.click(minorCheckbox);

    expect(mockOnSeverityToggle).toHaveBeenCalledWith('minor');
  });

  it('shows clear filters option when filters are active', () => {
    const props = {
      ...defaultProps,
      hasActiveFilters: true,
    };
    render(<SeverityFilterDropdown {...props} />);

    const button = screen.getByRole('button', { name: /severity/i });
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
    render(<SeverityFilterDropdown {...props} />);

    const button = screen.getByRole('button', { name: /severity/i });
    fireEvent.click(button);

    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('closes dropdown when clicking outside', () => {
    render(<SeverityFilterDropdown {...defaultProps} />);

    const button = screen.getByRole('button', { name: /severity/i });
    fireEvent.click(button);
    expect(screen.getByText('minor')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('minor')).not.toBeInTheDocument();
  });
});
