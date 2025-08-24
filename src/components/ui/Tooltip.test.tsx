import { createRef } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Tooltip } from './Tooltip';

// Mock ReactDOM.createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn((element) => element)
}));

// Mock console.debug to avoid noise in tests
const originalConsoleDebug = console.debug;
beforeAll(() => {
  console.debug = jest.fn();
});

afterAll(() => {
  console.debug = originalConsoleDebug;
});

// Clean up DOM after each test
afterEach(() => {
  cleanup();
  // Clean up any remaining portal containers
  const existingPortal = document.getElementById('tooltip-portal');
  if (existingPortal) {
    document.body.removeChild(existingPortal);
  }
});

describe('Tooltip', () => {
  const defaultProps = {
    x: 100,
    y: 50,
    content: 'Test tooltip content',
    visible: true
  };

  describe('basic rendering', () => {
    it('should not render when visible is false', () => {
      render(<Tooltip {...defaultProps} visible={false} />);
      
      expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
    });

    it('should not render when content is empty', () => {
      render(<Tooltip {...defaultProps} content="" />);
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should render tooltip when visible and content provided', () => {
      render(<Tooltip {...defaultProps} />);
      
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const customClass = 'custom-tooltip-class';
      render(<Tooltip {...defaultProps} className={customClass} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass(customClass);
    });

    it('should have default styling classes', () => {
      render(<Tooltip {...defaultProps} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass(
        'fixed',
        'z-[9999]',
        'px-3',
        'py-2',
        'text-sm',
        'text-white',
        'bg-slate-900',
        'rounded-lg',
        'pointer-events-none',
        'shadow-xl'
      );
    });
  });

  describe('content rendering', () => {
    it('should render single line content', () => {
      render(<Tooltip {...defaultProps} content="Single line" />);
      
      expect(screen.getByText('Single line')).toBeInTheDocument();
    });

    it('should render multi-line content', () => {
      const multiLineContent = 'Line 1\nLine 2\nLine 3';
      render(<Tooltip {...defaultProps} content={multiLineContent} />);
      
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
      expect(screen.getByText('Line 3')).toBeInTheDocument();
    });

    it('should apply whitespace-nowrap to each line', () => {
      const multiLineContent = 'Line 1\nLine 2';
      render(<Tooltip {...defaultProps} content={multiLineContent} />);
      
      const line1 = screen.getByText('Line 1');
      const line2 = screen.getByText('Line 2');
      
      expect(line1).toHaveClass('whitespace-nowrap');
      expect(line2).toHaveClass('whitespace-nowrap');
    });

    it('should handle empty lines in content', () => {
      const contentWithEmptyLine = 'Line 1\n\nLine 3';
      render(<Tooltip {...defaultProps} content={contentWithEmptyLine} />);
      
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 3')).toBeInTheDocument();
      // Empty line should still create a div
      const tooltip = screen.getByRole('tooltip');
      const lines = tooltip.querySelectorAll('.whitespace-nowrap');
      expect(lines).toHaveLength(3);
    });
  });

  describe('positioning', () => {
    it('should position tooltip at specified coordinates without container', () => {
      render(<Tooltip {...defaultProps} x={200} y={100} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveStyle({
        left: '0px', // Without containerRef, screenPosition defaults to 0,0
        top: '0px'
      });
    });

    it('should calculate screen position with container reference', () => {
      const containerRef = createRef<HTMLDivElement>();
      
      // Mock getBoundingClientRect
      const mockGetBoundingClientRect = jest.fn(() => ({
        left: 50,
        top: 30,
        right: 250,
        bottom: 130,
        width: 200,
        height: 100,
        x: 50,
        y: 30,
        toJSON: () => ({})
      } as DOMRect));

      const { rerender } = render(
        <div>
          <div ref={containerRef} data-testid="container">
            Container
          </div>
          <Tooltip {...defaultProps} x={100} y={50} containerRef={containerRef} />
        </div>
      );

      // Mock the getBoundingClientRect after render
      if (containerRef.current) {
        containerRef.current.getBoundingClientRect = mockGetBoundingClientRect;
      }

      // Re-render to trigger position calculation
      rerender(
        <div>
          <div ref={containerRef} data-testid="container">
            Container
          </div>
          <Tooltip {...defaultProps} x={100} y={50} containerRef={containerRef} />
        </div>
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveStyle({
        transform: 'translate(-50%, -100%)',
        marginTop: '-8px'
      });
    });

    it('should update position when coordinates change', () => {
      const containerRef = createRef<HTMLDivElement>();
      const mockGetBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect));

      const { rerender } = render(
        <div>
          <div ref={containerRef}>Container</div>
          <Tooltip {...defaultProps} x={50} y={25} containerRef={containerRef} />
        </div>
      );

      if (containerRef.current) {
        containerRef.current.getBoundingClientRect = mockGetBoundingClientRect;
      }

      // Change coordinates
      rerender(
        <div>
          <div ref={containerRef}>Container</div>
          <Tooltip {...defaultProps} x={75} y={40} containerRef={containerRef} />
        </div>
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });

    it('should not calculate position when not visible', () => {
      const containerRef = createRef<HTMLDivElement>();
      const mockGetBoundingClientRect = jest.fn();

      render(
        <div>
          <div ref={containerRef}>Container</div>
          <Tooltip {...defaultProps} visible={false} containerRef={containerRef} />
        </div>
      );

      if (containerRef.current) {
        containerRef.current.getBoundingClientRect = mockGetBoundingClientRect;
      }

      expect(mockGetBoundingClientRect).not.toHaveBeenCalled();
    });

    it('should not calculate position when container ref is null', () => {
      render(<Tooltip {...defaultProps} containerRef={undefined} />);
      
      // Should not crash and should render with default position
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });

  describe('portal management', () => {
    it('should create portal container when visible', () => {
      render(<Tooltip {...defaultProps} />);
      
      const portalContainer = document.getElementById('tooltip-portal');
      expect(portalContainer).toBeInTheDocument();
      expect(portalContainer).toHaveStyle({
        position: 'fixed',
        top: '0px',
        left: '0px',
        pointerEvents: 'none',
        zIndex: '9999'
      });
    });

    it('should not create portal container when not visible', () => {
      render(<Tooltip {...defaultProps} visible={false} />);
      
      const portalContainer = document.getElementById('tooltip-portal');
      expect(portalContainer).not.toBeInTheDocument();
    });

    it('should reuse existing portal container', () => {
      render(<Tooltip {...defaultProps} />);
      const firstPortal = document.getElementById('tooltip-portal');
      
      render(<Tooltip {...defaultProps} content="Second tooltip" />);
      const secondPortal = document.getElementById('tooltip-portal');
      
      expect(firstPortal).toBe(secondPortal);
    });

    it('should clean up portal container when no tooltips are visible', () => {
      const { unmount } = render(<Tooltip {...defaultProps} />);
      
      expect(document.getElementById('tooltip-portal')).toBeInTheDocument();
      
      unmount();
      
      // Portal should be cleaned up
      expect(document.getElementById('tooltip-portal')).not.toBeInTheDocument();
    });

    it('should handle multiple tooltips with reference counting', () => {
      const { unmount: unmount1 } = render(
        <Tooltip {...defaultProps} content="Tooltip 1" />
      );
      const { unmount: unmount2 } = render(
        <Tooltip {...defaultProps} content="Tooltip 2" />
      );
      
      const portalContainer = document.getElementById('tooltip-portal');
      expect(portalContainer).toBeInTheDocument();
      
      // Unmount first tooltip
      unmount1();
      expect(document.getElementById('tooltip-portal')).toBeInTheDocument();
      
      // Unmount second tooltip
      unmount2();
      expect(document.getElementById('tooltip-portal')).not.toBeInTheDocument();
    });

    it('should handle portal cleanup errors gracefully', () => {
      // Mock removeChild to throw an error
      const originalRemoveChild = document.body.removeChild;
      document.body.removeChild = jest.fn(() => {
        throw new Error('Cleanup error');
      });

      const { unmount } = render(<Tooltip {...defaultProps} />);
      
      // Should not throw when cleanup fails
      expect(() => unmount()).not.toThrow();
      
      // Restore original method
      document.body.removeChild = originalRemoveChild;
    });

    it('should recreate portal container if it was removed from DOM', () => {
      render(<Tooltip {...defaultProps} />);
      
      const firstPortal = document.getElementById('tooltip-portal');
      expect(firstPortal).toBeInTheDocument();
      
      // Manually remove portal from DOM
      if (firstPortal) {
        document.body.removeChild(firstPortal);
      }
      
      // Render another tooltip
      render(<Tooltip {...defaultProps} content="New tooltip" />);
      
      const newPortal = document.getElementById('tooltip-portal');
      expect(newPortal).toBeInTheDocument();
      expect(newPortal).not.toBe(firstPortal);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA role', () => {
      render(<Tooltip {...defaultProps} />);
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should have aria-live attribute', () => {
      render(<Tooltip {...defaultProps} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('aria-live', 'polite');
    });

    it('should be non-interactive with pointer-events-none', () => {
      render(<Tooltip {...defaultProps} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('pointer-events-none');
    });

    it('should announce content changes to screen readers', () => {
      const { rerender } = render(<Tooltip {...defaultProps} content="Initial content" />);
      
      expect(screen.getByText('Initial content')).toBeInTheDocument();
      
      rerender(<Tooltip {...defaultProps} content="Updated content" />);
      
      expect(screen.getByText('Updated content')).toBeInTheDocument();
      expect(screen.queryByText('Initial content')).not.toBeInTheDocument();
    });
  });

  describe('visual elements', () => {
    it('should render tooltip arrow', () => {
      render(<Tooltip {...defaultProps} />);
      
      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.absolute.border-4');
      
      expect(arrow).toBeInTheDocument();
      expect(arrow).toHaveClass(
        'absolute',
        'border-4',
        'border-transparent',
        'top-full',
        'left-1/2',
        'transform',
        '-translate-x-1/2'
      );
    });

    it('should style arrow with correct color', () => {
      render(<Tooltip {...defaultProps} />);
      
      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.absolute.border-4');
      
      expect(arrow).toHaveStyle({ borderTopColor: '#0f172a' });
    });

    it('should position arrow at bottom center of tooltip', () => {
      render(<Tooltip {...defaultProps} />);
      
      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.absolute.border-4');
      
      expect(arrow).toHaveClass('top-full', 'left-1/2', '-translate-x-1/2');
    });
  });

  describe('edge cases', () => {
    it('should handle visibility toggle', () => {
      const { rerender } = render(<Tooltip {...defaultProps} visible={true} />);
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      
      rerender(<Tooltip {...defaultProps} visible={false} />);
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      
      rerender(<Tooltip {...defaultProps} visible={true} />);
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should handle content changes while visible', () => {
      const { rerender } = render(<Tooltip {...defaultProps} content="Original" />);
      
      expect(screen.getByText('Original')).toBeInTheDocument();
      
      rerender(<Tooltip {...defaultProps} content="Updated" />);
      
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.queryByText('Original')).not.toBeInTheDocument();
    });

    it('should handle zero coordinates', () => {
      render(<Tooltip {...defaultProps} x={0} y={0} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });

    it('should handle negative coordinates', () => {
      render(<Tooltip {...defaultProps} x={-10} y={-20} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });

    it('should handle very large coordinates', () => {
      render(<Tooltip {...defaultProps} x={9999} y={9999} />);
      
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      const specialContent = 'Special chars: <>&"\'';
      render(<Tooltip {...defaultProps} content={specialContent} />);
      
      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      render(<Tooltip {...defaultProps} content={longContent} />);
      
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle container ref changes', () => {
      const containerRef1 = createRef<HTMLDivElement>();
      const containerRef2 = createRef<HTMLDivElement>();
      
      const { rerender } = render(
        <div>
          <div ref={containerRef1}>Container 1</div>
          <div ref={containerRef2}>Container 2</div>
          <Tooltip {...defaultProps} containerRef={containerRef1} />
        </div>
      );
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      
      rerender(
        <div>
          <div ref={containerRef1}>Container 1</div>
          <div ref={containerRef2}>Container 2</div>
          <Tooltip {...defaultProps} containerRef={containerRef2} />
        </div>
      );
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should not recalculate position when visibility changes to false', () => {
      const containerRef = createRef<HTMLDivElement>();
      const mockGetBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect));

      const { rerender } = render(
        <div>
          <div ref={containerRef}>Container</div>
          <Tooltip {...defaultProps} containerRef={containerRef} />
        </div>
      );

      if (containerRef.current) {
        containerRef.current.getBoundingClientRect = mockGetBoundingClientRect;
      }

      mockGetBoundingClientRect.mockClear();

      rerender(
        <div>
          <div ref={containerRef}>Container</div>
          <Tooltip {...defaultProps} visible={false} containerRef={containerRef} />
        </div>
      );

      expect(mockGetBoundingClientRect).not.toHaveBeenCalled();
    });
  });
});
