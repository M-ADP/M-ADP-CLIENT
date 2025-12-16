'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import * as S from './style';
import type { ChartData } from '@/types/chart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface MultiLineChartProps {
  title: string;
  data: ChartData;
  legendData?: Array<{
    label: string;
    color: string;
    value: string;
  }>;
  showMenu?: boolean;
  yAxisMax?: number;
  yAxisUnit?: string;
}

export default function MultiLineChart({
  title,
  data,
  legendData,
  showMenu = true,
  yAxisMax = 40,
  yAxisUnit = 'k'
}: MultiLineChartProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return value + yAxisUnit;
          },
          stepSize: 10,
        },
        beginAtZero: true,
        max: yAxisMax,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 2,
      },
    },
  };

  const enhancedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.borderColor,
      pointBorderColor: dataset.borderColor,
      borderWidth: 2,
    })),
  };

  // 범례 데이터가 없으면 데이터셋에서 자동 생성
  const defaultLegendData = data.datasets.map(dataset => ({
    label: dataset.label || '',
    color: dataset.borderColor as string,
    value: '98,733', // 기본값
  }));

  const finalLegendData = legendData || defaultLegendData;

  return (
    <S.ChartContainer>
      <S.ChartHeader>
        <S.ChartTitle>{title}</S.ChartTitle>
        {showMenu && <S.MenuButton>⋯</S.MenuButton>}
      </S.ChartHeader>

      <S.ChartContent>
        <Line data={enhancedData} options={chartOptions} />
      </S.ChartContent>

      <S.ChartLegend>
        {finalLegendData.map((item, index) => (
          <S.LegendItem key={index}>
            <S.LegendDot color={item.color} />
            <S.LegendLabel>{item.label}</S.LegendLabel>
            <S.LegendValue>{item.value}</S.LegendValue>
          </S.LegendItem>
        ))}
      </S.ChartLegend>
    </S.ChartContainer>
  );
}