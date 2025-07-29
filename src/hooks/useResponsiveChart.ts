import { useState, useEffect, useRef, useCallback } from 'react';

interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface ResponsiveChartConfig {
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const useResponsiveChart = (config: ResponsiveChartConfig = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 800,
    height: 500,
    margin: { top: 40, right: 120, bottom: 60, left: 80 }
  });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Responsive margin calculation
    const isMobile = containerWidth < 640;
    const isTablet = containerWidth >= 640 && containerWidth < 1024;
    
    let margin = { top: 40, right: 40, bottom: 80, left: 40 };
    
    if (isMobile) {
      margin = { top: 20, right: 30, bottom: 60, left: 30 };
    } else if (isTablet) {
      margin = { top: 30, right: 35, bottom: 70, left: 35 };
    }

    // Calculate responsive dimensions
    const {
      aspectRatio = 16 / 10,
      minWidth = 320,
      minHeight = 200,
      maxWidth = 1200,
      maxHeight = 800
    } = config;

    // Use more horizontal space by using almost full container width
    let width = Math.max(minWidth, Math.min(containerWidth - 20, maxWidth));
    let height = Math.max(minHeight, Math.min(width / aspectRatio, maxHeight));

    // Maintain aspect ratio if container height is auto
    if (containerHeight === 0 || !containerHeight) {
      height = width / aspectRatio;
    }

    // Adjust for mobile screens
    if (isMobile) {
      height = Math.min(height, width); // Square aspect ratio on mobile
    }

    setDimensions({
      width,
      height,
      margin
    });
  }, [config]);

  useEffect(() => {
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateDimensions]);

  // Calculate inner dimensions
  const innerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const innerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  return {
    containerRef,
    dimensions,
    innerWidth,
    innerHeight,
    isMobile: dimensions.width < 640,
    isTablet: dimensions.width >= 640 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024,
  };
};
