import React, { useMemo, useCallback } from 'react';
import { useResponsiveChart } from '../hooks/useResponsiveChart';
import { useAccessibility } from '../hooks/useAccessibility';
import { useChartInteractions } from '../hooks/useChartInteractions';
import { useTheme } from '../hooks/useTheme';
import { Tooltip } from './ui/Tooltip';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorBoundary, ErrorState } from './ui/ErrorBoundary';
import { ResponseTimeData, RequirementData, ChartPoint } from '../types/chart.types';

interface LineGraphProps {
  responseTimes: ResponseTimeData;
  requirements: RequirementData[];
  width?: number;
  height?: number;
  loading?: boolean;
  error?: Error | null;
  title?: string;
  subtitle?: string;
  className?: string;
}

const LineGraphContent: React.FC<LineGraphProps> = ({
  responseTimes,
  requirements,
  title = 'Percentile Response Times',
  subtitle = '',
  loading = false,
  error = null,
  className = ''
}) => {
  const { theme } = useTheme();
  const { containerRef, dimensions, innerWidth, innerHeight, isMobile } = useResponsiveChart({
    aspectRatio: 16/10,
    minWidth: 500,  // Increased from 320
    minHeight: 280, // Increased from 200
  });

  const accessibility = useAccessibility({
    announceDataChanges: true,
    enableKeyboardNavigation: true,
    provideSummary: true,
  });

  const interactions = useChartInteractions({
    enableTooltips: true,
    enableHover: true,
    enableFocus: true,
    tooltipDelay: 200,
  }, containerRef);


  // Process and memoize chart data
  const chartData = useMemo(() => {
    if (!responseTimes || !requirements) return null;

    // Process response time data
    const responseTimePoints = Object.entries(responseTimes.percentiles).map(([percentile, value]) => ({
      x: parseFloat(percentile),
      y: value,
      percentile: parseFloat(percentile),
      value
    })).sort((a, b) => a.x - b.x);

    // Get unique percentiles for x-axis
    const responsePercentiles = responseTimePoints.map(p => p.x);
    const requirementPercentiles = requirements.map(r => r.percentile);
    const allPercentiles = [...new Set([...responsePercentiles, ...requirementPercentiles])].sort((a, b) => a - b);

    // Process requirements data into stepped points
    const requirementPoints: ChartPoint[] = [];
    const sortedRequirements = [...requirements].sort((a, b) => a.percentile - b.percentile);

    for (let i = 0; i < sortedRequirements.length; i++) {
      const current = sortedRequirements[i];
      const next = sortedRequirements[i + 1];

      requirementPoints.push({
        x: current.percentile,
        y: current.value,
        percentile: current.percentile,
        value: current.value,
        status: current.status
      });

      if (next && next.value !== current.value) {
        requirementPoints.push({
          x: current.percentile,
          y: next.value,
          percentile: current.percentile,
          value: next.value,
          status: current.status
        });
      }
    }

    // Calculate scales
    const allPoints = [...responseTimePoints, ...requirementPoints];
    const yMin = 0;
    const yMax = Math.max(...allPoints.map(p => p.y)) * 1.1;

    // Scale functions
    const xScale = (x: number) => {
      const index = allPercentiles.indexOf(x);
      return (index / (allPercentiles.length - 1)) * innerWidth;
    };
    const yScale = (y: number) => innerHeight - ((y - yMin) / (yMax - yMin)) * innerHeight;

    // Determine overall requirements status
    const allRequirementsPassed = requirements.length > 0 && requirements.every(req => req.status === 'PASS');
    const requirementLineStatus = requirements.length === 0 ? 'none' : (allRequirementsPassed ? 'pass' : 'fail');

    return {
      responseTimePoints,
      requirementPoints,
      allPercentiles,
      yMin,
      yMax,
      xScale,
      yScale,
      sortedRequirements,
      requirementLineStatus
    };
  }, [responseTimes, requirements, innerWidth, innerHeight]);

  // Generate accessible summary
  const accessibleSummary = useMemo(() => {
    if (!chartData) return '';
    return accessibility.generateSummary({ responseTimes, requirements });
  }, [chartData, accessibility, responseTimes, requirements]);


  // Generate chart paths
  const paths = useMemo(() => {
    if (!chartData) return { responsePath: '', requirementPath: '' };

    const { responseTimePoints, requirementPoints, xScale, yScale } = chartData;

    const responsePath = responseTimePoints
      .map((point, index) => {
        const x = xScale(point.x);
        const y = yScale(point.y);
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

    const requirementPath = requirementPoints
      .map((point, index) => {
        const x = xScale(point.x);
        const y = yScale(point.y);
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

    return { responsePath, requirementPath };
  }, [chartData]);

  // Grid lines
  const gridLines = useMemo(() => {
    if (!chartData) return { xGridLines: [], yGridLines: [] };

    const { allPercentiles, yMax } = chartData;
    const xGridLines = allPercentiles;
    const yGridLines = Array.from({ length: 6 }, (_, i) => (yMax / 5) * i);

    return { xGridLines, yGridLines };
  }, [chartData]);

  // Handle retry
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Keyboard navigation elements
  const navigationElements = useMemo(() => {
    if (!chartData) return [];
    const elements: string[] = [];
    
    chartData.responseTimePoints.forEach((_, index) => {
      elements.push(`response-${index}`);
    });
    
    chartData.sortedRequirements.forEach((_, index) => {
      elements.push(`requirement-${index}`);
    });
    
    return elements;
  }, [chartData]);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading performance data..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (!chartData) {
    return <ErrorState message="No chart data available" onRetry={handleRetry} />;
  }

  const { responseTimePoints, sortedRequirements, xScale, yScale } = chartData;
  const { xGridLines, yGridLines } = gridLines;
  const { responsePath, requirementPath } = paths;

  return (
    <div className={`chart-container ${!title ? 'embedded' : ''} ${className}`} ref={containerRef}>
      {/* Accessibility announcements */}
      <div ref={accessibility.announcementRef} className="sr-only" aria-live="polite" />
      
      {/* Header */}
      {title && (
        <div className="chart-header">
          <div>
            <h2 className="chart-title">{title}</h2>
            {subtitle && <p className="chart-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Accessible summary */}
      <div className="sr-only" aria-label="Chart summary">
        {accessibleSummary}
      </div>

      {/* Chart wrapper */}
      <div className="mb-4 chart-wrapper" style={theme.getCSSVariables() as React.CSSProperties}>
        <svg
          className="chart-svg"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-labelledby="chart-title"
          aria-describedby="chart-desc"
          style={{ margin: '0 auto', display: 'block', width: '100%', height: 'auto' }}
        >
          <title id="chart-title">{title}</title>
          <desc id="chart-desc">{accessibleSummary}</desc>
          
          {/* Background */}
          <rect
            width={dimensions.width}
            height={dimensions.height}
            fill="transparent"
            className="transition-colors duration-200"
          />
          
          {/* Grid lines */}
          <g className="opacity-60" aria-hidden="true">
            {/* Vertical grid lines */}
            {xGridLines.map(x => (
              <line
                key={`vgrid-${x}`}
                x1={dimensions.margin.left + xScale(x)}
                y1={dimensions.margin.top}
                x2={dimensions.margin.left + xScale(x)}
                y2={dimensions.margin.top + innerHeight}
                className="chart-grid-line"
              />
            ))}
            
            {/* Horizontal grid lines */}
            {yGridLines.map((y, i) => (
              <line
                key={`hgrid-${i}`}
                x1={dimensions.margin.left}
                y1={dimensions.margin.top + yScale(y)}
                x2={dimensions.margin.left + innerWidth}
                y2={dimensions.margin.top + yScale(y)}
                className="chart-grid-line"
              />
            ))}
          </g>

          {/* Axes */}
          <g aria-hidden="true">
            {/* X-axis */}
            <line
              x1={dimensions.margin.left}
              y1={dimensions.margin.top + innerHeight}
              x2={dimensions.margin.left + innerWidth}
              y2={dimensions.margin.top + innerHeight}
              className="chart-axis"
            />
            
            {/* Y-axis */}
            <line
              x1={dimensions.margin.left}
              y1={dimensions.margin.top}
              x2={dimensions.margin.left}
              y2={dimensions.margin.top + innerHeight}
              className="chart-axis"
            />
          </g>

          {/* X-axis labels */}
          <g>
            {xGridLines.map(x => (
              <text
                key={`xlabel-${x}`}
                x={dimensions.margin.left + xScale(x)}
                y={dimensions.margin.top + innerHeight + (isMobile ? 18 : 22)}
                textAnchor="middle"
                className="chart-axis-label"
                fontSize={isMobile ? '12' : '14'}
                fill="currentColor"
                fontWeight="500"
                dominantBaseline="hanging"
              >
                {x}%
              </text>
            ))}
            
            {/* X-axis title */}
            <text
              x={dimensions.margin.left + innerWidth / 2}
              y={dimensions.margin.top + innerHeight + (isMobile ? 50 : 65)}
              textAnchor="middle"
              className="chart-axis-title"
              fontSize={isMobile ? '13' : '15'}
              fill="currentColor"
              fontWeight="600"
              dominantBaseline="middle"
            >
              Percentile
            </text>
          </g>

          {/* Y-axis labels */}
          <g>
            {yGridLines.map((y, i) => (
              <text
                key={`ylabel-${i}`}
                x={dimensions.margin.left - (isMobile ? 8 : 15)}
                y={dimensions.margin.top + yScale(y) + 4}
                textAnchor="end"
                className="chart-axis-label"
                fontSize={isMobile ? '10' : '12'}
                fill="currentColor"
              >
                {Math.round(y)}
              </text>
            ))}
            
            {/* Y-axis title */}
            <text
              x={isMobile ? 15 : 25}
              y={dimensions.margin.top + innerHeight / 2}
              textAnchor="middle"
              className="chart-axis-title"
              transform={`rotate(-90, ${isMobile ?5 : 5}, ${dimensions.margin.top + innerHeight / 2})`}
              fontSize={isMobile ? '11' : '13'}
              fill="currentColor"
            >
            
            </text>
          </g>

          {/* Chart content group */}
          <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
            {/* Response time line */}
            <path
              d={responsePath}
              className="chart-line-response"
              aria-label="Response time line"
            />
            
            {/* Response time points */}
            {responseTimePoints.map((point, index) => (
              <circle
                key={`response-${index}`}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                {...interactions.getInteractionProps(
                  `response-${index}`,
                  point,
                  navigationElements
                )}
                className="chart-point-response"
              />
            ))}

            {/* Requirements line */}
            {requirements && requirements.length > 0 && (
              <path
                d={requirementPath}
                className={`chart-line-requirement ${chartData?.requirementLineStatus}`}
                aria-label="Requirements line"
              />
            )}
            
            {/* Requirement points */}
            {sortedRequirements.map((req, index) => (
              <circle
                key={`req-${index}`}
                cx={xScale(req.percentile)}
                cy={yScale(req.value)}
                {...interactions.getInteractionProps(
                  `requirement-${index}`,
                  { x: req.percentile, y: req.value, percentile: req.percentile, value: req.value, status: req.status },
                  navigationElements
                )}
                className={`chart-point-requirement ${req.status.toLowerCase()}`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      <Tooltip
        x={interactions.state.tooltip.x}
        y={interactions.state.tooltip.y}
        content={interactions.state.tooltip.content}
        visible={interactions.state.tooltip.visible}
        containerRef={containerRef}
      />

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="flex items-center gap-2">
            <div className="legend-line bg-blue-500" />
            <div className="legend-point bg-blue-500" />
          </div>
          <span>Response Times</span>
        </div>
        
        {/* Only show requirements legend items if requirements exist */}
        {requirements && requirements.length > 0 && (
          <>
            <div className="legend-item">
              <div className="flex items-center gap-2">
                <div className={`legend-line ${
                  chartData?.requirementLineStatus === 'pass' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`} />
                <div className={`legend-point ${
                  chartData?.requirementLineStatus === 'pass' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`} />
              </div>
              <span>Requirements</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="legend-item">
                <div className="legend-point bg-green-500" />
                <span className="text-xs">PASS</span>
              </div>
              <div className="legend-item">
                <div className="legend-point bg-red-500" />
                <span className="text-xs">FAIL</span>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

const LineGraph: React.FC<LineGraphProps> = (props) => {
  return (
    <ErrorBoundary>
      <LineGraphContent {...props} />
    </ErrorBoundary>
  );
};

export default LineGraph;
