import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SortableHeader, SortColumn, SortDirection } from '@components/SortableHeader';

function renderWithTable(ui: React.ReactElement) {
  return render(
    <table>
      <thead>
        <tr>{ui}</tr>
      </thead>
    </table>
  );
}

describe('SortableHeader', () => {
  const mockOnSort = jest.fn();
  
  const defaultProps = {
    column: 'name' as SortColumn,
    sortColumn: 'name' as SortColumn,
    sortDirection: 'asc' as SortDirection,
    onSort: mockOnSort,
    children: 'Test Header'
  };

  beforeEach(() => {
    mockOnSort.mockClear();
  });

  // Render tests with minimal props
  it('renders with minimal props', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    expect(screen.getByRole('columnheader')).toBeInTheDocument();
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('applies default className when none provided', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('px-6', 'py-4', 'text-center', 'text-sm', 'font-semibold', 'text-gray-900');
  });

  it('applies custom className when provided', () => {
    renderWithTable(
      <SortableHeader 
        {...defaultProps} 
        className="custom-class text-left" 
      />
    );
    
    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('custom-class', 'text-left');
  });

  // Behavior tests simulating user interaction
  it('calls onSort when clicked', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    const header = screen.getByRole('columnheader');
    fireEvent.click(header);
    
    expect(mockOnSort).toHaveBeenCalledTimes(1);
    expect(mockOnSort).toHaveBeenCalledWith('name');
  });

  it('shows ascending sort indicator when column is sorted ascending', () => {
    renderWithTable(
      <SortableHeader 
        {...defaultProps}
        sortColumn="name"
        sortDirection="asc"
      />
    );
    
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('shows descending sort indicator when column is sorted descending', () => {
    renderWithTable(
      <SortableHeader 
        {...defaultProps}
        sortColumn="name"
        sortDirection="desc"
      />
    );
    
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('does not show sort indicator when column is not the active sort column', () => {
    renderWithTable(
      <SortableHeader 
        {...defaultProps}
        column="status"
        sortColumn="name"
        sortDirection="asc"
      />
    );
    
    expect(screen.queryByText('↑')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
  });

  // Edge case coverage for different prop values
  it('handles different column types', () => {
    const columns: SortColumn[] = ['name', 'status', 'severity', 'min', 'max', 'totalCount', 'errorPercentage'];
    
    columns.forEach(column => {
      const { unmount } = renderWithTable(
        <SortableHeader 
          {...defaultProps}
          column={column}
        />
      );
      
      const header = screen.getByRole('columnheader');
      fireEvent.click(header);
      expect(mockOnSort).toHaveBeenCalledWith(column);
      
      unmount();
      mockOnSort.mockClear();
    });
  });

  it('applies correct flex justification for name column', () => {
    renderWithTable(
      <SortableHeader 
        {...defaultProps}
        column="name"
      />
    );
    
    const flexContainer = screen.getByRole('columnheader').querySelector('div');
    expect(flexContainer).toHaveClass('justify-start');
  });

  it('applies correct flex justification for non-name columns', () => {
    renderWithTable(
      <SortableHeader 
        {...defaultProps}
        column="status"
      />
    );
    
    const flexContainer = screen.getByRole('columnheader').querySelector('div');
    expect(flexContainer).toHaveClass('justify-center');
  });

  // Accessibility checks
  it('has proper cursor pointer styling', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('cursor-pointer');
  });

  it('has hover effects', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('hover:bg-gray-100');
  });

  it('prevents text selection', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('select-none');
  });

  it('has transition effects', () => {
    renderWithTable(<SortableHeader {...defaultProps} />);
    
    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('transition-colors');
  });
});
