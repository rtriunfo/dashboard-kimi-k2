import { render, screen } from '@testing-library/react';
import LoadingSpinner, { LoadingSpinnerProps } from './LoadingSpinner';

const defaultProps: LoadingSpinnerProps = {
  message: 'Loading...',
  size: 'lg',
  fullScreen: true,
};

describe('LoadingSpinner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<LoadingSpinner message="Loading dashboard..." />);
      
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(<LoadingSpinner size="sm" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-8', 'h-8');
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-sm');
    });

    it('renders with medium size', () => {
      render(<LoadingSpinner size="md" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-16', 'h-16');
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-base');
    });

    it('renders with large size', () => {
      render(<LoadingSpinner size="lg" />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-32', 'h-32');
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-lg');
    });

    it('renders with fullScreen layout', () => {
      const { container } = render(<LoadingSpinner fullScreen={true} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-slate-900', 'via-slate-800', 'to-slate-900');
    });

    it('renders with compact layout', () => {
      const { container } = render(<LoadingSpinner fullScreen={false} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('p-8');
      expect(wrapper).not.toHaveClass('min-h-screen');
    });
  });

  describe('Spinner Animation', () => {
    it('has spinning animation class', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('has correct spinner styling', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('border-b-2', 'border-white', 'rounded-full');
    });
  });

  describe('Layout and Styling', () => {
    it('has correct container structure', () => {
      const { container } = render(<LoadingSpinner />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
      
      const textCenter = wrapper.firstChild as HTMLElement;
      expect(textCenter).toHaveClass('text-center');
    });

    it('has correct text styling', () => {
      render(<LoadingSpinner />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-white');
    });

    it('has correct spacing', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('mx-auto', 'mb-4');
    });
  });

  describe('Prop Combinations', () => {
    it('renders small spinner with custom message and compact layout', () => {
      const { container } = render(
        <LoadingSpinner 
          size="sm" 
          message="Please wait..." 
          fullScreen={false} 
        />
      );
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-8', 'h-8');
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('p-8');
      expect(wrapper).not.toHaveClass('min-h-screen');
    });

    it('renders medium spinner with fullScreen layout', () => {
      const { container } = render(
        <LoadingSpinner 
          size="md" 
          message="Loading data..." 
          fullScreen={true} 
        />
      );
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-16', 'h-16');
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('min-h-screen');
    });
  });

  describe('Accessibility', () => {
    it('has readable text content', () => {
      render(<LoadingSpinner message="Loading dashboard..." />);
      
      const text = screen.getByText('Loading dashboard...');
      expect(text).toBeVisible();
    });

    it('maintains proper contrast with white text on dark background', () => {
      render(<LoadingSpinner />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-white');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message', () => {
      render(<LoadingSpinner message="" />);
      
      const textElement = document.querySelector('p.text-lg.text-white');
      expect(textElement).toBeInTheDocument();
      expect(textElement?.textContent).toBe('');
    });

    it('handles very long message', () => {
      const longMessage = 'This is a very long loading message that should still render properly without breaking the layout or causing any issues';
      render(<LoadingSpinner message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      const props = {
        message: undefined as any,
        size: undefined as any,
        fullScreen: undefined as any,
      };
      
      expect(() => {
        render(<LoadingSpinner {...props} />);
      }).not.toThrow();
      
      // Should fall back to defaults
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('uses default message when not provided', () => {
      render(<LoadingSpinner />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('uses default size when not provided', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-32', 'h-32'); // lg size
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-lg');
    });

    it('uses default fullScreen when not provided', () => {
      const { container } = render(<LoadingSpinner />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('min-h-screen'); // fullScreen: true
    });
  });
});
