// React import removed as it's not needed in test files with modern React
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponseTimesDetailChart, { ResponseTimesDetailChartProps } from './ResponseTimesDetailChart';

const mockResponseTimes: ResponseTimesDetailChartProps['responseTimes'] = {
  min: 50,
  max: 1200,
  percentiles: {
    '50': 150,
    '75': 300,
    '90': 500,
    '95': 750,
    '99': 1000,
    '99.9': 1150
  }
};

const mockEmptyPercentiles: ResponseTimesDetailChartProps['responseTimes'] = {
  min: 0,
  max: 0,
  percentiles: {}
};

describe('ResponseTimesDetailChart', () => {
  describe('Component Rendering', () => {
    it('renders the component with title and clock icon', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      expect(screen.getByText('Response Times Analysis')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Bar' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Line' })).toBeInTheDocument();
    });

    it('renders minimum and maximum response times', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      expect(screen.getByText('Minimum Response Time')).toBeInTheDocument();
      expect(screen.getByText('Maximum Response Time')).toBeInTheDocument();
      
      // Check for min/max values in the summary cards specifically
      const minMaxSection = screen.getByText('Minimum Response Time').closest('.grid');
      expect(minMaxSection).toHaveTextContent('50ms');
      expect(minMaxSection).toHaveTextContent('1200ms');
    });

    it('renders description text', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      expect(screen.getByText('Response Time Distribution')).toBeInTheDocument();
      expect(screen.getByText(/The chart shows the distribution of response times/)).toBeInTheDocument();
    });
  });

  describe('Chart Type Toggle', () => {
    it('defaults to line chart view', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const lineButton = screen.getByRole('button', { name: 'Line' });
      const barButton = screen.getByRole('button', { name: 'Bar' });
      
      expect(lineButton).toHaveClass('bg-blue-500');
      expect(barButton).toHaveClass('bg-slate-700');
    });

    it('switches to bar chart when bar button is clicked', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const barButton = screen.getByRole('button', { name: 'Bar' });
      fireEvent.click(barButton);
      
      expect(barButton).toHaveClass('bg-blue-500');
      expect(screen.getByRole('button', { name: 'Line' })).toHaveClass('bg-slate-700');
    });

    it('switches back to line chart when line button is clicked', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const barButton = screen.getByRole('button', { name: 'Bar' });
      const lineButton = screen.getByRole('button', { name: 'Line' });
      
      // Switch to bar first
      fireEvent.click(barButton);
      expect(barButton).toHaveClass('bg-blue-500');
      
      // Switch back to line
      fireEvent.click(lineButton);
      expect(lineButton).toHaveClass('bg-blue-500');
      expect(barButton).toHaveClass('bg-slate-700');
    });
  });

  describe('Bar Chart View', () => {
    it('renders percentile bars in bar chart mode', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const barButton = screen.getByRole('button', { name: 'Bar' });
      fireEvent.click(barButton);
      
      expect(screen.getByText('50th Percentile')).toBeInTheDocument();
      expect(screen.getByText('75th Percentile')).toBeInTheDocument();
      expect(screen.getByText('90th Percentile')).toBeInTheDocument();
      expect(screen.getByText('95th Percentile')).toBeInTheDocument();
      expect(screen.getByText('99th Percentile')).toBeInTheDocument();
      expect(screen.getByText('99.9th Percentile')).toBeInTheDocument();
    });

    it('displays percentile values in bar chart mode', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const barButton = screen.getByRole('button', { name: 'Bar' });
      fireEvent.click(barButton);
      
      expect(screen.getByText('150ms')).toBeInTheDocument();
      expect(screen.getByText('300ms')).toBeInTheDocument();
      expect(screen.getByText('500ms')).toBeInTheDocument();
      expect(screen.getByText('750ms')).toBeInTheDocument();
      expect(screen.getByText('1000ms')).toBeInTheDocument();
      expect(screen.getByText('1150ms')).toBeInTheDocument();
    });
  });

  describe('Line Chart View', () => {
    it('renders SVG chart in line chart mode', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      // Should be in line mode by default
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    it('renders Y-axis labels in line chart mode', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      // Check Y-axis labels in the chart area specifically
      const yAxisContainer = document.querySelector('.absolute.top-0.left-0');
      expect(yAxisContainer).toHaveTextContent('1200ms');
      expect(yAxisContainer).toHaveTextContent('900ms');
      expect(yAxisContainer).toHaveTextContent('600ms');
      expect(yAxisContainer).toHaveTextContent('300ms');
      expect(yAxisContainer).toHaveTextContent('0ms');
    });

    it('renders X-axis percentile labels in line chart mode', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      expect(screen.getByText('50th')).toBeInTheDocument();
      expect(screen.getByText('75th')).toBeInTheDocument();
      expect(screen.getByText('90th')).toBeInTheDocument();
      expect(screen.getByText('95th')).toBeInTheDocument();
      expect(screen.getByText('99th')).toBeInTheDocument();
      expect(screen.getByText('99.9th')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty percentiles gracefully', () => {
      render(<ResponseTimesDetailChart responseTimes={mockEmptyPercentiles} />);
      
      expect(screen.getByText('Response Times Analysis')).toBeInTheDocument();
      
      // Check for 0ms values in the summary cards specifically
      const minMaxSection = screen.getByText('Minimum Response Time').closest('.grid');
      expect(minMaxSection).toHaveTextContent('0ms');
    });

    it('handles single percentile data', () => {
      const singlePercentile = {
        min: 100,
        max: 200,
        percentiles: { '50': 150 }
      };
      
      render(<ResponseTimesDetailChart responseTimes={singlePercentile} />);
      
      expect(screen.getByText('Response Times Analysis')).toBeInTheDocument();
      
      // Check for min/max values in the summary cards specifically
      const minMaxSection = screen.getByText('Minimum Response Time').closest('.grid');
      expect(minMaxSection).toHaveTextContent('100ms');
      expect(minMaxSection).toHaveTextContent('200ms');
    });

    it('handles very large response time values', () => {
      const largeValues = {
        min: 5000,
        max: 50000,
        percentiles: { '50': 10000, '99': 45000 }
      };
      
      render(<ResponseTimesDetailChart responseTimes={largeValues} />);
      
      // Check for min/max values in the summary cards specifically
      const minMaxSection = screen.getByText('Minimum Response Time').closest('.grid');
      expect(minMaxSection).toHaveTextContent('5000ms');
      expect(minMaxSection).toHaveTextContent('50000ms');
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles and labels', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const barButton = screen.getByRole('button', { name: 'Bar' });
      const lineButton = screen.getByRole('button', { name: 'Line' });
      
      expect(barButton).toBeInTheDocument();
      expect(lineButton).toBeInTheDocument();
    });

    it('maintains focus management when switching chart types', () => {
      render(<ResponseTimesDetailChart responseTimes={mockResponseTimes} />);
      
      const barButton = screen.getByRole('button', { name: 'Bar' });
      barButton.focus();
      fireEvent.click(barButton);
      
      expect(document.activeElement).toBe(barButton);
    });
  });

  describe('Data Processing', () => {
    it('sorts percentiles correctly', () => {
      const unsortedPercentiles = {
        min: 50,
        max: 1000,
        percentiles: {
          '99': 900,
          '50': 150,
          '90': 500,
          '75': 300
        }
      };
      
      render(<ResponseTimesDetailChart responseTimes={unsortedPercentiles} />);
      
      // Switch to bar mode to see the order
      fireEvent.click(screen.getByRole('button', { name: 'Bar' }));
      
      const percentileElements = screen.getAllByText(/\d+th Percentile/);
      expect(percentileElements[0]).toHaveTextContent('50th Percentile');
      expect(percentileElements[1]).toHaveTextContent('75th Percentile');
      expect(percentileElements[2]).toHaveTextContent('90th Percentile');
      expect(percentileElements[3]).toHaveTextContent('99th Percentile');
    });

    it('calculates max value correctly including response times max', () => {
      const dataWithHighMax = {
        min: 50,
        max: 2000, // Higher than any percentile
        percentiles: {
          '50': 150,
          '99': 1000
        }
      };
      
      render(<ResponseTimesDetailChart responseTimes={dataWithHighMax} />);
      
      // Check Y-axis shows 2000ms as the max in the chart area
      const yAxisContainer = document.querySelector('.absolute.top-0.left-0');
      expect(yAxisContainer).toHaveTextContent('2000ms');
    });
  });
});
