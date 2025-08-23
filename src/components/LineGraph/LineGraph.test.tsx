import React from 'react';
import { render, screen } from '@testing-library/react';
import LineGraph from './LineGraph';
import { ResponseTimeData, RequirementData } from '../../types/chart.types';

// Mock the hooks
jest.mock('../../hooks/useResponsiveChart', () => ({
  useResponsiveChart: () => ({
    containerRef: { current: null },
    dimensions: { width: 800, height: 400, margin: { top: 20, right: 20, bottom: 60, left: 60 } },
    innerWidth: 720,
    innerHeight: 320,
    isMobile: false,
  }),
}));

jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    announcementRef: { current: null },
    generateSummary: jest.fn(() => 'Chart showing response times vs requirements'),
  }),
}));

jest.mock('../../hooks/useChartInteractions', () => ({
  useChartInteractions: () => ({
    state: {
      tooltip: { x: 0, y: 0, content: '', visible: false },
      hoveredElement: null,
      focusedElement: null,
      isInteracting: false,
    },
    getInteractionProps: () => ({
      r: 4,
      tabIndex: 0,
      role: 'button',
      'aria-label': 'Data point',
    }),
  }),
}));

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      getCSSVariables: () => ({
        '--chart-primary': '#3b82f6',
        '--chart-success': '#10b981',
        '--chart-error': '#ef4444',
      }),
    },
  }),
}));

// Mock UI components
jest.mock('../ui/Tooltip', () => ({
  Tooltip: ({ visible, content }: { visible: boolean; content: string }) =>
    visible ? <div data-testid="tooltip">{content}</div> : null,
}));

jest.mock('../ui/LoadingSpinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => (
    <div data-testid="loading-spinner">{message}</div>
  ),
}));

jest.mock('../ui/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ErrorState: ({ error, message, onRetry }: { error?: Error; message?: string; onRetry: () => void }) => (
    <div data-testid="error-state">
      <div>{error?.message || message}</div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

const mockResponseTimes: ResponseTimeData = {
  min: 50,
  max: 500,
  percentiles: {
    '50': 100,
    '90': 200,
    '95': 300,
    '99': 450,
  },
};

const mockRequirements: RequirementData[] = [
  {
    status: 'PASS',
    percentile: 50,
    value: 150,
    difference: -50,
    percentageDifference: -33.33,
  },
  {
    status: 'FAIL',
    percentile: 95,
    value: 250,
    difference: 50,
    percentageDifference: 20,
  },
];

describe('LineGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chart with response times and requirements', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        title="Test Chart"
      />
    );

    expect(screen.getByRole('heading', { name: 'Test Chart' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Response Times')).toBeInTheDocument();
    expect(screen.getByText('Requirements')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        loading={true}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading performance data...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const mockError = new Error('Test error');
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        error={mockError}
      />
    );

    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('renders error state when no chart data available', () => {
    render(
      <LineGraph
        responseTimes={null as any}
        requirements={null as any}
      />
    );

    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('No chart data available')).toBeInTheDocument();
  });

  test('renders without title when not provided', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
      />
    );

    expect(screen.queryByText('Test Chart')).not.toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders with subtitle when provided', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        title="Test Chart"
        subtitle="Test Subtitle"
      />
    );

    expect(screen.getByRole('heading', { name: 'Test Chart' })).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        className="custom-class"
      />
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('renders legend with correct status colors', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
      />
    );

    expect(screen.getByText('Response Times')).toBeInTheDocument();
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('FAIL')).toBeInTheDocument();
  });

  test('does not render requirements legend when no requirements', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={[]}
      />
    );

    expect(screen.getByText('Response Times')).toBeInTheDocument();
    expect(screen.queryByText('Requirements')).not.toBeInTheDocument();
    expect(screen.queryByText('PASS')).not.toBeInTheDocument();
    expect(screen.queryByText('FAIL')).not.toBeInTheDocument();
  });

  test('renders axis labels correctly', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
      />
    );

    expect(screen.getByText('Percentile')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('99%')).toBeInTheDocument();
  });

  test('renders retry button in error state', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        error={new Error('Test error')}
      />
    );

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    // Note: We skip testing the actual click behavior to avoid window.location.reload issues
  });

  test('renders accessible summary', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        title="Test Chart"
      />
    );

    expect(screen.getByLabelText('Chart summary')).toBeInTheDocument();
    // The summary text is in a screen reader only element
    const summaryElement = screen.getByLabelText('Chart summary');
    expect(summaryElement).toHaveTextContent('Chart showing response times vs requirements');
  });

  test('renders SVG with correct attributes', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
        title="Test Chart"
      />
    );

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('viewBox', '0 0 800 400');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    expect(svg).toHaveAttribute('aria-labelledby', 'chart-title');
    expect(svg).toHaveAttribute('aria-describedby', 'chart-desc');
  });

  test('renders with default title when none provided', () => {
    render(
      <LineGraph
        responseTimes={mockResponseTimes}
        requirements={mockRequirements}
      />
    );

    // Component has a default title of 'Percentile Response Times'
    expect(screen.getByRole('heading', { name: 'Percentile Response Times' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  // Firefox-specific SVG rendering tests for missing points issue
  describe('SVG Circle Elements Rendering (Firefox Compatibility)', () => {
    test('renders response time circles with correct attributes', () => {
      const { container } = render(
        <LineGraph
          responseTimes={mockResponseTimes}
          requirements={mockRequirements}
          title="Test Chart"
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Find all response time circles
      const responseCircles = container.querySelectorAll('circle.chart-point-response');
      
      // Should have one circle for each percentile in mockResponseTimes
      expect(responseCircles).toHaveLength(4); // 50, 90, 95, 99 percentiles

      responseCircles.forEach((circle) => {
        // Check that each circle has required SVG attributes
        expect(circle).toHaveAttribute('cx');
        expect(circle).toHaveAttribute('cy');
        expect(circle).toHaveAttribute('r');
        
        // Validate attribute values are numeric and not NaN
        const cx = circle.getAttribute('cx');
        const cy = circle.getAttribute('cy');
        const r = circle.getAttribute('r');
        
        expect(cx).not.toBe('');
        expect(cy).not.toBe('');
        expect(r).not.toBe('');
        expect(isNaN(Number(cx))).toBe(false);
        expect(isNaN(Number(cy))).toBe(false);
        expect(isNaN(Number(r))).toBe(false);
        
        // Ensure radius is positive
        expect(Number(r)).toBeGreaterThan(0);
        
        // Check CSS class is applied (Firefox needs explicit classes for styling)
        expect(circle).toHaveClass('chart-point-response');
      });
    });

    test('renders requirement circles with correct attributes', () => {
      const { container } = render(
        <LineGraph
          responseTimes={mockResponseTimes}
          requirements={mockRequirements}
          title="Test Chart"
        />
      );

      // Find all requirement circles
      const requirementCircles = container.querySelectorAll('circle.chart-point-requirement');
      
      // Should have one circle for each requirement
      expect(requirementCircles).toHaveLength(2);

      requirementCircles.forEach((circle, index) => {
        // Check that each circle has required SVG attributes
        expect(circle).toHaveAttribute('cx');
        expect(circle).toHaveAttribute('cy');
        expect(circle).toHaveAttribute('r');
        
        // Validate attribute values are numeric and not NaN
        const cx = circle.getAttribute('cx');
        const cy = circle.getAttribute('cy');
        const r = circle.getAttribute('r');
        
        expect(cx).not.toBe('');
        expect(cy).not.toBe('');
        expect(r).not.toBe('');
        expect(isNaN(Number(cx))).toBe(false);
        expect(isNaN(Number(cy))).toBe(false);
        expect(isNaN(Number(r))).toBe(false);
        
        // Ensure radius is positive
        expect(Number(r)).toBeGreaterThan(0);
        
        // Check base CSS class is applied
        expect(circle).toHaveClass('chart-point-requirement');
        
        // Check status-specific class is applied (pass/fail)
        const expectedStatus = mockRequirements[index].status.toLowerCase();
        expect(circle).toHaveClass(expectedStatus);
      });
    });

    test('circles are positioned within SVG bounds', () => {
      const { container } = render(
        <LineGraph
          responseTimes={mockResponseTimes}
          requirements={mockRequirements}
          title="Test Chart"
        />
      );

      const svg = container.querySelector('svg');
      const viewBox = svg?.getAttribute('viewBox');
      expect(viewBox).toBe('0 0 800 400'); // From mocked dimensions
      
      const allCircles = container.querySelectorAll('circle');
      
      allCircles.forEach((circle) => {
        const cx = Number(circle.getAttribute('cx'));
        const cy = Number(circle.getAttribute('cy'));
        
        // Circles should be positioned within the SVG viewBox
        // Account for margins: left=60, top=20, so inner area starts at (60,20)
        expect(cx).toBeGreaterThanOrEqual(0);
        expect(cx).toBeLessThanOrEqual(800);
        expect(cy).toBeGreaterThanOrEqual(0);
        expect(cy).toBeLessThanOrEqual(400);
      });
    });

    test('circles have accessibility attributes for Firefox screen readers', () => {
      const { container } = render(
        <LineGraph
          responseTimes={mockResponseTimes}
          requirements={mockRequirements}
          title="Test Chart"
        />
      );

      const allCircles = container.querySelectorAll('circle');
      
      allCircles.forEach((circle) => {
        // Check for accessibility attributes that Firefox requires
        // Note: These attributes come from the mocked useChartInteractions hook
        expect(circle).toHaveAttribute('tabindex'); // React converts tabIndex to tabindex
        expect(circle).toHaveAttribute('role');
        expect(circle).toHaveAttribute('aria-label');
        
        // Validate tabindex is numeric
        const tabIndex = circle.getAttribute('tabindex');
        expect(isNaN(Number(tabIndex))).toBe(false);
        
        // Validate role is appropriate
        expect(circle.getAttribute('role')).toBe('button');
      });
    });

    test('SVG paths are properly formatted for Firefox', () => {
      const { container } = render(
        <LineGraph
          responseTimes={mockResponseTimes}
          requirements={mockRequirements}
          title="Test Chart"
        />
      );

      // Check response time path
      const responsePath = container.querySelector('path.chart-line-response');
      expect(responsePath).toBeInTheDocument();
      
      const responsePathData = responsePath?.getAttribute('d');
      expect(responsePathData).toBeTruthy();
      expect(responsePathData).toMatch(/^M\s[\d.-]+\s[\d.-]+/); // Should start with Move command
      expect(responsePathData).toContain('L'); // Should contain Line commands
      
      // Check requirements path
      const requirementPath = container.querySelector('path.chart-line-requirement');
      expect(requirementPath).toBeInTheDocument();
      
      const requirementPathData = requirementPath?.getAttribute('d');
      expect(requirementPathData).toBeTruthy();
      expect(requirementPathData).toMatch(/^M\s[\d.-]+\s[\d.-]+/);
    });

    test('CSS classes are properly applied for Firefox styling', () => {
      const { container } = render(
        <LineGraph
          responseTimes={mockResponseTimes}
          requirements={mockRequirements}
          title="Test Chart"
        />
      );

      // Check main container classes
      const chartContainer = container.querySelector('.chart-container');
      expect(chartContainer).toBeInTheDocument();
      
      // Check SVG classes
      const svg = container.querySelector('svg.chart-svg');
      expect(svg).toBeInTheDocument();
      
      // Check grid line classes
      const gridLines = container.querySelectorAll('.chart-grid-line');
      expect(gridLines.length).toBeGreaterThan(0);
      
      // Check axis classes
      const axisLines = container.querySelectorAll('.chart-axis');
      expect(axisLines).toHaveLength(2); // X and Y axis
      
      // Check legend classes
      const legendItems = container.querySelectorAll('.legend-item');
      expect(legendItems.length).toBeGreaterThan(0);
    });

    test('handles edge case data that might cause Firefox rendering issues', () => {
      const edgeCaseResponseTimes: ResponseTimeData = {
        min: 0,
        max: 0,
        percentiles: {
          '0': 0,
          '100': 0,
        },
      };

      const { container } = render(
        <LineGraph
          responseTimes={edgeCaseResponseTimes}
          requirements={[]}
          title="Edge Case Chart"
        />
      );

      const circles = container.querySelectorAll('circle.chart-point-response');
      expect(circles).toHaveLength(2);
      
      circles.forEach((circle) => {
        const cx = circle.getAttribute('cx');
        const cy = circle.getAttribute('cy');
        const r = circle.getAttribute('r');
        
        // With zero values, the component may produce NaN for cy due to division by zero
        // This test verifies the issue exists and helps identify the Firefox rendering problem
        expect(cx).not.toBe('');
        expect(cy).not.toBe('');
        expect(r).not.toBe('');
        
        // cx should be valid (based on percentile positioning)
        expect(isNaN(Number(cx))).toBe(false);
        
        // cy should now be valid due to the safeYMax fix preventing division by zero
        expect(isNaN(Number(cy))).toBe(false);
        
        // r (radius) should always be valid from the mocked interactions
        expect(isNaN(Number(r))).toBe(false);
        expect(Number(r)).toBeGreaterThan(0);
      });
    });

    test('handles very large values that might cause Firefox precision issues', () => {
      const largeValueResponseTimes: ResponseTimeData = {
        min: 1000000,
        max: 9999999,
        percentiles: {
          '50': 5000000,
          '99': 9999999,
        },
      };

      const { container } = render(
        <LineGraph
          responseTimes={largeValueResponseTimes}
          requirements={[]}
          title="Large Values Chart"
        />
      );

      const circles = container.querySelectorAll('circle.chart-point-response');
      expect(circles).toHaveLength(2);
      
      circles.forEach((circle) => {
        const cx = Number(circle.getAttribute('cx'));
        const cy = Number(circle.getAttribute('cy'));
        
        // Values should be finite and within reasonable SVG coordinate space
        expect(isFinite(cx)).toBe(true);
        expect(isFinite(cy)).toBe(true);
        expect(cx).toBeGreaterThanOrEqual(0);
        expect(cy).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
