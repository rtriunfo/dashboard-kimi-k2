import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Activity, Clock, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';
import type { MetricCardProps } from './MetricCard';

const mockProps: MetricCardProps = {
  icon: Activity,
  title: 'Total Requests',
  value: '1,234',
  color: 'text-blue-400',
};

describe('MetricCard', () => {
  it('renders without crashing', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('Total Requests')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('Total Requests')).toBeInTheDocument();
  });

  it('displays the correct value', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders the provided icon', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    
    // Check for the Activity icon (lucide-react renders as svg)
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies the correct color class to the icon', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-blue-400');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      'bg-slate-800/50',
      'backdrop-blur-sm',
      'rounded-xl',
      'p-6',
      'border',
      'border-slate-700',
      'hover:border-slate-600',
      'transition-all',
      'duration-200'
    );
  });

  it('renders with different icons correctly', () => {
    const { rerender, container } = render(<MetricCard {...mockProps} icon={Clock} />);
    
    let icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    
    rerender(<MetricCard {...mockProps} icon={TrendingUp} />);
    icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('handles different color classes', () => {
    const { container, rerender } = render(
      <MetricCard {...mockProps} color="text-red-500" />
    );
    
    let icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-red-500');
    
    rerender(<MetricCard {...mockProps} color="text-green-300" />);
    icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-green-300');
  });

  it('handles long titles correctly', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines';
    render(<MetricCard {...mockProps} title={longTitle} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('handles long values correctly', () => {
    const longValue = '999,999,999,999';
    render(<MetricCard {...mockProps} value={longValue} />);
    
    expect(screen.getByText(longValue)).toBeInTheDocument();
  });

  it('handles empty string values', () => {
    render(<MetricCard {...mockProps} value="" />);
    
    // Should still render the title
    expect(screen.getByText('Total Requests')).toBeInTheDocument();
  });

  it('handles special characters in title and value', () => {
    const specialTitle = 'Requests/Min (avg)';
    const specialValue = '1,234.56%';
    
    render(<MetricCard {...mockProps} title={specialTitle} value={specialValue} />);
    
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
    expect(screen.getByText(specialValue)).toBeInTheDocument();
  });

  it('maintains proper layout structure', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    
    // Check for the main flex container
    const flexContainer = container.querySelector('.flex.items-center.justify-between');
    expect(flexContainer).toBeInTheDocument();
    
    // Check for the text container
    const textContainer = flexContainer?.firstChild as HTMLElement;
    expect(textContainer).toBeInTheDocument();
    
    // Check for title styling
    const title = container.querySelector('.text-sm.font-medium.text-slate-400.mb-1');
    expect(title).toBeInTheDocument();
    
    // Check for value styling
    const value = container.querySelector('.text-2xl.font-bold.text-white');
    expect(value).toBeInTheDocument();
  });

  it('applies correct icon sizing', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('w-8', 'h-8');
  });

  it('handles numeric values as strings', () => {
    render(<MetricCard {...mockProps} value="42" />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('handles percentage values', () => {
    render(<MetricCard {...mockProps} value="85.5%" />);
    expect(screen.getByText('85.5%')).toBeInTheDocument();
  });

  it('handles currency values', () => {
    render(<MetricCard {...mockProps} value="$1,234.56" />);
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('handles time duration values', () => {
    render(<MetricCard {...mockProps} value="2h 30m" />);
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });
});
