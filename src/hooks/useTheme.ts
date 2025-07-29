import { useState, useEffect, useCallback } from 'react';
import { ChartTheme } from '../types/chart.types';

type ThemeMode = 'light' | 'dark' | 'system';

const lightTheme: ChartTheme = {
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    grid: '#e5e7eb',
    background: '#fafafa',
    text: '#374151',
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

const darkTheme: ChartTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    grid: '#374151',
    background: '#1f2937',
    text: '#d1d5db',
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as ThemeMode) || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  // Determine if dark mode should be active
  const updateDarkMode = useCallback(() => {
    let shouldBeDark = false;

    if (mode === 'dark') {
      shouldBeDark = true;
    } else if (mode === 'light') {
      shouldBeDark = false;
    } else {
      // System preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDark(shouldBeDark);

    // Update document class
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    updateDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        updateDarkMode();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, updateDarkMode]);

  // Change theme mode
  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  // Get current theme object
  const theme = isDark ? darkTheme : lightTheme;

  // Get CSS custom properties for the current theme
  const getCSSVariables = useCallback(() => {
    return {
      '--chart-primary': theme.colors.primary,
      '--chart-secondary': theme.colors.secondary,
      '--chart-success': theme.colors.success,
      '--chart-error': theme.colors.error,
      '--chart-warning': theme.colors.warning,
      '--chart-grid': theme.colors.grid,
      '--chart-background': theme.colors.background,
      '--chart-text': theme.colors.text,
      '--chart-font-primary': theme.fonts.primary,
      '--chart-font-mono': theme.fonts.mono,
    };
  }, [theme]);

  return {
    mode,
    isDark,
    theme: {
      ...theme,
      getCSSVariables,
    },
    setThemeMode,
    toggleTheme,
    getCSSVariables,
  };
};