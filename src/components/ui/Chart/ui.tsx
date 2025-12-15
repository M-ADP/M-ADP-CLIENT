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
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import * as S from './style';
import type { ChartProps } from '@/types/chart';

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

interface LineChartProps extends ChartProps {
  type: 'line';
}

interface DoughnutChartProps extends ChartProps {
  type: 'doughnut';
}

interface BarChartProps extends ChartProps {
  type: 'bar';
}

type ChartComponentProps = LineChartProps | DoughnutChartProps | BarChartProps;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
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
  elements: {
    point: { radius: 4, hoverRadius: 6 },
  },
};

export default function Chart({
  type,
  data,
  title,
  width,
  height,
  style,
  className,
}: ChartComponentProps) {
  const renderChart = () => {
    if (!data) return null;

    switch (type) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <S.ChartContainer width={width} height={height} style={style} className={className}>
      {title && (
        <S.ChartHeader>
          <S.ChartTitle>{title}</S.ChartTitle>
        </S.ChartHeader>
      )}
      <S.ChartContent height={title ? undefined : height}>
        {renderChart()}
      </S.ChartContent>
    </S.ChartContainer>
  );
}