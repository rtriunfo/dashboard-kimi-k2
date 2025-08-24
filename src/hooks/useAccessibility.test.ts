import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from './useAccessibility';
import { ChartData, RequirementData, ChartElementData } from '../types/chart.types';

// Mock DOM methods
const mockMatchMedia = jest.fn();
const mockQuerySelector = jest.fn();
const mockFocus = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// Mock speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    getVoices: jest.fn().mockReturnValue([])
  }
});

// Mock document.querySelector
Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true
});

// Mock setTimeout
jest.useFakeTimers();

describe('useAccessibility', () => {
  let mockMediaQueryList: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    // Setup mock MediaQueryList
    mockMediaQueryList = {
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener
    };

    mockMatchMedia.mockReturnValue(mockMediaQueryList);

    // Setup mock element
    const mockElement = document.createElement('div');
    mockElement.focus = mockFocus;
    mockQuerySelector.mockReturnValue(mockElement);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useAccessibility());

      expect(result.current.state).toEqual({
        isHighContrast: false,
        prefersReducedMotion: false,
        screenReaderActive: false,
        focusedElement: null
      });
    });

    it('should accept custom options', () => {
      const options = {
        announceDataChanges: false,
        enableKeyboardNavigation: false,
        provideSummary: false
      };

      const { result } = renderHook(() => useAccessibility(options));

      // State should still initialize the same way
      expect(result.current.state.isHighContrast).toBe(false);
    });

    it('should detect high contrast preference', () => {
      mockMediaQueryList.matches = true;
      mockMatchMedia.mockReturnValue(mockMediaQueryList);

      const { result } = renderHook(() => useAccessibility());

      expect(result.current.state.isHighContrast).toBe(true);
    });

    it('should detect reduced motion preference', () => {
      // First call for contrast (false), second call for motion (true)
      mockMatchMedia
        .mockReturnValueOnce({ ...mockMediaQueryList, matches: false })
        .mockReturnValueOnce({ ...mockMediaQueryList, matches: true });

      const { result } = renderHook(() => useAccessibility());

      expect(result.current.state.prefersReducedMotion).toBe(true);
    });

    it('should detect screen reader from user agent', () => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NVDA/2021.1'
        }
      });

      const { result } = renderHook(() => useAccessibility());

      expect(result.current.state.screenReaderActive).toBe(true);
    });

    it('should detect screen reader from speech synthesis', () => {
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: {
          getVoices: jest.fn().mockReturnValue([{ name: 'Voice 1' }])
        }
      });

      const { result } = renderHook(() => useAccessibility());

      expect(result.current.state.screenReaderActive).toBe(true);
    });
  });

  describe('media query listeners', () => {
    it('should add event listeners for media queries', () => {
      renderHook(() => useAccessibility());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledTimes(2); // contrast and motion
    });

    it('should remove event listeners on unmount', () => {
      const { unmount } = renderHook(() => useAccessibility());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    });

    it('should update state when contrast preference changes', () => {
      const { result } = renderHook(() => useAccessibility());

      // Simulate contrast change
      const contrastHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        contrastHandler({ matches: true });
      });

      expect(result.current.state.isHighContrast).toBe(true);
    });

    it('should update state when motion preference changes', () => {
      const { result } = renderHook(() => useAccessibility());

      // Simulate motion change
      const motionHandler = mockAddEventListener.mock.calls[1][1];
      act(() => {
        motionHandler({ matches: true });
      });

      expect(result.current.state.prefersReducedMotion).toBe(true);
    });
  });

  describe('announce function', () => {
    it('should announce messages to screen readers', () => {
      const { result } = renderHook(() => useAccessibility());

      // Create a mock announcement element
      const mockAnnouncementElement = document.createElement('div');
      const mockSetAttribute = jest.fn();
      mockAnnouncementElement.setAttribute = mockSetAttribute;
      result.current.announcementRef.current = mockAnnouncementElement;

      act(() => {
        result.current.announce('Test message', 'assertive');
      });

      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
      expect(mockAnnouncementElement.textContent).toBe('Test message');
    });

    it('should use polite priority by default', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockAnnouncementElement = document.createElement('div');
      const mockSetAttribute = jest.fn();
      mockAnnouncementElement.setAttribute = mockSetAttribute;
      result.current.announcementRef.current = mockAnnouncementElement;

      act(() => {
        result.current.announce('Test message');
      });

      expect(mockSetAttribute).toHaveBeenCalledWith('aria-live', 'polite');
    });

    it('should clear announcement after timeout', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockAnnouncementElement = document.createElement('div');
      mockAnnouncementElement.setAttribute = jest.fn();
      result.current.announcementRef.current = mockAnnouncementElement;

      act(() => {
        result.current.announce('Test message');
      });

      expect(mockAnnouncementElement.textContent).toBe('Test message');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockAnnouncementElement.textContent).toBe('');
    });

    it('should not announce when announceDataChanges is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ announceDataChanges: false }));

      const mockAnnouncementElement = document.createElement('div');
      const mockSetAttribute = jest.fn();
      mockAnnouncementElement.setAttribute = mockSetAttribute;
      result.current.announcementRef.current = mockAnnouncementElement;

      act(() => {
        result.current.announce('Test message');
      });

      expect(mockSetAttribute).not.toHaveBeenCalled();
    });

    it('should handle missing announcement element gracefully', () => {
      const { result } = renderHook(() => useAccessibility());

      result.current.announcementRef.current = null;

      expect(() => {
        act(() => {
          result.current.announce('Test message');
        });
      }).not.toThrow();
    });
  });

  describe('generateSummary function', () => {
    const mockChartData: ChartData = {
      responseTimes: {
        min: 10,
        max: 500,
        percentiles: {
          '50': 50,
          '90': 200,
          '95': 300,
          '99': 450
        }
      },
      requirements: [
        { status: 'PASS', percentile: 50, value: 100, difference: -50, percentageDifference: -50 },
        { status: 'FAIL', percentile: 90, value: 150, difference: 50, percentageDifference: 25 },
        { status: 'PASS', percentile: 95, value: 400, difference: -100, percentageDifference: -25 }
      ]
    };

    it('should generate accessible summary', () => {
      const { result } = renderHook(() => useAccessibility());

      const summary = result.current.generateSummary(mockChartData);

      expect(summary).toContain('Performance chart showing response times from 10ms to 500ms');
      expect(summary).toContain('Average response time is 250ms');
      expect(summary).toContain('2 out of 3 requirements are passing');
    });

    it('should return empty string when provideSummary is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ provideSummary: false }));

      const summary = result.current.generateSummary(mockChartData);

      expect(summary).toBe('');
    });

    it('should handle empty requirements array', () => {
      const { result } = renderHook(() => useAccessibility());

      const dataWithNoRequirements = {
        ...mockChartData,
        requirements: []
      };

      const summary = result.current.generateSummary(dataWithNoRequirements);

      expect(summary).toContain('0 out of 0 requirements are passing');
    });
  });

  describe('keyboard navigation', () => {
    const elements = ['element-1', 'element-2', 'element-3'];

    it('should navigate right with ArrowRight', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.state.focusedElement).toBe('element-1');
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-1"]');
      expect(mockFocus).toHaveBeenCalled();
    });

    it('should navigate left with ArrowLeft', () => {
      const { result } = renderHook(() => useAccessibility());

      // Set initial focused element to element-2
      act(() => {
        const mockEvent = {
          key: 'ArrowRight',
          preventDefault: jest.fn()
        } as unknown as KeyboardEvent;
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      // Navigate right again to get to element-2
      act(() => {
        const mockEvent = {
          key: 'ArrowRight',
          preventDefault: jest.fn()
        } as unknown as KeyboardEvent;
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      // Now navigate left from element-2 to element-1
      const mockEvent = {
        key: 'ArrowLeft',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.state.focusedElement).toBe('element-1');
    });

    it('should wrap around when navigating past end', () => {
      const { result } = renderHook(() => useAccessibility());

      // Navigate to last element
      act(() => {
        const mockEvent = {
          key: 'End',
          preventDefault: jest.fn()
        } as unknown as KeyboardEvent;
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      // Navigate right from last element
      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(result.current.state.focusedElement).toBe('element-1');
    });

    it('should wrap around when navigating past beginning', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockEvent = {
        key: 'ArrowLeft',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(result.current.state.focusedElement).toBe('element-3');
    });

    it('should navigate to first element with Home', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockEvent = {
        key: 'Home',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.state.focusedElement).toBe('element-1');
    });

    it('should navigate to last element with End', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockEvent = {
        key: 'End',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.state.focusedElement).toBe('element-3');
    });

    it('should not handle unrecognized keys', () => {
      const { result } = renderHook(() => useAccessibility());

      const mockEvent = {
        key: 'Tab',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.state.focusedElement).toBe(null);
    });

    it('should not navigate when keyboard navigation is disabled', () => {
      const { result } = renderHook(() => useAccessibility({ enableKeyboardNavigation: false }));

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyNavigation(mockEvent, elements);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.state.focusedElement).toBe(null);
    });

    it('should handle missing element gracefully', () => {
      mockQuerySelector.mockReturnValue(null);

      const { result } = renderHook(() => useAccessibility());

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as KeyboardEvent;

      expect(() => {
        act(() => {
          result.current.handleKeyNavigation(mockEvent, elements);
        });
      }).not.toThrow();

      expect(mockFocus).not.toHaveBeenCalled();
    });
  });

  describe('getAriaLabel function', () => {
    it('should generate aria label for response point', () => {
      const { result } = renderHook(() => useAccessibility());

      const data: ChartElementData = {
        type: 'response-point',
        id: 'point-1',
        percentile: 95,
        value: 250
      };

      const label = result.current.getAriaLabel('response-point', data);

      expect(label).toBe('Response time data point: 95th percentile, 250ms');
    });

    it('should generate aria label for requirement point', () => {
      const { result } = renderHook(() => useAccessibility());

      const data: ChartElementData = {
        type: 'requirement-point',
        id: 'req-1',
        percentile: 90,
        value: 200,
        status: 'PASS'
      };

      const label = result.current.getAriaLabel('requirement-point', data);

      expect(label).toBe('Requirement point: 90th percentile, 200ms, status PASS');
    });

    it('should generate aria label for chart line', () => {
      const { result } = renderHook(() => useAccessibility());

      const data: ChartElementData = {
        type: 'chart-line',
        id: 'line-1'
      };

      const label = result.current.getAriaLabel('chart-line', data);

      expect(label).toBe('chart-line line showing performance data across percentiles');
    });

    it('should generate aria label for legend item', () => {
      const { result } = renderHook(() => useAccessibility());

      const data: ChartElementData = {
        type: 'legend-item',
        id: 'legend-1',
        label: 'Response Times'
      };

      const label = result.current.getAriaLabel('legend-item', data);

      expect(label).toBe('Legend item: Response Times');
    });

    it('should return empty string for unknown type', () => {
      const { result } = renderHook(() => useAccessibility());

      const data: ChartElementData = {
        type: 'unknown' as any,
        id: 'unknown-1'
      };

      const label = result.current.getAriaLabel('unknown', data);

      expect(label).toBe('');
    });
  });

  describe('createAccessibleTable function', () => {
    const responseTimes = {
      min: 10,
      max: 500,
      percentiles: {
        '50': 50,
        '90': 200,
        '95': 300
      }
    };

    const requirements: RequirementData[] = [
      { status: 'PASS', percentile: 50, value: 100, difference: -50, percentageDifference: -50 },
      { status: 'FAIL', percentile: 90, value: 150, difference: 50, percentageDifference: 25 }
    ];

    it('should create accessible table data', () => {
      const { result } = renderHook(() => useAccessibility());

      const tableData = result.current.createAccessibleTable(responseTimes, requirements);

      expect(tableData.headers).toEqual(['Percentile', 'Response Time (ms)', 'Requirement (ms)', 'Status']);
      expect(tableData.rows).toHaveLength(3);
      expect(tableData.rows[0]).toEqual(['50%', '50ms', '100ms', 'PASS']);
      expect(tableData.rows[1]).toEqual(['90%', '200ms', '150ms', 'FAIL']);
      expect(tableData.rows[2]).toEqual(['95%', '300ms', 'N/A', 'N/A']);
    });

    it('should handle missing requirements', () => {
      const { result } = renderHook(() => useAccessibility());

      const tableData = result.current.createAccessibleTable(responseTimes, []);

      expect(tableData.rows).toHaveLength(3);
      expect(tableData.rows[0]).toEqual(['50%', '50ms', 'N/A', 'N/A']);
    });
  });

  describe('edge cases', () => {
    it('should handle cleanup on unmount with pending timeouts', () => {
      const { result, unmount } = renderHook(() => useAccessibility());

      const mockAnnouncementElement = document.createElement('div');
      mockAnnouncementElement.setAttribute = jest.fn();
      result.current.announcementRef.current = mockAnnouncementElement;

      act(() => {
        result.current.announce('Test message');
      });

      unmount();

      // Should not throw when timeout fires after unmount
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }).not.toThrow();
    });

    it('should handle missing speechSynthesis gracefully', () => {
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: undefined
      });

      expect(() => {
        renderHook(() => useAccessibility());
      }).not.toThrow();
    });

    it('should handle matchMedia not supported', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined
      });

      expect(() => {
        renderHook(() => useAccessibility());
      }).toThrow();
    });
  });
});
