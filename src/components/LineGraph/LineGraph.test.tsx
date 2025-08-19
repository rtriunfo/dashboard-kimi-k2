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
});
