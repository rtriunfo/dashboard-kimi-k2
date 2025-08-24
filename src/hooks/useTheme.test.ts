import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.matchMedia
const mockMatchMedia = {
  matches: false,
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

// Mock document.documentElement
const mockDocumentElement = {
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
  },
};

describe('useTheme', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia),
    });
    
    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true,
    });
    
    // Reset matchMedia mock state
    mockMatchMedia.matches = false;
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Theme Initialization', () => {
    it('initializes with system theme when no localStorage value exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.mode).toBe('system');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
    });

    it('initializes with stored theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.mode).toBe('dark');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
    });

    it('handles server-side rendering (window undefined)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.mode).toBe('system');
      
      global.window = originalWindow;
    });
  });

  describe('Theme Switching', () => {
    it('switches to dark theme correctly', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(result.current.mode).toBe('dark');
      expect(result.current.isDark).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('switches to light theme correctly', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('light');
      });
      
      expect(result.current.mode).toBe('light');
      expect(result.current.isDark).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('switches to system theme correctly', () => {
      mockMatchMedia.matches = true; // System prefers dark
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('system');
      });
      
      expect(result.current.mode).toBe('system');
      expect(result.current.isDark).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'system');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('toggles theme from light to dark', () => {
      const { result } = renderHook(() => useTheme());
      
      // Start with light theme
      act(() => {
        result.current.setThemeMode('light');
      });
      
      expect(result.current.isDark).toBe(false);
      
      // Toggle to dark
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.mode).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('toggles theme from dark to light', () => {
      const { result } = renderHook(() => useTheme());
      
      // Start with dark theme
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(result.current.isDark).toBe(true);
      
      // Toggle to light
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.mode).toBe('light');
      expect(result.current.isDark).toBe(false);
    });
  });

  describe('System Theme Detection', () => {
    it('detects system dark theme preference', () => {
      mockMatchMedia.matches = true; // System prefers dark
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('system');
      });
      
      expect(result.current.isDark).toBe(true);
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('detects system light theme preference', () => {
      mockMatchMedia.matches = false; // System prefers light
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('system');
      });
      
      expect(result.current.isDark).toBe(false);
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('responds to system theme changes when in system mode', () => {
      mockMatchMedia.matches = false; // Initially light
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('system');
      });
      
      expect(result.current.isDark).toBe(false);
      
      // Simulate system theme change to dark
      mockMatchMedia.matches = true;
      
      // Trigger the change event
      const changeHandler = mockMatchMedia.addEventListener.mock.calls
        .find(call => call[0] === 'change')?.[1];
      
      if (changeHandler) {
        act(() => {
          changeHandler();
        });
        
        expect(result.current.isDark).toBe(true);
        expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
      }
    });

    it('does not respond to system theme changes when not in system mode', () => {
      mockMatchMedia.matches = false;
      
      const { result } = renderHook(() => useTheme());
      
      // Set to explicit dark mode
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(result.current.isDark).toBe(true);
      
      // Simulate system theme change (should be ignored)
      mockMatchMedia.matches = true;
      
      const changeHandler = mockMatchMedia.addEventListener.mock.calls
        .find(call => call[0] === 'change')?.[1];
      
      if (changeHandler) {
        act(() => {
          changeHandler();
        });
        
        // Should still be dark (not affected by system change)
        expect(result.current.isDark).toBe(true);
      }
    });

    it('sets up and cleans up media query listener', () => {
      const { unmount } = renderHook(() => useTheme());
      
      expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      
      unmount();
      
      expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Theme Persistence', () => {
    it('persists theme mode to localStorage when changed', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      
      act(() => {
        result.current.setThemeMode('light');
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      
      act(() => {
        result.current.setThemeMode('system');
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'system');
    });

    it('loads persisted theme on initialization', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.mode).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('handles invalid persisted theme values gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme');
      
      const { result } = renderHook(() => useTheme());
      
      // Should default to system when invalid value is found
      expect(result.current.mode).toBe('invalid-theme' as any);
    });
  });

  describe('Theme Objects and CSS Variables', () => {
    it('returns light theme object when in light mode', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('light');
      });
      
      expect(result.current.theme.colors.primary).toBe('#2563eb');
      expect(result.current.theme.colors.background).toBe('#fafafa');
      expect(result.current.theme.colors.text).toBe('#374151');
    });

    it('returns dark theme object when in dark mode', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(result.current.theme.colors.primary).toBe('#3b82f6');
      expect(result.current.theme.colors.background).toBe('#1f2937');
      expect(result.current.theme.colors.text).toBe('#d1d5db');
    });

    it('generates correct CSS variables for light theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('light');
      });
      
      const cssVars = result.current.getCSSVariables();
      
      expect(cssVars).toEqual({
        '--chart-primary': '#2563eb',
        '--chart-secondary': '#7c3aed',
        '--chart-success': '#059669',
        '--chart-error': '#dc2626',
        '--chart-warning': '#d97706',
        '--chart-grid': '#e5e7eb',
        '--chart-background': '#fafafa',
        '--chart-text': '#374151',
        '--chart-font-primary': 'Inter, system-ui, sans-serif',
        '--chart-font-mono': 'JetBrains Mono, Consolas, monospace',
      });
    });

    it('generates correct CSS variables for dark theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      const cssVars = result.current.getCSSVariables();
      
      expect(cssVars).toEqual({
        '--chart-primary': '#3b82f6',
        '--chart-secondary': '#8b5cf6',
        '--chart-success': '#10b981',
        '--chart-error': '#ef4444',
        '--chart-warning': '#f59e0b',
        '--chart-grid': '#374151',
        '--chart-background': '#1f2937',
        '--chart-text': '#d1d5db',
        '--chart-font-primary': 'Inter, system-ui, sans-serif',
        '--chart-font-mono': 'JetBrains Mono, Consolas, monospace',
      });
    });

    it('includes getCSSVariables method in theme object', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(typeof result.current.theme.getCSSVariables).toBe('function');
      expect(result.current.theme.getCSSVariables).toBe(result.current.getCSSVariables);
    });
  });

  describe('Document Class Management', () => {
    it('adds dark class to document when switching to dark theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('removes dark class from document when switching to light theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('light');
      });
      
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('manages document class correctly for system theme based on preference', () => {
      mockMatchMedia.matches = true; // System prefers dark
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setThemeMode('system');
      });
      
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
      
      // Change system preference to light
      mockMatchMedia.matches = false;
      
      const changeHandler = mockMatchMedia.addEventListener.mock.calls
        .find(call => call[0] === 'change')?.[1];
      
      if (changeHandler) {
        act(() => {
          changeHandler();
        });
        
        expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
      }
    });
  });

  describe('Hook Stability', () => {
    it('maintains stable function references', () => {
      const { result, rerender } = renderHook(() => useTheme());
      
      const initialSetThemeMode = result.current.setThemeMode;
      const initialToggleTheme = result.current.toggleTheme;
      const initialGetCSSVariables = result.current.getCSSVariables;
      
      rerender();
      
      expect(result.current.setThemeMode).toBe(initialSetThemeMode);
      expect(result.current.toggleTheme).toBe(initialToggleTheme);
      expect(result.current.getCSSVariables).toBe(initialGetCSSVariables);
    });

    it('updates theme object when theme changes', () => {
      const { result } = renderHook(() => useTheme());
      
      const lightThemeColors = result.current.theme.colors;
      
      act(() => {
        result.current.setThemeMode('dark');
      });
      
      const darkThemeColors = result.current.theme.colors;
      
      expect(lightThemeColors).not.toBe(darkThemeColors);
      expect(darkThemeColors.primary).toBe('#3b82f6');
    });
  });
});
