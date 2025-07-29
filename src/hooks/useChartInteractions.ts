import { useState, useCallback, useRef, useEffect } from 'react';
import { ChartInteractionState, TooltipData, ChartPoint } from '../types/chart.types';

interface UseChartInteractionsOptions {
  enableTooltips?: boolean;
  enableHover?: boolean;
  enableFocus?: boolean;
  tooltipDelay?: number;
}

export const useChartInteractions = (options: UseChartInteractionsOptions = {}) => {
  const {
    enableTooltips = true,
    enableHover = true,
    enableFocus = true,
    tooltipDelay = 300
  } = options;

  const [state, setState] = useState<ChartInteractionState>({
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

  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const interactionRef = useRef<HTMLDivElement>(null);

  // Handle mouse enter on chart elements
  const handleMouseEnter = useCallback((
    elementId: string,
    point: ChartPoint,
    event: React.MouseEvent
  ) => {
    if (!enableHover) return;

    setState(prev => ({
      ...prev,
      hoveredElement: elementId,
      isInteracting: true
    }));

    if (enableTooltips) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const tooltipContent = generateTooltipContent(point);

      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      tooltipTimeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          tooltip: {
            x: rect.left + rect.width / 2,
            y: rect.top,
            content: tooltipContent,
            visible: true
          }
        }));
      }, tooltipDelay);
    }
  }, [enableHover, enableTooltips, tooltipDelay]);

  // Handle mouse leave on chart elements
  const handleMouseLeave = useCallback(() => {
    if (!enableHover) return;

    setState(prev => ({
      ...prev,
      hoveredElement: null,
      isInteracting: false,
      tooltip: {
        ...prev.tooltip,
        visible: false
      }
    }));

    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  }, [enableHover]);

  // Handle focus on chart elements
  const handleFocus = useCallback((
    elementId: string,
    point: ChartPoint,
    event: React.FocusEvent
  ) => {
    if (!enableFocus) return;

    setState(prev => ({
      ...prev,
      focusedElement: elementId,
      isInteracting: true
    }));

    if (enableTooltips) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const tooltipContent = generateTooltipContent(point);

      setState(prev => ({
        ...prev,
        tooltip: {
          x: rect.left + rect.width / 2,
          y: rect.top,
          content: tooltipContent,
          visible: true
        }
      }));
    }
  }, [enableFocus, enableTooltips]);

  // Handle blur on chart elements
  const handleBlur = useCallback(() => {
    if (!enableFocus) return;

    setState(prev => ({
      ...prev,
      focusedElement: null,
      isInteracting: false,
      tooltip: {
        ...prev.tooltip,
        visible: false
      }
    }));
  }, [enableFocus]);

  // Generate tooltip content based on point data
  const generateTooltipContent = useCallback((point: ChartPoint): string => {
    if (point.status) {
      // Requirement point
      return `Percentile: ${point.percentile}%\nRequirement: ${point.value}ms\nStatus: ${point.status}`;
    } else {
      // Response time point
      return `Percentile: ${point.percentile}%\nResponse Time: ${point.value}ms`;
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    elementId: string,
    allElements: string[]
  ) => {
    const currentIndex = allElements.indexOf(elementId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % allElements.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex <= 0 ? allElements.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = allElements.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Trigger click or selection action
        break;
      default:
        return;
    }

    // Focus next element
    const nextElement = document.querySelector(
      `[data-chart-element="${allElements[nextIndex]}"]`
    ) as HTMLElement;
    
    if (nextElement) {
      nextElement.focus();
    }
  }, []);

  // Update tooltip position on scroll/resize
  useEffect(() => {
    const updateTooltipPosition = () => {
      if (!state.tooltip.visible || !state.hoveredElement) return;

      const element = document.querySelector(
        `[data-chart-element="${state.hoveredElement}"]`
      ) as HTMLElement;

      if (element) {
        const rect = element.getBoundingClientRect();
        setState(prev => ({
          ...prev,
          tooltip: {
            ...prev.tooltip,
            x: rect.left + rect.width / 2,
            y: rect.top
          }
        }));
      }
    };

    window.addEventListener('scroll', updateTooltipPosition);
    window.addEventListener('resize', updateTooltipPosition);

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [state.tooltip.visible, state.hoveredElement]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Get interaction props for chart elements
  const getInteractionProps = useCallback((
    elementId: string,
    point: ChartPoint,
    allElements: string[] = []
  ) => {
    const isHovered = state.hoveredElement === elementId;
    const isFocused = state.focusedElement === elementId;

    return {
      'data-chart-element': elementId,
      tabIndex: 0,
      role: 'button',
      'aria-label': generateTooltipContent(point),
      className: `chart-interactive ${isHovered ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`,
      onMouseEnter: (event: React.MouseEvent) => handleMouseEnter(elementId, point, event),
      onMouseLeave: handleMouseLeave,
      onFocus: (event: React.FocusEvent) => handleFocus(elementId, point, event),
      onBlur: handleBlur,
      onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(event, elementId, allElements),
    };
  }, [
    state.hoveredElement,
    state.focusedElement,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleKeyDown,
    generateTooltipContent
  ]);

  return {
    state,
    interactionRef,
    getInteractionProps,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleKeyDown,
  };
};