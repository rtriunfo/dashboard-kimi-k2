import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import NumericFilterDropdown, { NumericFieldDef } from './NumericFilterDropdown';

function Harness() {
  const [numericField, setNumericField] = React.useState('');
  const [numericOperator, setNumericOperator] = React.useState<'gt' | 'lt'>('gt');
  const [numericValue, setNumericValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const fields: NumericFieldDef[] = [
    { key: 'min', label: 'Min Response Time' },
    { key: 'max', label: 'Max Response Time' },
  ];

  const hasActive = Boolean(numericField && numericValue);

  return (
    <NumericFilterDropdown
      numericFields={fields}
      numericField={numericField}
      setNumericField={setNumericField}
      numericOperator={numericOperator}
      setNumericOperator={setNumericOperator}
      numericValue={numericValue}
      setNumericValue={setNumericValue}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dropdownRef={dropdownRef}
      hasActiveFilters={hasActive}
      onClearFilters={() => {
        setNumericField('');
        setNumericValue('');
      }}
    />
  );
}

describe('NumericFilterDropdown', () => {
  test('opens, selects field/operator/value and shows summary', () => {
    render(<Harness />);

    // Initially button is visible
    const button = screen.getByRole('button', { name: /numeric filter/i });
    expect(button).toBeInTheDocument();

    // Open dropdown
    fireEvent.click(button);

    // Select field
    const fieldSelect = screen.getByLabelText(/field/i) as HTMLSelectElement;
    fireEvent.change(fieldSelect, { target: { value: 'min' } });
    expect(fieldSelect.value).toBe('min');

    // Operator select exists
    const opSelect = screen.getByLabelText(/operator/i) as HTMLSelectElement;
    expect(opSelect).toBeInTheDocument();

    // Enter value
    const valueInput = screen.getByLabelText(/value/i) as HTMLInputElement;
    fireEvent.change(valueInput, { target: { value: '100' } });
    expect(valueInput.value).toBe('100');

    // Summary text appears
    expect(screen.getByText(/showing requests where/i)).toBeInTheDocument();
    const summary = screen.getByText(/showing requests where/i).closest('div') as HTMLElement;
    expect(summary).toBeInTheDocument();
    expect(within(summary).getByText(/min response time/i)).toBeInTheDocument();
  });

  test('clear filters resets selections', () => {
    render(<Harness />);

    const button = screen.getByRole('button', { name: /numeric filter/i });
    fireEvent.click(button);

    const fieldSelect = screen.getByLabelText(/field/i) as HTMLSelectElement;
    fireEvent.change(fieldSelect, { target: { value: 'max' } });
    const valueInput = screen.getByLabelText(/value/i) as HTMLInputElement;
    fireEvent.change(valueInput, { target: { value: '200' } });

    // Clear all filters
    const clearBtn = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearBtn);

    // Field should reset to '' and summary not present
    expect((screen.getByLabelText(/field/i) as HTMLSelectElement).value).toBe('');
    expect(screen.queryByText(/showing requests where/i)).not.toBeInTheDocument();
  });
});
