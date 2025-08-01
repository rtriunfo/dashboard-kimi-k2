export interface ResponseTimeData {
  min: number;
  max: number;
  percentiles: {
    [key: string]: number;
  };
}

export interface RequirementData {
  status: 'PASS' | 'FAIL';
  percentile: number;
  value: number;
  difference: number;
  percentageDifference: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  percentile?: number;
  value?: number;
  status?: 'PASS' | 'FAIL';
}

export interface ChartData {
  responseTimes: ResponseTimeData;
  requirements: RequirementData[];
}

export interface TooltipData {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

export interface ChartInteractionState {
  hoveredElement: string | null;
  focusedElement: string | null;
  tooltip: TooltipData;
  isInteracting: boolean;
}

export interface AccessibleTableData {
  headers: string[];
  rows: string[][];
}

export interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    grid: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: string;
    mono: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

export type ChartElementType = 
  | 'response-point' 
  | 'requirement-point' 
  | 'chart-line' 
  | 'legend-item'
  | 'axis-label'
  | 'grid-line';

export interface ChartElementData {
  type: ChartElementType;
  id: string;
  percentile?: number;
  value?: number;
  status?: 'PASS' | 'FAIL';
  label?: string;
}