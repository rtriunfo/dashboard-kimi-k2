import React from 'react';
import { TableCell } from './TableCell';

interface ErrorPercentageCellProps {
  errorPercentage: number | string | null | undefined;
  className?: string;
}

/**
 * A specialized table cell component for displaying error percentages with color-coded thresholds
 * - Red: > 5%
 * - Yellow: > 1% and <= 5%
 * - Green: <= 1%
 */
export const ErrorPercentageCell: React.FC<ErrorPercentageCellProps> = ({ 
  errorPercentage, 
  className = '' 
}) => {
  const numericValue = Number(errorPercentage || 0);
  
  const getColorClass = (value: number): string => {
    if (value > 5) return 'text-red-400';
    if (value > 1) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <TableCell className={className}>
      <span className={`font-medium ${getColorClass(numericValue)}`}>
        {numericValue.toFixed(2)}%
      </span>
    </TableCell>
  );
};
