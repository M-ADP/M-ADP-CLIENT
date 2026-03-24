'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartType,
  ChartData,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartComponentProps } from '@/types/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const commonOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
};

const cartesianOptions: ChartOptions = {
  ...commonOptions,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#9ca3af', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(156, 163, 175, 0.1)' },
      ticks: { color: '#9ca3af', font: { size: 11 } },
      beginAtZero: true,
    },
  },
};

const getBaseOptions = (type: ChartType): ChartOptions => {
  if (type === 'doughnut') {
    return {
      ...commonOptions,
      layout: { padding: 0 },
    };
  }

  const base = { ...cartesianOptions };
  if (type === 'line') {
    return {
      ...base,
      elements: {
        point: { radius: 4, hoverRadius: 6 },
      },
    };
  }
  return base;
};

export default function ChartRenderer(props: ChartComponentProps) {
  const { type, data, options } = props;

  if (!data) return null;

  const baseOptions = getBaseOptions(type);

  const mergedOptions = {
    ...baseOptions,
    ...options,
    plugins: {
      ...baseOptions.plugins,
      ...options?.plugins,
    },
    scales: {
      ...baseOptions.scales,
      ...options?.scales,
    },
    elements: {
      ...baseOptions.elements,
      ...options?.elements,
    },
    layout: {
      ...baseOptions.layout,
      ...options?.layout,
    }
  } as ChartOptions<typeof type>;

  return <Chart type={type} data={data as ChartData<typeof type>} options={mergedOptions} />;
}
