import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableCell } from './TableCell';

describe('TableCell', () => {
  // Render tests with minimal props
  it('renders with minimal props', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByRole('cell')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default classes when no props provided', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('px-2', 'py-4', 'text-center', 'text-sm');
  });

  it('applies custom className when provided', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-class text-red-500">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('custom-class', 'text-red-500');
    expect(cell).toHaveClass('px-2', 'py-4', 'text-center', 'text-sm'); // Base classes should still be present
  });

  // Test alignment options
  it('applies left alignment', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell align="left">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('text-left');
    expect(cell).not.toHaveClass('text-center', 'text-right');
  });

  it('applies center alignment (default)', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell align="center">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('text-center');
    expect(cell).not.toHaveClass('text-left', 'text-right');
  });

  it('applies right alignment', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell align="right">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('text-right');
    expect(cell).not.toHaveClass('text-left', 'text-center');
  });

  // Test size options
  it('applies small size', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell size="sm">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('text-xs');
    expect(cell).not.toHaveClass('text-sm', 'text-base');
  });

  it('applies medium size (default)', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell size="md">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('text-sm');
    expect(cell).not.toHaveClass('text-xs', 'text-base');
  });

  it('applies large size', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell size="lg">Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('text-base');
    expect(cell).not.toHaveClass('text-xs', 'text-sm');
  });

  // Edge case coverage
  it('handles empty children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell></TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toBeInTheDocument();
    expect(cell.textContent).toBe('');
  });

  it('handles complex children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>
              <span className="font-bold">Bold text</span>
              <div>Nested content</div>
            </TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('Nested content')).toBeInTheDocument();
  });

  it('combines all props correctly', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell 
              align="left" 
              size="lg" 
              className="text-blue-500 font-bold"
            >
              Combined props
            </TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('px-2', 'py-4', 'text-left', 'text-base', 'text-blue-500', 'font-bold');
  });

  // Accessibility checks
  it('renders as td element', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    
    const cell = screen.getByRole('cell');
    expect(cell.tagName).toBe('TD');
  });
});
