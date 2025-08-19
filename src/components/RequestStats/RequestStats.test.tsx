import { render, screen } from '@testing-library/react';
import RequestStats, { RequestStatsProps } from './RequestStats';

// Mock PieChart component
jest.mock('../PieChart', () => {
  return function MockPieChart({ data, size }: { data: any[]; size: number }) {
    return (
      <div data-testid="pie-chart" data-size={size}>
        {data.map((item) => (
          <div key={item.label} data-testid={`pie-segment-${item.label.toLowerCase()}`}>
            {item.label}: {item.value}
          </div>
        ))}
      </div>
    );
  };
});

const mockStats: RequestStatsProps['stats'] = {
  total: 100,
  passed: 85,
  failed: 10,
  unavailable: 5,
};

describe('RequestStats', () => {
  it('renders without crashing', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('Request Statistics')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('Request Statistics')).toBeInTheDocument();
  });

  it('displays passed count correctly', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getAllByText('Passed')).toHaveLength(2); // One in stats, one in legend
  });

  it('displays failed count correctly', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('Failed')).toHaveLength(2); // One in stats, one in legend
  });

  it('displays unavailable count correctly', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getAllByText('Unavailable')).toHaveLength(2); // One in stats, one in legend
  });

  it('calculates and displays success rate correctly', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('renders PieChart with correct data', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toHaveAttribute('data-size', '120');
    expect(screen.getByTestId('pie-segment-passed')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-failed')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-unavailable')).toBeInTheDocument();
  });

  it('renders legend with correct colors and labels', () => {
    render(<RequestStats stats={mockStats} />);
    
    // Check for legend items
    const legendItems = screen.getAllByText(/^(Passed|Failed|Unavailable)$/);
    expect(legendItems).toHaveLength(6); // 3 in main stats + 3 in legend
    
    // Check for colored dots in legend (they have inline styles with background-color)
    const container = screen.getByText('Request Statistics').closest('div');
    const coloredDots = container?.querySelectorAll('[style*="background-color"]');
    expect(coloredDots).toHaveLength(3);
  });

  it('applies correct styling classes', () => {
    render(<RequestStats stats={mockStats} />);
    const container = screen.getByText('Request Statistics').closest('div');
    expect(container).toHaveClass('bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl', 'p-6', 'border', 'border-slate-700');
  });

  it('renders icons correctly', () => {
    render(<RequestStats stats={mockStats} />);
    const container = screen.getByText('Request Statistics').closest('div');
    
    // Check for lucide-react icons (they render as SVGs)
    const svgElements = container?.querySelectorAll('svg');
    expect(svgElements?.length).toBeGreaterThanOrEqual(3); // At least 3 status icons
  });

  it('handles zero values correctly', () => {
    const zeroStats = {
      total: 50,
      passed: 50,
      failed: 0,
      unavailable: 0,
    };
    
    render(<RequestStats stats={zeroStats} />);
    expect(screen.getAllByText('0')).toHaveLength(2); // Should show 0 for failed and unavailable
    expect(screen.getByText('100.0%')).toBeInTheDocument(); // 100% success rate
  });

  it('handles edge case with all zero values', () => {
    const allZeroStats = {
      total: 0,
      passed: 0,
      failed: 0,
      unavailable: 0,
    };
    
    render(<RequestStats stats={allZeroStats} />);
    expect(screen.getByText('NaN%')).toBeInTheDocument(); // Division by zero results in NaN
  });

  it('filters out zero values from pie chart data', () => {
    const partialStats = {
      total: 100,
      passed: 100,
      failed: 0,
      unavailable: 0,
    };
    
    render(<RequestStats stats={partialStats} />);
    
    // Only passed should appear in pie chart
    expect(screen.getByTestId('pie-segment-passed')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-segment-failed')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pie-segment-unavailable')).not.toBeInTheDocument();
  });

  it('handles large numbers correctly', () => {
    const largeStats = {
      total: 999999,
      passed: 850000,
      failed: 100000,
      unavailable: 49999,
    };
    
    render(<RequestStats stats={largeStats} />);
    expect(screen.getByText('850000')).toBeInTheDocument();
    expect(screen.getByText('100000')).toBeInTheDocument();
    expect(screen.getByText('49999')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
  });

  it('handles decimal success rates correctly', () => {
    const decimalStats = {
      total: 3,
      passed: 1,
      failed: 1,
      unavailable: 1,
    };
    
    render(<RequestStats stats={decimalStats} />);
    expect(screen.getByText('33.3%')).toBeInTheDocument();
  });

  it('maintains proper layout structure', () => {
    render(<RequestStats stats={mockStats} />);
    
    // Check main container structure
    const container = screen.getByText('Request Statistics').closest('div');
    expect(container).toBeInTheDocument();
    
    // Check for flex layout with gap
    const flexContainer = container?.querySelector('.flex.items-start.gap-6');
    expect(flexContainer).toBeInTheDocument();
  });

  it('renders success rate section with proper styling', () => {
    render(<RequestStats stats={mockStats} />);
    
    const successRateText = screen.getByText('85.0%');
    expect(successRateText).toHaveClass('text-2xl', 'font-bold', 'text-white');
    
    const successRateLabel = screen.getByText('Success Rate');
    expect(successRateLabel).toHaveClass('text-sm', 'text-slate-400');
  });

  it('renders with different stats configurations', () => {
    const differentStats = {
      total: 200,
      passed: 150,
      failed: 30,
      unavailable: 20,
    };
    
    render(<RequestStats stats={differentStats} />);
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
  });
});
