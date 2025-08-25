import { renderHook, act } from '@testing-library/react';
import { useChartInteractions } from './useChartInteractions';
import { ChartPoint } from '../types/chart.types';

// Mock timers
jest.useFakeTimers();

// Mock DOM methods
const mockGetBoundingClientRect = jest.fn();
const mockQuerySelector = jest.fn();
const mockFocus = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Setup DOM mocks
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    value: mockGetBoundingClientRect,
    writable: true
  });
  
  Object.defineProperty(document, 'querySelector', {
    value: mockQuerySelector,
    writable: true
  });

  Object.defineProperty(window, 'addEventListener', {
    value: mockAddEventListener,
    writable: true
  });

  Object.defineProperty(window, 'removeEventListener', {
    value: mockRemoveEventListener,
    writable: true
  });
});

describe('useChartInteractions', () => {
  let containerRef: React.RefObject<HTMLElement>;
  let mockContainer: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    
    // Create mock container
    mockContainer = document.createElement('div');
    containerRef = { current: mockContainer };
    
    // Setup default mock returns
    mockGetBoundingClientRect.mockReturnValue({
      left: 100,
      top: 50,
      width: 200,
      height: 100,
      right: 300,
      bottom: 150
    });

    const mockElement = document.createElement('div');
    mockElement.focus = mockFocus;
    mockQuerySelector.mockReturnValue(mockElement);
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      expect(result.current.state).toEqual({
        hoveredElement: null,
        focusedElement: null,
        tooltip: {
          x: 0,
          y: 0,
          content: '',
          visible: false
        },
        isInteracting: false
      });
    });

    it('should accept custom options', () => {
      const options = {
        enableTooltips: false,
        enableHover: false,
        enableFocus: false,
        tooltipDelay: 500
      };

      const { result } = renderHook(() => 
        useChartInteractions(options, containerRef)
      );

      // State should still initialize the same way
      expect(result.current.state.tooltip.visible).toBe(false);
    });
  });

  describe('mouse interactions', () => {
    const mockPoint: ChartPoint = {
      x: 50,
      y: 100,
      percentile: 95,
      value: 250
    };

    it('should handle mouse enter with hover enabled', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableHover: true }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.hoveredElement).toBe('element-1');
      expect(result.current.state.isInteracting).toBe(true);
    });

    it('should not handle mouse enter when hover disabled', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableHover: false }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.hoveredElement).toBe(null);
      expect(result.current.state.isInteracting).toBe(false);
    });

    it('should show tooltip after delay on mouse enter', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ 
          enableHover: true, 
          enableTooltips: true, 
          tooltipDelay: 300 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      // Tooltip should not be visible immediately
      expect(result.current.state.tooltip.visible).toBe(false);

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.state.tooltip.visible).toBe(true);
      expect(result.current.state.tooltip.content).toContain('Percentile: 95%');
      expect(result.current.state.tooltip.content).toContain('Response Time: 250ms');
    });

    it('should handle mouse leave', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableHover: true }, containerRef)
      );

      // First set up hovered state
      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.hoveredElement).toBe('element-1');

      // Then test mouse leave
      act(() => {
        result.current.handleMouseLeave();
      });

      expect(result.current.state.hoveredElement).toBe(null);
      expect(result.current.state.isInteracting).toBe(false);
      expect(result.current.state.tooltip.visible).toBe(false);
    });

    it('should not handle mouse leave when hover disabled', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableHover: false }, containerRef)
      );

      act(() => {
        result.current.handleMouseLeave();
      });

      // Should not change state when hover is disabled
      expect(result.current.state.hoveredElement).toBe(null);
    });

    it('should clear tooltip timeout on mouse leave', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ 
          enableHover: true, 
          enableTooltips: true, 
          tooltipDelay: 300 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      act(() => {
        result.current.handleMouseLeave();
      });

      // Advance time to see if tooltip would have appeared
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.state.tooltip.visible).toBe(false);
    });
  });

  describe('focus interactions', () => {
    const mockPoint: ChartPoint = {
      x: 50,
      y: 100,
      percentile: 99,
      value: 500,
      status: 'PASS'
    };

    it('should handle focus with focus enabled', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableFocus: true }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.FocusEvent;

      act(() => {
        result.current.handleFocus('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.focusedElement).toBe('element-1');
      expect(result.current.state.isInteracting).toBe(true);
    });

    it('should not handle focus when focus disabled', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableFocus: false }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.FocusEvent;

      act(() => {
        result.current.handleFocus('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.focusedElement).toBe(null);
      expect(result.current.state.isInteracting).toBe(false);
    });

    it('should show tooltip immediately on focus', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ 
          enableFocus: true, 
          enableTooltips: true 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.FocusEvent;

      act(() => {
        result.current.handleFocus('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.tooltip.visible).toBe(true);
      expect(result.current.state.tooltip.content).toContain('Percentile: 99%');
      expect(result.current.state.tooltip.content).toContain('Requirement: 500ms');
      expect(result.current.state.tooltip.content).toContain('Status: PASS');
    });

    it('should handle blur', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableFocus: true }, containerRef)
      );

      // First set up focused state
      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.FocusEvent;

      act(() => {
        result.current.handleFocus('element-1', mockPoint, mockEvent);
      });

      expect(result.current.state.focusedElement).toBe('element-1');

      // Then test blur
      act(() => {
        result.current.handleBlur();
      });

      expect(result.current.state.focusedElement).toBe(null);
      expect(result.current.state.isInteracting).toBe(false);
      expect(result.current.state.tooltip.visible).toBe(false);
    });

    it('should not handle blur when focus disabled', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ enableFocus: false }, containerRef)
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(result.current.state.focusedElement).toBe(null);
    });
  });

  describe('keyboard navigation', () => {
    const allElements = ['element-1', 'element-2', 'element-3'];

    it('should navigate right with ArrowRight', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-1', allElements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-2"]');
      expect(mockFocus).toHaveBeenCalled();
    });

    it('should navigate left with ArrowLeft', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'ArrowLeft',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-2', allElements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-1"]');
      expect(mockFocus).toHaveBeenCalled();
    });

    it('should wrap around when navigating past end', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-3', allElements);
      });

      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-1"]');
    });

    it('should wrap around when navigating past beginning', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'ArrowLeft',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-1', allElements);
      });

      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-3"]');
    });

    it('should navigate to first element with Home', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'Home',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-2', allElements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-1"]');
    });

    it('should navigate to last element with End', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'End',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-1', allElements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-chart-element="element-3"]');
    });

    it('should handle Enter and Space keys', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-1', allElements);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not handle unrecognized keys', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'Tab',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-1', allElements);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockQuerySelector).not.toHaveBeenCalled();
    });

    it('should handle missing element gracefully', () => {
      mockQuerySelector.mockReturnValue(null);

      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'element-1', allElements);
      });

      expect(mockFocus).not.toHaveBeenCalled();
    });
  });

  describe('tooltip positioning', () => {
    it('should calculate tooltip position relative to container', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ 
          enableHover: true, 
          enableTooltips: true, 
          tooltipDelay: 0 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      // Mock container rect
      mockContainer.getBoundingClientRect = jest.fn().mockReturnValue({
        left: 50,
        top: 25,
        width: 400,
        height: 300
      });

      act(() => {
        result.current.handleMouseEnter('element-1', { x: 0, y: 0, percentile: 50, value: 100 }, mockEvent);
      });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current.state.tooltip.x).toBe(150); // (100 + 200/2) - 50
      expect(result.current.state.tooltip.y).toBe(25);  // 50 - 25
    });

    it('should handle missing container gracefully', () => {
      containerRef.current = null;

      const { result } = renderHook(() => 
        useChartInteractions({ 
          enableHover: true, 
          enableTooltips: true, 
          tooltipDelay: 0 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', { x: 0, y: 0, percentile: 50, value: 100 }, mockEvent);
      });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current.state.tooltip.x).toBe(200); // 100 + 200/2 - 0
      expect(result.current.state.tooltip.y).toBe(50);  // 50 - 0
    });
  });

  describe('getInteractionProps', () => {
    const mockPoint: ChartPoint = {
      x: 50,
      y: 100,
      percentile: 95,
      value: 250
    };

    it('should return correct interaction props', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      const props = result.current.getInteractionProps('element-1', mockPoint, ['element-1', 'element-2']);

      expect(props).toMatchObject({
        'data-chart-element': 'element-1',
        tabIndex: 0,
        role: 'button',
        'aria-label': 'Percentile: 95%\nResponse Time: 250ms',
        className: 'chart-interactive  '
      });

      expect(typeof props.onMouseEnter).toBe('function');
      expect(typeof props.onMouseLeave).toBe('function');
      expect(typeof props.onFocus).toBe('function');
      expect(typeof props.onBlur).toBe('function');
      expect(typeof props.onKeyDown).toBe('function');
    });

    it('should include hover and focus classes when active', () => {
      const { result } = renderHook(() => 
        useChartInteractions({}, containerRef)
      );

      // Set up hovered state
      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      const props = result.current.getInteractionProps('element-1', mockPoint);
      expect(props.className).toContain('hovered');
    });
  });

  describe('event listeners', () => {
    it('should add scroll and resize event listeners', () => {
      renderHook(() => useChartInteractions({}, containerRef));

      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should remove event listeners on unmount', () => {
      const { unmount } = renderHook(() => useChartInteractions({}, containerRef));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('edge cases', () => {
    it('should handle tooltip timeout cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => 
        useChartInteractions({ 
          enableHover: true, 
          enableTooltips: true, 
          tooltipDelay: 300 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      act(() => {
        result.current.handleMouseEnter('element-1', { x: 0, y: 0 }, mockEvent);
      });

      unmount();

      // Should not throw or cause issues
      act(() => {
        jest.advanceTimersByTime(300);
      });
    });

    it('should handle multiple rapid mouse enters', () => {
      const { result } = renderHook(() => 
        useChartInteractions({ 
          enableHover: true, 
          enableTooltips: true, 
          tooltipDelay: 300 
        }, containerRef)
      );

      const mockEvent = {
        currentTarget: document.createElement('div')
      } as React.MouseEvent;

      const mockPoint = { x: 0, y: 0, percentile: 50, value: 100 };

      act(() => {
        result.current.handleMouseEnter('element-1', mockPoint, mockEvent);
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.handleMouseEnter('element-2', mockPoint, mockEvent);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.state.hoveredElement).toBe('element-2');
      expect(result.current.state.tooltip.visible).toBe(true);
    });
  });
});
