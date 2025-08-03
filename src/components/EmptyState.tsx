import React from 'react';

interface EmptyStateProps {
  message: string;
  className?: string;
}

/**
 * A reusable empty state component that displays a centered message
 * with consistent styling across the application
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  className = "text-center py-8 text-slate-400" 
}) => (
  <div className={className}>
    {message}
  </div>
);
