import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeverityStats, { SeverityStatsProps } from './SeverityStats';

// Mock PieChart component since it's external
jest.mock('../PieChart/index', () => {
  return function MockPieChart({ data, size }: { data: any[]; size: number }) {
    return (
      <div data-testid="pie-chart" data-size={size}>
        {data.map((item, index) => (
          <div key={index} data-testid={`pie-segment-${item.label}`}>
            {item.label}: {item.value}
            <div 
              style={{ backgroundColor: item.color }}
              data-testid={`color-indicator-${item.label}`}
            />
          </div>
        ))}
      </div>
    );
  };
});

const defaultStats: SeverityStatsProps['stats'] = {
  blocker: 5,
  critical: 10,
  major: 15,
  minor: 20,
  none: 50,
};

const zeroStats: SeverityStatsProps['stats'] = {
  blocker: 0,
  critical: 0,
  major: 0,
  minor: 0,
  none: 0,
};

describe('SeverityStats', () => {
  it('renders without crashing', () => {
    render(<SeverityStats stats={defaultStats} />);
    expect(screen.getByText('Severity Distribution')).toBeInTheDocument();
  });

  it('displays all severity levels with correct values', () => {
    render(<SeverityStats stats={defaultStats} />);
    
    expect(screen.getAllByText('Blocker')).toHaveLength(2); // Main list + legend
    expect(screen.getAllByText('Critical')).toHaveLength(2);
    expect(screen.getAllByText('Major')).toHaveLength(2);
    expect(screen.getAllByText('Minor')).toHaveLength(2);
    expect(screen.getAllByText('None')).toHaveLength(2);
    
    // Check values in the main stats list (with font-medium class)
    const blockerValue = screen.getByText('5');
    const criticalValue = screen.getByText('10');
    const majorValue = screen.getByText('15');
    const minorValue = screen.getByText('20');
    
    expect(blockerValue).toHaveClass('text-gray-900', 'font-medium');
    expect(criticalValue).toHaveClass('text-gray-900', 'font-medium');
    expect(majorValue).toHaveClass('text-gray-900', 'font-medium');
    expect(minorValue).toHaveClass('text-gray-900', 'font-medium');
  });

  it('calculates and displays total issues correctly', () => {
    render(<SeverityStats stats={defaultStats} />);
    
    // Total should be blocker + critical + major + minor (excluding 'none')
    const expectedTotal = 5 + 10 + 15 + 20; // 50
    expect(screen.getByText('Total Issues')).toBeInTheDocument();
    
    // Find the total issues value specifically by its unique classes
    const totalElements = screen.getAllByText(expectedTotal.toString());
    const totalElement = totalElements.find(el => 
      el.classList.contains('text-2xl') && 
      el.classList.contains('font-bold') && 
      el.classList.contains('text-gray-900')
    );
    expect(totalElement).toBeInTheDocument();
  });

  it('renders PieChart with correct data', () => {
    render(<SeverityStats stats={defaultStats} />);
    
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
    expect(pieChart).toHaveAttribute('data-size', '120');
    
    // Check that all segments are present
    expect(screen.getByTestId('pie-segment-Blocker')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Critical')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Major')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Minor')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-None')).toBeInTheDocument();
  });

  it('filters out zero values from pie chart', () => {
    const statsWithZeros: SeverityStatsProps['stats'] = {
      blocker: 0,
      critical: 5,
      major: 0,
      minor: 10,
      none: 0,
    };
    
    render(<SeverityStats stats={statsWithZeros} />);
    
    // Should only show segments with non-zero values in the pie chart
    expect(screen.queryByTestId('pie-segment-Blocker')).not.toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Critical')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-segment-Major')).not.toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Minor')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-segment-None')).not.toBeInTheDocument();
    
    // But all values should still be displayed in the stats list
    const statsContainer = screen.getByText('Severity Distribution').closest('div');
    expect(statsContainer).toHaveTextContent('Critical');
    expect(statsContainer).toHaveTextContent('Minor');
    expect(statsContainer).toHaveTextContent('5');
    expect(statsContainer).toHaveTextContent('10');
  });

  it('handles all zero stats', () => {
    render(<SeverityStats stats={zeroStats} />);
    
    expect(screen.getByText('Severity Distribution')).toBeInTheDocument();
    expect(screen.getByText('Total Issues')).toBeInTheDocument();
    
    // Check for total issues showing 0
    const totalSection = screen.getByText('Total Issues').closest('div');
    expect(totalSection).toHaveTextContent('0');
    
    // All individual stats should show 0
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('displays correct icons for each severity level', () => {
    render(<SeverityStats stats={defaultStats} />);
    
    // Check that lucide-react icons are rendered (they should have specific classes)
    const container = screen.getByText('Severity Distribution').closest('div');
    expect(container).toBeInTheDocument();
    
    // Icons should be present with correct colors (checking for both light and dark mode classes)
    const redIcons = container?.querySelectorAll('[class*="text-red-500"]');
    const orangeIcons = container?.querySelectorAll('[class*="text-orange-500"]');
    const yellowIcons = container?.querySelectorAll('[class*="text-yellow-500"]');
    const blueIcons = container?.querySelectorAll('[class*="text-blue-500"]'); // Fixed from blue-600 to blue-500
    const greenIcons = container?.querySelectorAll('[class*="text-green-500"]');
    
    expect(redIcons?.length).toBe(1); // Blocker
    expect(orangeIcons?.length).toBe(1); // Critical
    expect(yellowIcons?.length).toBe(1); // Major
    expect(blueIcons?.length).toBe(1); // Minor
    expect(greenIcons?.length).toBe(1); // None
  });

  it('renders legend with correct colors', () => {
    render(<SeverityStats stats={defaultStats} />);
    
    // Check for color indicators in the mocked pie chart
    expect(screen.getByTestId('color-indicator-Blocker')).toBeInTheDocument();
    expect(screen.getByTestId('color-indicator-Critical')).toBeInTheDocument();
    expect(screen.getByTestId('color-indicator-Major')).toBeInTheDocument();
    expect(screen.getByTestId('color-indicator-Minor')).toBeInTheDocument();
    expect(screen.getByTestId('color-indicator-None')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<SeverityStats stats={defaultStats} />);
    
    // Should have proper heading
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Severity Distribution');
    
    // Should have proper semantic structure
    expect(screen.getByText('Total Issues')).toBeInTheDocument();
  });

  it('handles edge case with very large numbers', () => {
    const largeStats: SeverityStatsProps['stats'] = {
      blocker: 999999,
      critical: 888888,
      major: 777777,
      minor: 666666,
      none: 555555,
    };
    
    render(<SeverityStats stats={largeStats} />);
    
    expect(screen.getByText('999999')).toBeInTheDocument();
    expect(screen.getByText('888888')).toBeInTheDocument();
    
    // Total should be calculated correctly
    const expectedTotal = 999999 + 888888 + 777777 + 666666;
    expect(screen.getByText(expectedTotal.toString())).toBeInTheDocument();
  });
});
