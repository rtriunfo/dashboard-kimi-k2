import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorPercentageCell } from './ErrorPercentageCell';

describe('ErrorPercentageCell', () => {
  // Render tests with minimal props
  it('renders with zero error percentage', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={0} />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByRole('cell')).toBeInTheDocument();
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  it('renders with null error percentage', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={null} />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  it('renders with undefined error percentage', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={undefined} />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  // Color coding tests based on thresholds
  it('applies green color for low error percentage (≤ 1%)', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={0.5} />
          </tr>
        </tbody>
      </table>
    );
    
    const span = screen.getByText('0.50%');
    expect(span).toHaveClass('text-green-400');
    expect(span).not.toHaveClass('text-yellow-400', 'text-red-400');
  });

  it('applies green color for exactly 1% error', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={1} />
          </tr>
        </tbody>
      </table>
    );
    
    const span = screen.getByText('1.00%');
    expect(span).toHaveClass('text-green-400');
  });

  it('applies yellow color for medium error percentage (> 1% and ≤ 5%)', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={3} />
          </tr>
        </tbody>
      </table>
    );
    
    const span = screen.getByText('3.00%');
    expect(span).toHaveClass('text-yellow-400');
    expect(span).not.toHaveClass('text-green-400', 'text-red-400');
  });

  it('applies yellow color for exactly 5% error', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={5} />
          </tr>
        </tbody>
      </table>
    );
    
    const span = screen.getByText('5.00%');
    expect(span).toHaveClass('text-yellow-400');
  });

  it('applies red color for high error percentage (> 5%)', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={10} />
          </tr>
        </tbody>
      </table>
    );
    
    const span = screen.getByText('10.00%');
    expect(span).toHaveClass('text-red-400');
    expect(span).not.toHaveClass('text-green-400', 'text-yellow-400');
  });

  // Edge cases and formatting tests
  it('handles string input correctly', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage="2.5" />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('2.50%')).toBeInTheDocument();
  });

  it('formats decimal places correctly', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={1.234567} />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('1.23%')).toBeInTheDocument();
  });

  it('handles very small percentages', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={0.001} />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  it('handles very large percentages', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={99.99} />
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('99.99%')).toBeInTheDocument();
  });

  // Custom className tests
  it('applies custom className when provided', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell 
              errorPercentage={2} 
              className="custom-class" 
            />
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('custom-class');
  });

  // Accessibility and structure tests
  it('renders as table cell with proper structure', () => {
    render(
      <table>
        <tbody>
          <tr>
            <ErrorPercentageCell errorPercentage={1.5} />
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell.tagName).toBe('TD');
    
    const span = screen.getByText('1.50%');
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveClass('font-medium');
  });

  // Boundary value tests
  it('handles boundary values correctly', () => {
    const testCases = [
      { value: 0.99, expectedColor: 'text-green-400' },
      { value: 1.01, expectedColor: 'text-yellow-400' },
      { value: 4.99, expectedColor: 'text-yellow-400' },
      { value: 5.01, expectedColor: 'text-red-400' },
    ];

    testCases.forEach(({ value, expectedColor }) => {
      const { unmount } = render(
        <table>
          <tbody>
            <tr>
              <ErrorPercentageCell errorPercentage={value} />
            </tr>
          </tbody>
        </table>
      );
      
      const span = screen.getByText(`${value.toFixed(2)}%`);
      expect(span).toHaveClass(expectedColor);
      
      unmount();
    });
  });
});
