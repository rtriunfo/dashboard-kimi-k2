import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssertionStats from './AssertionStats';
import type { AssertionStatsProps } from './AssertionStats';

const mockStats: AssertionStatsProps['stats'] = {
  total: 100,
  passed: 85,
  failed: 10,
  unavailable: 5,
};

describe('AssertionStats', () => {
  it('renders without crashing', () => {
    render(<AssertionStats stats={mockStats} />);
    expect(screen.getByText('Assertion Statistics')).toBeInTheDocument();
  });

  it('displays correct assertion counts', () => {
    render(<AssertionStats stats={mockStats} />);
    
    expect(screen.getByText('85')).toBeInTheDocument(); // passed
    expect(screen.getByText('10')).toBeInTheDocument(); // failed
    expect(screen.getByText('5')).toBeInTheDocument();  // unavailable
  });

  it('displays correct pass rate calculation', () => {
    render(<AssertionStats stats={mockStats} />);
    
    // (85/100) * 100 = 85.0%
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('Pass Rate')).toBeInTheDocument();
  });

  it('displays correct labels for each stat type', () => {
    render(<AssertionStats stats={mockStats} />);
    
    expect(screen.getAllByText('Passed')).toHaveLength(2); // stats section + legend
    expect(screen.getAllByText('Failed')).toHaveLength(2); // stats section + legend
    expect(screen.getAllByText('Unavailable')).toHaveLength(2); // stats section + legend
  });

  it('renders appropriate icons for each stat type', () => {
    const { container } = render(<AssertionStats stats={mockStats} />);
    
    // Check for lucide-react icons (rendered as SVGs)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(3); // At least 3 icons for the stats
  });

  it('renders PieChart component', () => {
    const { container } = render(<AssertionStats stats={mockStats} />);
    
    // PieChart renders as an SVG
    const pieChartSvg = container.querySelector('svg[width="120"]');
    expect(pieChartSvg).toBeInTheDocument();
  });

  it('renders legend items for pie chart', () => {
    render(<AssertionStats stats={mockStats} />);
    
    // Legend items should be present (we can't easily test the colored dots, but we can test the labels)
    const legendItems = screen.getAllByText(/Passed|Failed|Unavailable/);
    expect(legendItems.length).toBeGreaterThanOrEqual(3);
  });

  it('handles zero values correctly', () => {
    const zeroStats = {
      total: 50,
      passed: 50,
      failed: 0,
      unavailable: 0,
    };
    
    render(<AssertionStats stats={zeroStats} />);
    
    expect(screen.getAllByText('50')).toHaveLength(2); // passed count + pie chart center
    expect(screen.getAllByText('0')).toHaveLength(2);  // failed + unavailable
    expect(screen.getByText('100.0%')).toBeInTheDocument(); // 100% pass rate
  });

  it('handles decimal pass rates correctly', () => {
    const decimalStats = {
      total: 37,
      passed: 25,
      failed: 8,
      unavailable: 4,
    };
    
    render(<AssertionStats stats={decimalStats} />);
    
    // (25/37) * 100 = 67.567... should be rounded to 67.6%
    expect(screen.getByText('67.6%')).toBeInTheDocument();
  });

  it('filters out zero values from pie chart data', () => {
    const statsWithZeros = {
      total: 100,
      passed: 100,
      failed: 0,
      unavailable: 0,
    };
    
    const { container } = render(<AssertionStats stats={statsWithZeros} />);
    
    // Should still render the pie chart
    const pieChartSvg = container.querySelector('svg[width="120"]');
    expect(pieChartSvg).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<AssertionStats stats={mockStats} />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('bg-slate-800/50', 'backdrop-blur-sm', 'rounded-xl');
  });

  it('displays stats in correct layout structure', () => {
    const { container } = render(<AssertionStats stats={mockStats} />);
    
    // Check for the main flex container
    const flexContainer = container.querySelector('.flex.items-start.gap-6');
    expect(flexContainer).toBeInTheDocument();
    
    // Check for stats section and chart section
    const statsSection = container.querySelector('.flex-1.space-y-4');
    const chartSection = container.querySelector('.flex.flex-col.items-center');
    expect(statsSection).toBeInTheDocument();
    expect(chartSection).toBeInTheDocument();
  });

  it('handles large numbers correctly', () => {
    const largeStats = {
      total: 999999,
      passed: 850000,
      failed: 100000,
      unavailable: 49999,
    };
    
    render(<AssertionStats stats={largeStats} />);
    
    expect(screen.getAllByText('850000')).toHaveLength(1);
    expect(screen.getAllByText('100000')).toHaveLength(1);
    expect(screen.getAllByText('49999')).toHaveLength(1);
    expect(screen.getByText('85.0%')).toBeInTheDocument();
  });

  it('handles edge case with total of 1', () => {
    const singleStats = {
      total: 1,
      passed: 1,
      failed: 0,
      unavailable: 0,
    };
    
    render(<AssertionStats stats={singleStats} />);
    
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });

  it('renders with correct icon colors', () => {
    const { container } = render(<AssertionStats stats={mockStats} />);
    
    // Check for colored icons
    const greenIcon = container.querySelector('.text-green-400');
    const redIcon = container.querySelector('.text-red-400');
    const yellowIcon = container.querySelector('.text-yellow-400');
    
    expect(greenIcon).toBeInTheDocument();
    expect(redIcon).toBeInTheDocument();
    expect(yellowIcon).toBeInTheDocument();
  });

  it('renders legend with correct colors', () => {
    const { container } = render(<AssertionStats stats={mockStats} />);
    
    // Check for legend color indicators
    const colorDots = container.querySelectorAll('.w-3.h-3.rounded-full');
    expect(colorDots.length).toBeGreaterThan(0);
  });
});
