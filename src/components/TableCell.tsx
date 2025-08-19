import React from 'react';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A reusable table cell component with consistent styling and alignment options
 */
export const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '',
  align = 'center',
  size = 'md'
}) => {
  const baseClasses = 'px-2 py-4';
  const alignClasses = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  };
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const combinedClasses = `${baseClasses} ${alignClasses[align]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <td className={combinedClasses}>
      {children}
    </td>
  );
};
