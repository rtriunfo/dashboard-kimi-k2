import React from 'react';
import { render, screen } from '@testing-library/react';
import Requirements from './Requirements';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

// Mock ResizeObserver which doesn't exist in JSDOM
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

// Mock echarts
jest.mock('echarts', () => ({
  init: jest.fn().mockReturnValue({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn()
  })
}));

// Mock the useTheme hook to control theme in tests
jest.mock('../../contexts/ThemeContext', () => ({
  ...jest.requireActual('../../contexts/ThemeContext'),
  useTheme: jest.fn().mockImplementation(() => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn()
  }))
}));

// Helper function to render with theme
const renderWithTheme = (ui: React.ReactElement, { theme = 'light' } = {}) => {
  // Update the mock implementation for this test
  (useTheme as jest.Mock).mockImplementation(() => ({
    theme,
    toggleTheme: jest.fn(),
    setTheme: jest.fn()
  }));
  
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Requirements Component', () => {
  const mockRequirements = {
    passed: 8,
    failed: 2,
    percentiles: [
      { percentile: 50, value: 200, status: 'PASS', difference: -20 },
      { percentile: 90, value: 500, status: 'FAIL', difference: 50 }
    ]
  };

  it('renders correctly with requirements data', () => {
    renderWithTheme(<Requirements requirements={mockRequirements} resultId="test-1" />);
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    
    // Check if percentile section is rendered
    expect(screen.getByText('Percentile Requirements')).toBeInTheDocument();
    
    // Check if percentile data is displayed correctly
    expect(screen.getByText('50th:')).toBeInTheDocument();
    expect(screen.getByText('90th:')).toBeInTheDocument();
    expect(screen.getByText('200ms')).toBeInTheDocument();
    expect(screen.getByText('500ms')).toBeInTheDocument();
    
    // Check if difference values are displayed
    expect(screen.getByText('(-20ms)')).toBeInTheDocument();
    expect(screen.getByText('(+50ms)')).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    renderWithTheme(<Requirements requirements={mockRequirements} resultId="test-1" />, { theme: 'dark' });
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    
    // Check if percentile section is rendered in dark mode
    const percentileHeading = screen.getByText('Percentile Requirements');
    expect(percentileHeading).toHaveClass('dark:text-slate-400');
  });

  it('does not render when requirements data is empty', () => {
    const { container } = renderWithTheme(
      <Requirements 
        requirements={{ passed: 0, failed: 0 }} 
        resultId="test-1" 
      />
    );
    
    // Component should not render anything
    expect(container.firstChild).toBeNull();
  });

  it('renders without percentiles section when no percentile data is available', () => {
    renderWithTheme(
      <Requirements 
        requirements={{ passed: 5, failed: 2 }} 
        resultId="test-1" 
      />
    );
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    
    // Percentile section should not be rendered
    expect(screen.queryByText('Percentile Requirements')).not.toBeInTheDocument();
  });

  it('renders with only passed requirements', () => {
    renderWithTheme(
      <Requirements 
        requirements={{ passed: 10, failed: 0 }} 
        resultId="test-1" 
      />
    );
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Requirements')).toBeInTheDocument();
  });

  it('renders with only failed requirements', () => {
    renderWithTheme(
      <Requirements 
        requirements={{ passed: 0, failed: 5 }} 
        resultId="test-1" 
      />
    );
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Requirements')).toBeInTheDocument();
  });

  it('renders percentiles with null difference values', () => {
    const requirementsWithNullDiff = {
      passed: 8,
      failed: 2,
      percentiles: [
        { percentile: 50, value: 200, status: 'PASS', difference: null }
      ]
    };
    
    renderWithTheme(
      <Requirements 
        requirements={requirementsWithNullDiff} 
        resultId="test-1" 
      />
    );
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    
    // Check if percentile data is displayed correctly
    expect(screen.getByText('50th:')).toBeInTheDocument();
    expect(screen.getByText('200ms')).toBeInTheDocument();
    
    // Difference value should not be displayed
    expect(screen.queryByText(/\(\+?-?\d+ms\)/)).not.toBeInTheDocument();
  });
});
