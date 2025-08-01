import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  message = 'Loading chart data...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`chart-loading ${className}`} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 dark:border-gray-600 dark:border-t-primary-400`}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </span>
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
};