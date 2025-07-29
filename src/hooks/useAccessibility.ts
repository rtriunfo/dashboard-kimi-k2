import { useState, useEffect, useCallback, useRef } from 'react';
import { ChartData, RequirementData, ChartElementData, AccessibleTableData, ResponseTimeData } from '../types/chart.types';

interface AccessibilityOptions {
  announceDataChanges?: boolean;
  enableKeyboardNavigation?: boolean;
  provideSummary?: boolean;
}

interface AccessibilityState {
  isHighContrast: boolean;
  prefersReducedMotion: boolean;
  screenReaderActive: boolean;
  focusedElement: string | null;
}

export const useAccessibility = (options: AccessibilityOptions = {}) => {
  const {
    announceDataChanges = true,
    enableKeyboardNavigation = true,
    provideSummary = true
  } = options;

  const [state, setState] = useState<AccessibilityState>({
    isHighContrast: false,
    prefersReducedMotion: false,
    screenReaderActive: false,
    focusedElement: null
  });

  const announcementRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<string>('');

  // Detect accessibility preferences
  useEffect(() => {
    const checkAccessibilityPreferences = () => {
      const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Detect screen reader (heuristic approach)
      const screenReaderActive = window.navigator.userAgent.includes('NVDA') ||
                                window.navigator.userAgent.includes('JAWS') ||
                                window.speechSynthesis?.getVoices().length > 0;

      setState(prev => ({
        ...prev,
        isHighContrast,
        prefersReducedMotion,
        screenReaderActive
      }));
    };

    checkAccessibilityPreferences();

    // Listen for changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isHighContrast: e.matches }));
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, prefersReducedMotion: e.matches }));
    };

    contrastQuery.addEventListener('change', handleContrastChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Announce changes to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceDataChanges || !announcementRef.current) return;

    announcementRef.current.setAttribute('aria-live', priority);
    announcementRef.current.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  }, [announceDataChanges]);

  // Generate accessible summary
  const generateSummary = useCallback((data: ChartData) => {
    if (!provideSummary) return '';

    const { responseTimes, requirements } = data;
    
    const responseTimeValues = Object.values(responseTimes.percentiles) as number[];
    const avgResponseTime = responseTimeValues.reduce((a, b) => a + b, 0) / responseTimeValues.length;
    
    const passCount = requirements.filter((req: RequirementData) => req.status === 'PASS').length;
    const totalRequirements = requirements.length;
    
    const summary = `Performance chart showing response times from ${responseTimes.min}ms to ${responseTimes.max}ms. ` +
                   `Average response time is ${Math.round(avgResponseTime)}ms. ` +
                   `${passCount} out of ${totalRequirements} requirements are passing.`;
    
    summaryRef.current = summary;
    return summary;
  }, [provideSummary]);

  // Keyboard navigation handler
  const handleKeyNavigation = useCallback((event: KeyboardEvent, elements: string[]) => {
    if (!enableKeyboardNavigation) return;

    const { key } = event;
    const currentIndex = elements.indexOf(state.focusedElement || '');

    let nextIndex = currentIndex;

    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % elements.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = elements.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setState(prev => ({ ...prev, focusedElement: elements[nextIndex] }));
    
    // Focus the element
    const element = document.querySelector(`[data-chart-element="${elements[nextIndex]}"]`) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, [enableKeyboardNavigation, state.focusedElement]);

  // Generate ARIA labels for chart elements
  const getAriaLabel = useCallback((type: string, data: ChartElementData) => {
    switch (type) {
      case 'response-point':
        return `Response time data point: ${data.percentile}th percentile, ${data.value}ms`;
      case 'requirement-point':
        return `Requirement point: ${data.percentile}th percentile, ${data.value}ms, status ${data.status}`;
      case 'chart-line':
        return `${data.type} line showing performance data across percentiles`;
      case 'legend-item':
        return `Legend item: ${data.label}`;
      default:
        return '';
    }
  }, []);

  // Create accessible table data as fallback
  const createAccessibleTable = useCallback((responseTimes: ResponseTimeData, requirements: RequirementData[]): AccessibleTableData => {
    const percentiles = Object.keys(responseTimes.percentiles);
    
    return {
      headers: ['Percentile', 'Response Time (ms)', 'Requirement (ms)', 'Status'],
      rows: percentiles.map(percentile => {
        const responseTime = responseTimes.percentiles[percentile];
        const requirement = requirements.find((req: RequirementData) => req.percentile.toString() === percentile);
        
        return [
          `${percentile}%`,
          `${responseTime}ms`,
          requirement ? `${requirement.value}ms` : 'N/A',
          requirement ? requirement.status : 'N/A'
        ];
      })
    };
  }, []);

  return {
    state,
    announce,
    generateSummary,
    handleKeyNavigation,
    getAriaLabel,
    createAccessibleTable,
    announcementRef,
    summaryRef: summaryRef.current,
  };
};