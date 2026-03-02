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
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as S from './style';
import { MultiLineChartProps } from '@/types/chart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

function MultiLineChart({
  title,
  data,
  legendData,
  showMenu = true,
  startDate = '2025-01-01',
  endDate = '2025-01-02',
  onStartDateChange,
  onEndDateChange,
  yAxisMax = 40,
  yAxisUnit = 'k',
  width,
  height,
  minWidth,
  maxWidth,
  aspectRatio,
  className,
  style,
}: MultiLineChartProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

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
          maxRotation: 0,
          minRotation: 0,
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
          callback: function (value: number | string) {
            return value + yAxisUnit;
          },
          stepSize: 10,
          padding: 10,
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

  const defaultLegendData = data.datasets.map(dataset => ({
    label: dataset.label || '',
    color: dataset.borderColor as string,
    value: '98,733',
  }));

  const finalLegendData = legendData || defaultLegendData;

  return (
    <S.ChartContainer
      width={width}
      height={height}
      minWidth={minWidth}
      maxWidth={maxWidth}
      className={className}
      style={style}
    >
      <S.ChartHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <S.ChartTitle>{title}</S.ChartTitle>
          <S.ChartLegend>
            {finalLegendData.map((item, index) => (
              <S.LegendItem key={index}>
                <S.LegendDot color={item.color} />
                <S.LegendLabel>{item.label}</S.LegendLabel>
                <S.LegendValue>{item.value}</S.LegendValue>
              </S.LegendItem>
            ))}
          </S.ChartLegend>
        </div>
        <S.HeaderRight style={{ alignSelf: 'flex-start', position: 'relative' }}>
          <S.DateRange onClick={() => setShowDatePicker(!showDatePicker)}>
            {startDate.replace(/-/g, '.')} ~ {endDate.replace(/-/g, '.')} ▼
          </S.DateRange>
          {showDatePicker && (
            <S.DatePickerPopup>
              <S.DateInput
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange?.(e.target.value)}
              />
              <span>~</span>
              <S.DateInput
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange?.(e.target.value)}
              />
            </S.DatePickerPopup>
          )}
          {showMenu && <S.MenuButton>⋯</S.MenuButton>}
        </S.HeaderRight>
      </S.ChartHeader>

      <S.ChartContent aspectRatio={aspectRatio}>
        <Line data={enhancedData} options={chartOptions} />
      </S.ChartContent>
    </S.ChartContainer>
  );
}

export default MultiLineChart;