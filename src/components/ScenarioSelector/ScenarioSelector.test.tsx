import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScenarioSelector, { ScenarioSelectorProps, TestScenario } from './ScenarioSelector';

const mockScenarios: TestScenario[] = [
  {
    id: 'scenario-1',
    name: 'Peak Hour Load Test',
    description: 'High traffic simulation during peak hours',
  },
  {
    id: 'scenario-2',
    name: 'Baseline Performance Test',
    description: 'Standard performance baseline measurement',
  },
  {
    id: 'scenario-3',
    name: 'Stress Test',
    description: 'Maximum load capacity testing',
  },
];

const defaultProps: ScenarioSelectorProps = {
  selectedScenario: 'scenario-1',
  currentScenario: mockScenarios[0],
  availableScenarios: mockScenarios,
  isLoading: false,
  isDropdownOpen: false,
  onScenarioChange: jest.fn(),
  onToggleDropdown: jest.fn(),
  onCloseDropdown: jest.fn(),
};

describe('ScenarioSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the current scenario name', () => {
      render(<ScenarioSelector {...defaultProps} />);
      
      expect(screen.getByText('Peak Hour Load Test')).toBeInTheDocument();
    });

    it('renders "Select Scenario" when no current scenario', () => {
      render(<ScenarioSelector {...defaultProps} currentScenario={null} />);
      
      expect(screen.getByText('Select Scenario')).toBeInTheDocument();
    });

    it('shows loading state when isLoading is true', () => {
      render(<ScenarioSelector {...defaultProps} isLoading={true} />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Peak Hour Load Test')).not.toBeInTheDocument();
    });

    it('renders chevron icon with correct rotation', () => {
      const { rerender } = render(<ScenarioSelector {...defaultProps} />);
      
      const chevron = document.querySelector('.lucide-chevron-down');
      expect(chevron).toBeInTheDocument();
      
      // Test closed state
      expect(chevron).not.toHaveClass('rotate-180');
      
      // Test open state
      rerender(<ScenarioSelector {...defaultProps} isDropdownOpen={true} />);
      expect(chevron).toHaveClass('rotate-180');
    });

    it('applies disabled styles when loading', () => {
      render(<ScenarioSelector {...defaultProps} isLoading={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Dropdown Interactions', () => {
    it('calls onToggleDropdown when button is clicked', () => {
      const mockToggle = jest.fn();
      render(<ScenarioSelector {...defaultProps} onToggleDropdown={mockToggle} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('does not call onToggleDropdown when button is disabled', () => {
      const mockToggle = jest.fn();
      render(<ScenarioSelector {...defaultProps} isLoading={true} onToggleDropdown={mockToggle} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockToggle).not.toHaveBeenCalled();
    });

    it('renders dropdown options when open and not loading', () => {
      render(<ScenarioSelector {...defaultProps} isDropdownOpen={true} />);
      
      // Check for unique descriptions instead of names that appear in both button and dropdown
      expect(screen.getByText('High traffic simulation during peak hours')).toBeInTheDocument();
      expect(screen.getByText('Standard performance baseline measurement')).toBeInTheDocument();
      expect(screen.getByText('Maximum load capacity testing')).toBeInTheDocument();
    });

    it('does not render dropdown when closed', () => {
      render(<ScenarioSelector {...defaultProps} isDropdownOpen={false} />);
      
      // Only the button text should be visible, not the dropdown options
      const peakHourTexts = screen.getAllByText('Peak Hour Load Test');
      expect(peakHourTexts).toHaveLength(1); // Only in button, not in dropdown
    });

    it('does not render dropdown when loading', () => {
      render(<ScenarioSelector {...defaultProps} isLoading={true} isDropdownOpen={true} />);
      
      expect(screen.queryByText('High traffic simulation during peak hours')).not.toBeInTheDocument();
    });
  });

  describe('Scenario Selection', () => {
    it('calls onScenarioChange and onCloseDropdown when scenario is selected', () => {
      const mockScenarioChange = jest.fn();
      const mockCloseDropdown = jest.fn();
      
      render(
        <ScenarioSelector 
          {...defaultProps} 
          isDropdownOpen={true}
          onScenarioChange={mockScenarioChange}
          onCloseDropdown={mockCloseDropdown}
        />
      );
      
      const scenarioButton = screen.getByText('Baseline Performance Test').closest('button');
      fireEvent.click(scenarioButton!);
      
      expect(mockScenarioChange).toHaveBeenCalledWith('scenario-2');
      expect(mockCloseDropdown).toHaveBeenCalledTimes(1);
    });

    it('highlights selected scenario', () => {
      render(<ScenarioSelector {...defaultProps} isDropdownOpen={true} selectedScenario="scenario-2" />);
      
      const selectedButton = screen.getByText('Baseline Performance Test').closest('button');
      const unselectedButton = screen.getByText('Stress Test').closest('button');
      
      expect(selectedButton).toHaveClass('bg-slate-700', 'text-blue-400');
      expect(unselectedButton).toHaveClass('text-white');
      expect(unselectedButton).not.toHaveClass('bg-slate-700', 'text-blue-400');
    });

    it('applies hover styles to scenario options', () => {
      render(<ScenarioSelector {...defaultProps} isDropdownOpen={true} />);
      
      const scenarioButton = screen.getByText('Stress Test').closest('button');
      expect(scenarioButton).toHaveClass('hover:bg-slate-700');
    });
  });

  describe('Click Outside Behavior', () => {
    it('calls onCloseDropdown when clicking outside', async () => {
      const mockCloseDropdown = jest.fn();
      
      render(
        <div>
          <ScenarioSelector {...defaultProps} onCloseDropdown={mockCloseDropdown} />
          <div data-testid="outside-element">Outside</div>
        </div>
      );
      
      fireEvent.mouseDown(screen.getByTestId('outside-element'));
      
      await waitFor(() => {
        expect(mockCloseDropdown).toHaveBeenCalledTimes(1);
      });
    });

    it('does not call onCloseDropdown when clicking inside', async () => {
      const mockCloseDropdown = jest.fn();
      
      render(<ScenarioSelector {...defaultProps} onCloseDropdown={mockCloseDropdown} />);
      
      fireEvent.mouseDown(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockCloseDropdown).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<ScenarioSelector {...defaultProps} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('scenario option buttons have proper roles', () => {
      render(<ScenarioSelector {...defaultProps} isDropdownOpen={true} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1); // Main button + scenario options
    });

    it('maintains focus management', () => {
      render(<ScenarioSelector {...defaultProps} />);
      
      const mainButton = screen.getByRole('button');
      mainButton.focus();
      expect(mainButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty scenarios list', () => {
      render(<ScenarioSelector {...defaultProps} availableScenarios={[]} isDropdownOpen={true} />);
      
      // Should render dropdown container but no scenario options
      const dropdown = document.querySelector('.absolute.right-0.z-50');
      expect(dropdown).toBeInTheDocument();
      expect(dropdown?.children).toHaveLength(0);
    });

    it('handles undefined callbacks gracefully', () => {
      const props = {
        ...defaultProps,
        onScenarioChange: undefined as any,
        onToggleDropdown: undefined as any,
        onCloseDropdown: undefined as any,
      };
      
      expect(() => {
        render(<ScenarioSelector {...props} />);
      }).not.toThrow();
    });

    it('handles scenario without description', () => {
      const scenarioWithoutDesc: TestScenario = {
        id: 'no-desc',
        name: 'No Description Scenario',
        description: '',
      };
      
      render(
        <ScenarioSelector 
          {...defaultProps} 
          availableScenarios={[scenarioWithoutDesc]}
          isDropdownOpen={true}
        />
      );
      
      expect(screen.getByText('No Description Scenario')).toBeInTheDocument();
    });

    it('handles very long scenario names and descriptions', () => {
      const longScenario: TestScenario = {
        id: 'long-scenario',
        name: 'This is a very long scenario name that might overflow the container',
        description: 'This is an extremely long description that should test how the component handles text overflow and wrapping in the dropdown menu',
      };
      
      render(
        <ScenarioSelector 
          {...defaultProps} 
          availableScenarios={[longScenario]}
          currentScenario={longScenario}
          isDropdownOpen={true}
        />
      );
      
      // Check for the unique description instead of the name that appears in both places
      expect(screen.getByText(longScenario.description)).toBeInTheDocument();
      // Verify the name appears at least once
      expect(screen.getAllByText(longScenario.name).length).toBeGreaterThan(0);
    });
  });

  describe('Console Logging', () => {
    it('logs scenario selection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<ScenarioSelector {...defaultProps} isDropdownOpen={true} />);
      
      const scenarioButton = screen.getByText('Baseline Performance Test').closest('button');
      fireEvent.click(scenarioButton!);
      
      expect(consoleSpy).toHaveBeenCalledWith('Selecting scenario:', 'scenario-2', 'Baseline Performance Test');
      
      consoleSpy.mockRestore();
    });
  });
});
