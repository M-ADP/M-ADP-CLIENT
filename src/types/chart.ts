import type { CSSProperties } from 'react';
import type { ChartData as ChartJSData, ChartOptions, ChartType, ChartData } from 'chart.js';

export type { ChartData };

export interface ChartProps {
  data?: ChartJSData;
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

export interface ProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  color?: string;
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export interface MultiLineChartProps {
  title: string;
  data: ChartData<'line'>;
  legendData?: Array<{
    label: string;
    color: string;
    value: string;
  }>;
  showMenu?: boolean;
  yAxisMax?: number;
  yAxisUnit?: string;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
}

export interface BaseChartProps<T extends ChartType> extends Omit<ChartProps, 'data'> {
  minWidth?: number | string;
  maxWidth?: number | string;
  aspectRatio?: string;
  options?: ChartOptions<T>;
}

export interface LineChartProps extends BaseChartProps<'line'> {
  type: 'line';
  data: ChartData<'line'>;
}

export interface DoughnutChartProps extends BaseChartProps<'doughnut'> {
  type: 'doughnut';
  data: ChartData<'doughnut'>;
}

export interface BarChartProps extends BaseChartProps<'bar'> {
  type: 'bar';
  data: ChartData<'bar'>;
}

export type ChartComponentProps = LineChartProps | DoughnutChartProps | BarChartProps;