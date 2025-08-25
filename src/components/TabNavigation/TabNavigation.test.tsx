import { render, screen, fireEvent } from '@testing-library/react';
import TabNavigation, { TabNavigationProps, TabType } from './TabNavigation';

const defaultProps: TabNavigationProps = {
  activeTab: 'summary',
  onTabChange: jest.fn(),
};

describe('TabNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all tab buttons', () => {
      render(<TabNavigation {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Summary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Response Times' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Metadata' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Requests' })).toBeInTheDocument();
    });

    it('applies active styles to the active tab', () => {
      render(<TabNavigation {...defaultProps} activeTab="summary" />);
      
      const summaryTab = screen.getByRole('button', { name: 'Summary' });
      expect(summaryTab).toHaveClass('border-blue-500', 'text-blue-600');
    });

    it('applies inactive styles to non-active tabs', () => {
      render(<TabNavigation {...defaultProps} activeTab="summary" />);
      
      const responseTimesTab = screen.getByRole('button', { name: 'Response Times' });
      expect(responseTimesTab).toHaveClass('border-transparent', 'text-gray-500');
    });

    it('renders with correct structure and classes', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('mb-6');
      
      const borderDiv = wrapper.firstChild as HTMLElement;
      expect(borderDiv).toHaveClass('border-b', 'border-gray-200');
      
      const nav = borderDiv.firstChild as HTMLElement;
      expect(nav).toHaveClass('flex', '-mb-px', 'space-x-8');
    });
  });

  describe('Tab Interactions', () => {
    it('calls onTabChange when Summary tab is clicked', () => {
      const mockOnTabChange = jest.fn();
      render(<TabNavigation {...defaultProps} onTabChange={mockOnTabChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Summary' }));
      expect(mockOnTabChange).toHaveBeenCalledWith('summary');
    });

    it('calls onTabChange when Response Times tab is clicked', () => {
      const mockOnTabChange = jest.fn();
      render(<TabNavigation {...defaultProps} onTabChange={mockOnTabChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Response Times' }));
      expect(mockOnTabChange).toHaveBeenCalledWith('responseTimes');
    });

    it('calls onTabChange when Metadata tab is clicked', () => {
      const mockOnTabChange = jest.fn();
      render(<TabNavigation {...defaultProps} onTabChange={mockOnTabChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Metadata' }));
      expect(mockOnTabChange).toHaveBeenCalledWith('metadata');
    });

    it('calls onTabChange when Requests tab is clicked', () => {
      const mockOnTabChange = jest.fn();
      render(<TabNavigation {...defaultProps} onTabChange={mockOnTabChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Requests' }));
      expect(mockOnTabChange).toHaveBeenCalledWith('requests');
    });

    it('does not call onTabChange multiple times for single click', () => {
      const mockOnTabChange = jest.fn();
      render(<TabNavigation {...defaultProps} onTabChange={mockOnTabChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Summary' }));
      expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Active Tab States', () => {
    const tabStates: Array<{ tab: TabType; label: string }> = [
      { tab: 'summary', label: 'Summary' },
      { tab: 'responseTimes', label: 'Response Times' },
      { tab: 'metadata', label: 'Metadata' },
      { tab: 'requests', label: 'Requests' },
    ];

    tabStates.forEach(({ tab, label }) => {
      it(`correctly highlights ${label} tab when active`, () => {
        render(<TabNavigation {...defaultProps} activeTab={tab} />);
        
        const activeTab = screen.getByRole('button', { name: label });
        expect(activeTab).toHaveClass('border-blue-500', 'text-blue-600');
        
        // Check that other tabs are not active
        const allTabs = screen.getAllByRole('button');
        const inactiveTabs = allTabs.filter(t => t !== activeTab);
        
        inactiveTabs.forEach(inactiveTab => {
          expect(inactiveTab).toHaveClass('border-transparent', 'text-gray-500');
          expect(inactiveTab).not.toHaveClass('border-blue-500', 'text-blue-600');
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('has proper navigation structure', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const summaryTab = screen.getByRole('button', { name: 'Summary' });
      expect(summaryTab).toHaveClass('py-2', 'px-1', 'border-b-2', 'font-medium', 'text-sm', 'transition-colors');
    });

    it('buttons are keyboard accessible', () => {
      render(<TabNavigation {...defaultProps} />);
      
      const summaryTab = screen.getByRole('button', { name: 'Summary' });
      summaryTab.focus();
      expect(summaryTab).toHaveFocus();
    });
  });

  describe('Hover States', () => {
    it('applies hover classes to inactive tabs', () => {
      render(<TabNavigation {...defaultProps} activeTab="summary" />);
      
      const responseTimesTab = screen.getByRole('button', { name: 'Response Times' });
      expect(responseTimesTab).toHaveClass('hover:text-gray-700');
    });

    it('maintains active styles on active tab during hover', () => {
      render(<TabNavigation {...defaultProps} activeTab="summary" />);
      
      const summaryTab = screen.getByRole('button', { name: 'Summary' });
      fireEvent.mouseEnter(summaryTab);
      expect(summaryTab).toHaveClass('border-blue-500', 'text-blue-600');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onTabChange gracefully', () => {
      const props = { ...defaultProps, onTabChange: undefined as any };
      
      expect(() => {
        render(<TabNavigation {...props} />);
      }).not.toThrow();
    });

    it('renders correctly with empty activeTab', () => {
      const props = { ...defaultProps, activeTab: '' as any };
      
      render(<TabNavigation {...props} />);
      
      // All tabs should be inactive
      const allTabs = screen.getAllByRole('button');
      allTabs.forEach(tab => {
        expect(tab).toHaveClass('border-transparent', 'text-gray-500');
        expect(tab).not.toHaveClass('border-blue-500', 'text-blue-600');
      });
    });
  });
});
