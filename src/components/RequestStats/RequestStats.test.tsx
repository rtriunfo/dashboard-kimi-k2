import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestStats, { RequestStatsProps } from './RequestStats';

// Mock PieChart component
jest.mock('../PieChart', () => {
  const MockPieChart = ({ data, size }: { data: Array<{ label: string; value: number; color: string }>; size: number }) => (
    <div data-testid="pie-chart" data-size={size}>
      {data.map((item, index) => (
        <div key={index} data-testid={`pie-segment-${item.label.toLowerCase()}`}>
          {item.label}: {item.value}
        </div>
      ))}
    </div>
  );
  return {
    __esModule: true,
    default: MockPieChart,
  };
});

describe('RequestStats', () => {
  const mockStats: RequestStatsProps['stats'] = {
    total: 100,
    passed: 75,
    failed: 20,
    unavailable: 5,
  };

  it('renders the component title', () => {
    render(<RequestStats stats={mockStats} />);
    expect(screen.getByText('Request Statistics')).toBeInTheDocument();
  });

  it('displays all stat categories with correct values', () => {
    render(<RequestStats stats={mockStats} />);
    
    expect(screen.getAllByText('Passed')).toHaveLength(2); // One in stats, one in legend
    expect(screen.getByText('75')).toBeInTheDocument();
    
    expect(screen.getAllByText('Failed')).toHaveLength(2); // One in stats, one in legend
    expect(screen.getByText('20')).toBeInTheDocument();
    
    expect(screen.getAllByText('Unavailable')).toHaveLength(2); // One in stats, one in legend
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calculates and displays correct success rate', () => {
    render(<RequestStats stats={mockStats} />);
    
    const successRate = ((75 / 100) * 100).toFixed(1);
    expect(screen.getByText(`${successRate}%`)).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('renders PieChart with correct data', () => {
    render(<RequestStats stats={mockStats} />);
    
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
    expect(pieChart).toHaveAttribute('data-size', '120');
    
    expect(screen.getByTestId('pie-segment-passed')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-failed')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-unavailable')).toBeInTheDocument();
  });

  it('filters out zero values from pie chart data', () => {
    const statsWithZeros = {
      total: 50,
      passed: 50,
      failed: 0,
      unavailable: 0,
    };
    
    render(<RequestStats stats={statsWithZeros} />);
    
    expect(screen.getByTestId('pie-segment-passed')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-segment-failed')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pie-segment-unavailable')).not.toBeInTheDocument();
  });

  it('handles edge case with zero total', () => {
    const zeroStats = {
      total: 0,
      passed: 0,
      failed: 0,
      unavailable: 0,
    };
    
    render(<RequestStats stats={zeroStats} />);
    
    // Should display NaN% or handle division by zero gracefully
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('displays correct icons for each category', () => {
    render(<RequestStats stats={mockStats} />);
    
    // Check that lucide-react icons are rendered (they should have specific classes)
    const container = screen.getByText('Request Statistics').closest('div');
    expect(container).toBeInTheDocument();
    
    // Icons should be present in the DOM (lucide-react renders as SVG elements)
    const svgElements = container?.querySelectorAll('svg');
    expect(svgElements?.length).toBeGreaterThan(0);
  });

  it('renders legend items for pie chart', () => {
    render(<RequestStats stats={mockStats} />);
    
    // The legend should show colored dots and labels
    const legendContainer = screen.getByText('Request Statistics').closest('div');
    expect(legendContainer).toBeInTheDocument();
    
    // Check for legend items (they should be in the pie chart data)
    expect(screen.getByTestId('pie-segment-passed')).toHaveTextContent('Passed: 75');
    expect(screen.getByTestId('pie-segment-failed')).toHaveTextContent('Failed: 20');
    expect(screen.getByTestId('pie-segment-unavailable')).toHaveTextContent('Unavailable: 5');
  });

  it('applies correct styling classes', () => {
    render(<RequestStats stats={mockStats} />);
    
    const mainContainer = screen.getByText('Request Statistics').closest('div');
    expect(mainContainer).toHaveClass('bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl', 'p-6', 'border', 'border-slate-700');
  });

  it('handles large numbers correctly', () => {
    const largeStats = {
      total: 999999,
      passed: 500000,
      failed: 300000,
      unavailable: 199999,
    };
    
    render(<RequestStats stats={largeStats} />);
    
    expect(screen.getByText('500000')).toBeInTheDocument();
    expect(screen.getByText('300000')).toBeInTheDocument();
    expect(screen.getByText('199999')).toBeInTheDocument();
    
    const successRate = ((500000 / 999999) * 100).toFixed(1);
    expect(screen.getByText(`${successRate}%`)).toBeInTheDocument();
  });

  it('handles decimal success rates correctly', () => {
    const decimalStats = {
      total: 3,
      passed: 1,
      failed: 1,
      unavailable: 1,
    };
    
    render(<RequestStats stats={decimalStats} />);
    
    const successRate = ((1 / 3) * 100).toFixed(1);
    expect(screen.getByText(`${successRate}%`)).toBeInTheDocument();
  });
});