import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
const mockMatchMedia = {
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockMatchMedia),
});

// Mock document.documentElement with proper classList
const mockClassList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
  toggle: jest.fn(),
  toString: jest.fn().mockReturnValue(''),
};

const mockDocumentElement = {
  classList: mockClassList,
};

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  writable: true,
});

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
    </div>
  );
};

describe('ThemeContext Unified Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.matches = false;
  });

  describe('Theme Initialization', () => {
    it('initializes with saved theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });

    it('initializes with system preference when no saved theme', () => {
      mockMatchMedia.matches = true; // System prefers light
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
    });

    it('defaults to dark theme when no saved theme and system prefers dark', () => {
      mockMatchMedia.matches = false; // System doesn't prefer light
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });
  });

  describe('Theme Switching and DOM Management', () => {
    it('correctly switches from light to dark and updates DOM', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-dark'));
      });
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dashboard-theme', 'dark');
    });

    it('correctly switches from dark to light and updates DOM', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-light'));
      });
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dashboard-theme', 'light');
    });

    it('toggleTheme works correctly from light to dark', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      
      act(() => {
        fireEvent.click(screen.getByTestId('toggle-theme'));
      });
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });

    it('toggleTheme works correctly from dark to light', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      
      act(() => {
        fireEvent.click(screen.getByTestId('toggle-theme'));
      });
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('Persistence', () => {
    it('saves theme changes to localStorage', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-dark'));
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dashboard-theme', 'dark');
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-light'));
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('dashboard-theme', 'light');
    });
  });

  describe('Error Handling', () => {
    it('throws error when useTheme is used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Expanded Row Theme Consistency', () => {
    // This test specifically addresses the original issue with expanded rows
    it('maintains consistent theme state during component re-renders', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
      
      // Simulate component re-render (like expanding a row)
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // Theme should remain consistent
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      // DOM should not be manipulated again unnecessarily
      expect(mockDocumentElement.classList.add).not.toHaveBeenCalledWith('dark');
    });

    it('prevents theme conflicts during state updates', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // Verify initial light theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
      
      // Clear mock calls to track new calls
      jest.clearAllMocks();
      
      // Simulate multiple rapid state changes (like expanding multiple rows)
      act(() => {
        fireEvent.click(screen.getByTestId('set-dark'));
      });
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-light'));
      });
      
      // Final state should be light
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      // Should have called both add and remove for dark class
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
    });
  });
});
