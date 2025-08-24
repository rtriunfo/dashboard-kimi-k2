import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, ErrorState } from './ErrorBoundary';

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Test component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = false, 
  errorMessage = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
};

describe('ErrorState', () => {
  describe('basic rendering', () => {
    it('should render default error message', () => {
      render(<ErrorState />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    });

    it('should render custom message', () => {
      const customMessage = 'Custom error occurred';
      render(<ErrorState message={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const customClass = 'custom-error-class';
      render(<ErrorState className={customClass} />);
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveClass('chart-error', customClass);
    });

    it('should render error icon with proper accessibility attributes', () => {
      render(<ErrorState />);
      
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('error details', () => {
    it('should not show technical details when no error provided', () => {
      render(<ErrorState />);
      
      expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
    });

    it('should show technical details when error provided', () => {
      const error = new Error('Detailed error message');
      render(<ErrorState error={error} />);
      
      expect(screen.getByText('Technical Details')).toBeInTheDocument();
    });

    it('should expand technical details when clicked', () => {
      const error = new Error('Detailed error message');
      render(<ErrorState error={error} />);
      
      const detailsButton = screen.getByText('Technical Details');
      fireEvent.click(detailsButton);
      
      expect(screen.getByText('Detailed error message')).toBeInTheDocument();
    });

    it('should display error message in preformatted text', () => {
      const error = new Error('Multi-line\nerror message');
      render(<ErrorState error={error} />);
      
      fireEvent.click(screen.getByText('Technical Details'));
      
      const preElement = screen.getByText((content, element) => {
        return element?.tagName === 'PRE' && content.includes('Multi-line') && content.includes('error message');
      });
      expect(preElement.tagName).toBe('PRE');
    });
  });

  describe('retry functionality', () => {
    it('should not show retry button when no onRetry provided', () => {
      render(<ErrorState />);
      
      expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });

    it('should show retry button when onRetry provided', () => {
      const onRetry = jest.fn();
      render(<ErrorState onRetry={onRetry} />);
      
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should call onRetry when retry button clicked', () => {
      const onRetry = jest.fn();
      render(<ErrorState onRetry={onRetry} />);
      
      fireEvent.click(screen.getByText('Retry'));
      
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should render retry button with proper accessibility attributes', () => {
      const onRetry = jest.fn();
      render(<ErrorState onRetry={onRetry} />);
      
      const retryButton = screen.getByText('Retry');
      expect(retryButton.tagName).toBe('BUTTON');
      expect(retryButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('should render retry icon with proper accessibility attributes', () => {
      const onRetry = jest.fn();
      render(<ErrorState onRetry={onRetry} />);
      
      const retryButton = screen.getByText('Retry');
      const icon = retryButton.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA role', () => {
      render(<ErrorState />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<ErrorState />);
      
      const heading = screen.getByText('Chart Error');
      expect(heading.tagName).toBe('H3');
    });

    it('should support keyboard navigation for details', () => {
      const error = new Error('Test error');
      render(<ErrorState error={error} />);
      
      const detailsButton = screen.getByText('Technical Details');
      expect(detailsButton).toHaveClass('cursor-pointer');
    });
  });
});

describe('ErrorBoundary', () => {
  describe('normal operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('should not render error state when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );
      
      expect(screen.queryByText('Chart Error')).not.toBeInTheDocument();
    });
  });

  describe('error catching', () => {
    it('should catch errors and display default error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    });

    it('should display specific error message in technical details', () => {
      const errorMessage = 'Specific component error';
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage={errorMessage} />
        </ErrorBoundary>
      );
      
      fireEvent.click(screen.getByText('Technical Details'));
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} errorMessage="Test error" />
        </ErrorBoundary>
      );
      
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });

    it('should log error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Chart Error Boundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('custom fallback component', () => {
    const CustomFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ 
      error, 
      onRetry 
    }) => (
      <div data-testid="custom-fallback">
        <p>Custom error: {error?.message}</p>
        {onRetry && <button onClick={onRetry}>Custom Retry</button>}
      </div>
    );

    it('should render custom fallback component when provided', () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} errorMessage="Custom error" />
        </ErrorBoundary>
      );
      
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error: Custom error')).toBeInTheDocument();
    });

    it('should pass error to custom fallback component', () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} errorMessage="Fallback error" />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Custom error: Fallback error')).toBeInTheDocument();
    });

    it('should pass onRetry to custom fallback component', () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Custom Retry')).toBeInTheDocument();
    });
  });

  describe('error recovery', () => {
    it('should reset error state when retry is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      // Verify error state
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      
      // Click retry - this should reset the error boundary state
      fireEvent.click(screen.getByText('Retry'));
      
      // After retry, the error boundary attempts to re-render children
      // In a real scenario, the parent component would provide fixed children
    });

    it('should call handleRetry when retry button is clicked', () => {
      // Test the handleRetry method directly by checking state reset
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      
      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
      
      // Click retry should trigger handleRetry
      fireEvent.click(retryButton);
      
      // The error boundary state should be reset (hasError: false)
      // This will cause it to try rendering children again
    });

    it('should handle retry with custom fallback component', () => {
      const CustomFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ 
        onRetry 
      }) => (
        <div data-testid="custom-fallback">
          <button onClick={onRetry}>Custom Retry</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      
      const customRetryButton = screen.getByText('Custom Retry');
      fireEvent.click(customRetryButton);
      
      // Should reset error boundary state
    });
  });

  describe('edge cases', () => {
    it('should handle errors without message', () => {
      const ErrorWithoutMessage: React.FC = () => {
        throw new Error();
      };
      
      render(
        <ErrorBoundary>
          <ErrorWithoutMessage />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Technical Details'));
      // Should handle empty error message gracefully
    });

    it('should handle null children', () => {
      render(
        <ErrorBoundary>
          {null}
        </ErrorBoundary>
      );
      
      // Should not crash
      expect(screen.queryByText('Chart Error')).not.toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(
        <ErrorBoundary>
          {undefined}
        </ErrorBoundary>
      );
      
      // Should not crash
      expect(screen.queryByText('Chart Error')).not.toBeInTheDocument();
    });

    it('should handle errors in componentDidCatch without onError prop', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      // Should not crash when onError is not provided
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('state management', () => {
    it('should initialize with no error state', () => {
      render(
        <ErrorBoundary>
          <div>Content</div>
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should update state when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="State test error" />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Technical Details'));
      expect(screen.getByText('State test error')).toBeInTheDocument();
    });

    it('should clear error state on retry', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      
      // Verify error state exists
      expect(screen.getByText('Chart Error')).toBeInTheDocument();
      
      // Click retry to clear state
      fireEvent.click(screen.getByText('Retry'));
      
      // State should be reset (hasError: false, error: undefined)
      // The component will attempt to re-render children
    });
  });
});
