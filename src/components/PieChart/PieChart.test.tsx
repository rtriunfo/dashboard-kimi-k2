import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PieChart from './PieChart';
import type { PieChartProps } from './PieChart';

const mockData: PieChartProps['data'] = [
  { label: 'Pass', value: 150, color: '#10b981' },
  { label: 'Fail', value: 25, color: '#ef4444' },
  { label: 'Warning', value: 10, color: '#f59e0b' },
];

describe('PieChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<PieChart data={mockData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('displays the correct total value in center', () => {
    const { container } = render(<PieChart data={mockData} />);
    const text = container.querySelector('text');
    expect(text).toHaveTextContent('185'); // 150 + 25 + 10
  });

  it('renders correct number of path segments', () => {
    const { container } = render(<PieChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(3); // One for each data item
  });

  it('applies correct colors to segments', () => {
    const { container } = render(<PieChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    
    expect(paths[0]).toHaveAttribute('fill', '#10b981');
    expect(paths[1]).toHaveAttribute('fill', '#ef4444');
    expect(paths[2]).toHaveAttribute('fill', '#f59e0b');
  });

  it('uses default size when not specified', () => {
    const { container } = render(<PieChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '120');
    expect(svg).toHaveAttribute('height', '120');
  });

  it('uses custom size when specified', () => {
    const { container } = render(<PieChart data={mockData} size={200} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('returns null when total value is zero', () => {
    const zeroData = [
      { label: 'Empty', value: 0, color: '#10b981' },
    ];
    const { container } = render(<PieChart data={zeroData} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when data array is empty', () => {
    const { container } = render(<PieChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles single data item correctly', () => {
    const singleData = [
      { label: 'Only', value: 100, color: '#10b981' },
    ];
    const { container } = render(<PieChart data={singleData} />);
    
    const svg = container.querySelector('svg');
    const paths = container.querySelectorAll('path');
    const text = container.querySelector('text');
    
    expect(svg).toBeInTheDocument();
    expect(paths).toHaveLength(1);
    expect(text).toHaveTextContent('100');
  });

  it('renders center circle for glass effect', () => {
    const { container } = render(<PieChart data={mockData} />);
    const circle = container.querySelector('circle');
    
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute('fill', 'rgba(38, 38, 38, 0.8)');
    expect(circle).toHaveAttribute('stroke', 'rgba(47, 47, 47, 0.5)');
  });

  it('applies hover styles to path elements', () => {
    const { container } = render(<PieChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    
    paths.forEach(path => {
      expect(path).toHaveClass('transition-all', 'duration-300', 'hover:opacity-80');
    });
  });

  it('applies rotation transform to svg', () => {
    const { container } = render(<PieChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('transform', '-rotate-90');
  });

  it('handles large numbers correctly', () => {
    const largeData = [
      { label: 'Large1', value: 999999, color: '#10b981' },
      { label: 'Large2', value: 1000000, color: '#ef4444' },
    ];
    const { container } = render(<PieChart data={largeData} />);
    const text = container.querySelector('text');
    expect(text).toHaveTextContent('1999999');
  });

  it('handles decimal values correctly', () => {
    const decimalData = [
      { label: 'Decimal1', value: 10.5, color: '#10b981' },
      { label: 'Decimal2', value: 5.3, color: '#ef4444' },
    ];
    const { container } = render(<PieChart data={decimalData} />);
    const text = container.querySelector('text');
    expect(text).toHaveTextContent('15.8');
  });

  it('applies drop shadow filter to paths', () => {
    const { container } = render(<PieChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    
    paths.forEach(path => {
      expect(path).toHaveStyle({ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' });
    });
  });

  it('positions center text correctly', () => {
    const { container } = render(<PieChart data={mockData} size={200} />);
    const text = container.querySelector('text');
    
    expect(text).toHaveAttribute('x', '100'); // center of 200px
    expect(text).toHaveAttribute('y', '100'); // center of 200px
    expect(text).toHaveAttribute('text-anchor', 'middle');
    expect(text).toHaveAttribute('dominant-baseline', 'middle');
  });
});
