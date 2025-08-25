import { render, screen } from '@testing-library/react';
import { Activity, Users, Clock, TrendingUp } from 'lucide-react';
import CompactMetricCard from './CompactMetricCard';

describe('CompactMetricCard', () => {
  const defaultProps = {
    icon: Activity,
    label: 'Test Metric',
    value: '123',
    color: 'text-blue-400',
  };

  it('renders with all required props', () => {
    render(<CompactMetricCard {...defaultProps} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('renders the icon with correct color class', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} />);
    
    const iconElement = container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('text-blue-400');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} />);
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('bg-white/80');
    expect(cardElement).toHaveClass('backdrop-blur-sm');
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('p-3');
    expect(cardElement).toHaveClass('border');
    expect(cardElement).toHaveClass('border-gray-200');
  });

  it('renders different icon types correctly', () => {
    const icons = [Activity, Users, Clock, TrendingUp];
    
    icons.forEach((IconComponent, index) => {
      const { container, unmount } = render(
        <CompactMetricCard
          {...defaultProps}
          icon={IconComponent}
          label={`Test ${index}`}
        />
      );
      
      const iconElement = container.querySelector('svg');
      expect(iconElement).toBeInTheDocument();
      expect(screen.getByText(`Test ${index}`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles different color variants', () => {
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-red-400',
      'text-yellow-400',
      'text-purple-400',
    ];

    colors.forEach((color) => {
      const { container, unmount } = render(
        <CompactMetricCard {...defaultProps} color={color} />
      );
      
      const iconElement = container.querySelector('svg');
      expect(iconElement).toHaveClass(color);
      
      unmount();
    });
  });

  it('handles long labels with truncation', () => {
    const longLabel = 'This is a very long label that should be truncated';
    render(<CompactMetricCard {...defaultProps} label={longLabel} />);
    
    const labelElement = screen.getByText(longLabel);
    expect(labelElement).toHaveClass('truncate');
    expect(labelElement).toHaveClass('text-xs');
    expect(labelElement).toHaveClass('text-gray-600');
  });

  it('handles long values with truncation', () => {
    const longValue = 'This is a very long value that should be truncated';
    render(<CompactMetricCard {...defaultProps} value={longValue} />);
    
    const valueElement = screen.getByText(longValue);
    expect(valueElement).toHaveClass('truncate');
    expect(valueElement).toHaveClass('text-sm');
    expect(valueElement).toHaveClass('font-semibold');
    expect(valueElement).toHaveClass('text-gray-900');
  });

  it('renders with numeric values', () => {
    const numericValues = ['0', '123', '1,234', '99.9%', '1.2K'];
    
    numericValues.forEach((value) => {
      const { unmount } = render(
        <CompactMetricCard {...defaultProps} value={value} />
      );
      
      expect(screen.getByText(value)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with special characters in label and value', () => {
    const specialProps = {
      ...defaultProps,
      label: 'CPU Usage (%)',
      value: '85.5%',
    };
    
    render(<CompactMetricCard {...specialProps} />);
    
    expect(screen.getByText('CPU Usage (%)')).toBeInTheDocument();
    expect(screen.getByText('85.5%')).toBeInTheDocument();
  });

  it('maintains proper flex layout structure', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} />);
    
    const flexContainer = container.querySelector('.flex.items-center.gap-2');
    expect(flexContainer).toBeInTheDocument();
    
    const iconElement = container.querySelector('.flex-shrink-0');
    expect(iconElement).toBeInTheDocument();
    
    const textContainer = container.querySelector('.min-w-0');
    expect(textContainer).toBeInTheDocument();
  });

  it('applies hover and transition effects', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} />);
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('hover:border-gray-300');
    expect(cardElement).toHaveClass('transition-all');
    expect(cardElement).toHaveClass('duration-200');
    expect(cardElement).toHaveClass('group');
  });

  it('handles empty string values gracefully', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} value="" />);
    
    const valueElement = container.querySelector('.text-sm.font-semibold.text-gray-900');
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass('text-sm');
    expect(valueElement?.textContent).toBe('');
  });

  it('handles empty string labels gracefully', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} label="" />);
    
    const labelElement = container.querySelector('.text-xs.text-gray-600');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('text-xs');
    expect(labelElement?.textContent).toBe('');
  });

  it('renders with different icon sizes correctly', () => {
    const { container } = render(<CompactMetricCard {...defaultProps} />);
    
    const iconElement = container.querySelector('svg');
    expect(iconElement).toHaveClass('w-4');
    expect(iconElement).toHaveClass('h-4');
  });

  it('maintains accessibility with proper text contrast', () => {
    render(<CompactMetricCard {...defaultProps} />);
    
    const labelElement = screen.getByText('Test Metric');
    const valueElement = screen.getByText('123');
    
    expect(labelElement).toHaveClass('text-gray-600');
    expect(valueElement).toHaveClass('text-gray-900');
  });

  it('renders multiple instances without conflicts', () => {
    render(
      <div>
        <CompactMetricCard
          icon={Activity}
          label="Metric 1"
          value="100"
          color="text-blue-400"
        />
        <CompactMetricCard
          icon={Users}
          label="Metric 2"
          value="200"
          color="text-green-400"
        />
      </div>
    );
    
    expect(screen.getByText('Metric 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Metric 2')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });
});
