import type { CSSProperties } from 'react';

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartProps {
  data?: ChartData;
  title?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  className?: string;
  showLegend?: boolean;
}

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  unit?: string;
  className?: string;
  style?: CSSProperties;
}