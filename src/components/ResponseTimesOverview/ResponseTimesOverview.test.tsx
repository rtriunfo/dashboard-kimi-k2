import { render, screen } from '@testing-library/react';
import ResponseTimesOverview from './ResponseTimesOverview';

const mockResponseTimes = {
  min: 45,
  max: 2500,
  percentiles: {
    "50.0": 120,
    "75.0": 180,
    "90.0": 350,
    "95.0": 580,
    "99.0": 1200,
    "100.0": 2500
  }
};

describe('ResponseTimesOverview', () => {
  it('renders without crashing', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    expect(screen.getByText('Min')).toBeInTheDocument();
  });

  it('displays minimum response time correctly', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
  });

  it('displays maximum response time correctly', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    expect(screen.getByText('2500')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });

  it('displays all percentiles except P100', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    // Should show these percentiles
    expect(screen.getByText('P50')).toBeInTheDocument();
    expect(screen.getByText('P75')).toBeInTheDocument();
    expect(screen.getByText('P90')).toBeInTheDocument();
    expect(screen.getByText('P95')).toBeInTheDocument();
    expect(screen.getByText('P99')).toBeInTheDocument();
    
    // Should NOT show P100 (filtered out)
    expect(screen.queryByText('P100')).not.toBeInTheDocument();
  });

  it('displays percentile values correctly', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    expect(screen.getByText('120')).toBeInTheDocument(); // P50
    expect(screen.getByText('180')).toBeInTheDocument(); // P75
    expect(screen.getByText('350')).toBeInTheDocument(); // P90
    expect(screen.getByText('580')).toBeInTheDocument(); // P95
    expect(screen.getByText('1200')).toBeInTheDocument(); // P99
  });

  it('displays ms units for all values', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    const msElements = screen.getAllByText('ms');
    // Should have ms for min, max, and all percentiles (7 total)
    expect(msElements).toHaveLength(7);
  });

  it('renders Clock icon', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    const clockIcon = document.querySelector('.lucide-clock');
    expect(clockIcon).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    // Check main container classes
    const mainContainer = container.querySelector('.p-3.mt-4.border.rounded-lg');
    expect(mainContainer).toBeInTheDocument();
    
    // Check grid container classes
    const gridContainer = container.querySelector('.grid.flex-1.grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
  });

  it('handles empty percentiles object', () => {
    const emptyPercentiles = {
      min: 100,
      max: 200,
      percentiles: {}
    };
    
    render(<ResponseTimesOverview responseTimes={emptyPercentiles} />);
    
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('handles single percentile', () => {
    const singlePercentile = {
      min: 50,
      max: 150,
      percentiles: {
        "50.0": 100
      }
    };
    
    render(<ResponseTimesOverview responseTimes={singlePercentile} />);
    
    expect(screen.getByText('P50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('sorts percentiles in ascending order', () => {
    const unsortedPercentiles = {
      min: 10,
      max: 500,
      percentiles: {
        "99.0": 400,
        "50.0": 100,
        "90.0": 300,
        "75.0": 200
      }
    };
    
    render(<ResponseTimesOverview responseTimes={unsortedPercentiles} />);
    
    const percentileLabels = screen.getAllByText(/^P\d+$/);
    const percentileTexts = percentileLabels.map(el => el.textContent);
    
    expect(percentileTexts).toEqual(['P50', 'P75', 'P90', 'P99']);
  });

  it('handles decimal percentiles correctly', () => {
    const decimalPercentiles = {
      min: 25,
      max: 300,
      percentiles: {
        "50.5": 125,
        "75.25": 200
      }
    };
    
    render(<ResponseTimesOverview responseTimes={decimalPercentiles} />);
    
    expect(screen.getByText('P50.5')).toBeInTheDocument();
    expect(screen.getByText('P75.25')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    const zeroValues = {
      min: 0,
      max: 0,
      percentiles: {
        "50.0": 0,
        "90.0": 0
      }
    };
    
    render(<ResponseTimesOverview responseTimes={zeroValues} />);
    
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('handles large numbers', () => {
    const largeNumbers = {
      min: 1000000,
      max: 9999999,
      percentiles: {
        "50.0": 5000000
      }
    };
    
    render(<ResponseTimesOverview responseTimes={largeNumbers} />);
    
    expect(screen.getByText('1000000')).toBeInTheDocument();
    expect(screen.getByText('9999999')).toBeInTheDocument();
    expect(screen.getByText('5000000')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    // Check that labels and values are properly associated
    const minLabel = screen.getByText('Min');
    const maxLabel = screen.getByText('Max');
    
    expect(minLabel).toBeInTheDocument();
    expect(maxLabel).toBeInTheDocument();
    
    // Check that the grid container has text-center class
    const { container } = render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    const gridContainer = container.querySelector('.text-center');
    expect(gridContainer).toBeInTheDocument();
  });

  it('maintains responsive grid layout classes', () => {
    const { container } = render(<ResponseTimesOverview responseTimes={mockResponseTimes} />);
    
    const gridContainer = container.querySelector('.grid-cols-3.sm\\:grid-cols-4.lg\\:grid-cols-7');
    expect(gridContainer).toBeInTheDocument();
  });
});
