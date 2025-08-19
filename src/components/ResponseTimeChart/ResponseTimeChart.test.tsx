import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponseTimeChart from './ResponseTimeChart';
import type { ResponseTimeChartProps } from './ResponseTimeChart';

const mockResponseTimes: ResponseTimeChartProps['responseTimes'] = {
  min: 50,
  max: 2000,
  percentiles: {
    "50.0": 100,
    "90.0": 500,
    "95.0": 800,
    "99.0": 1200,
    "99.9": 1800,
  },
};

describe('ResponseTimeChart', () => {
  it('renders without crashing', () => {
    render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    expect(screen.getByText('Response Time Percentiles')).toBeInTheDocument();
  });

  it('displays all percentile labels', () => {
    render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    
    expect(screen.getByText('50th Percentile')).toBeInTheDocument();
    expect(screen.getByText('90th Percentile')).toBeInTheDocument();
    expect(screen.getByText('95th Percentile')).toBeInTheDocument();
    expect(screen.getByText('99th Percentile')).toBeInTheDocument();
    expect(screen.getByText('99.9th Percentile')).toBeInTheDocument();
  });

  it('displays all percentile values', () => {
    render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    
    expect(screen.getByText('100ms')).toBeInTheDocument();
    expect(screen.getByText('500ms')).toBeInTheDocument();
    expect(screen.getByText('800ms')).toBeInTheDocument();
    expect(screen.getByText('1200ms')).toBeInTheDocument();
    expect(screen.getByText('1800ms')).toBeInTheDocument();
  });

  it('displays min and max values', () => {
    render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    
    expect(screen.getByText('Min:')).toBeInTheDocument();
    expect(screen.getByText('50ms')).toBeInTheDocument();
    expect(screen.getByText('Max:')).toBeInTheDocument();
    expect(screen.getByText('2000ms')).toBeInTheDocument();
  });

  it('renders progress bars for each percentile', () => {
    const { container } = render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    
    // Check that progress bars exist (looking for elements with color classes)
    const progressBars = container.querySelectorAll('.bg-blue-500, .bg-green-500, .bg-yellow-500, .bg-orange-500, .bg-red-500');
    expect(progressBars).toHaveLength(5);
  });

  it('handles edge case with zero values', () => {
    const zeroResponseTimes = {
      min: 0,
      max: 0,
      percentiles: {
        "50.0": 0,
        "90.0": 0,
        "95.0": 0,
        "99.0": 0,
        "99.9": 0,
      },
    };

    render(<ResponseTimeChart responseTimes={zeroResponseTimes} />);
    
    expect(screen.getByText('Response Time Percentiles')).toBeInTheDocument();
    expect(screen.getAllByText('0ms')).toHaveLength(7); // 5 percentiles + min + max
  });

  it('handles missing percentile values gracefully', () => {
    const incompleteResponseTimes = {
      min: 50,
      max: 1000,
      percentiles: {
        "50.0": 100,
        "90.0": 500,
        // Missing some percentiles
      },
    };

    render(<ResponseTimeChart responseTimes={incompleteResponseTimes} />);
    
    expect(screen.getByText('Response Time Percentiles')).toBeInTheDocument();
    expect(screen.getByText('100ms')).toBeInTheDocument();
    expect(screen.getByText('500ms')).toBeInTheDocument();
  });

  it('calculates progress bar widths correctly', () => {
    const { container } = render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    
    // The max value is 1800ms (99.9th percentile)
    // 50th percentile (100ms) should be 100/1800 ≈ 5.56% width
    const progressBars = container.querySelectorAll('[style*="width"]');
    expect(progressBars.length).toBeGreaterThan(0);
    
    // Check that the last bar (highest value) has 100% width
    const lastBar = progressBars[progressBars.length - 1] as HTMLElement;
    expect(lastBar.style.width).toBe('100%');
  });

  it('renders the chart icon', () => {
    const { container } = render(<ResponseTimeChart responseTimes={mockResponseTimes} />);
    
    // Check for the BarChart3 icon (lucide-react renders as svg)
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
