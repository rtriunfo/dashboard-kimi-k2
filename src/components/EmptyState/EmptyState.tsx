import React from 'react';

export interface EmptyStateProps {
  message: string;
  className?: string;
}

/**
 * A reusable empty state component that displays a centered message
 * with consistent styling across the application
 */
const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  className = "text-center py-8 text-slate-400" 
}) => (
  <div className={className} data-testid="empty-state">
    {message}
  </div>
);

export default EmptyState;
