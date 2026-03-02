'use client';

import React, { useMemo, useState } from 'react';
import * as S from './style';
import { WelcomeHero } from '@/components/ui/WelcomeHero/ui';
import { NuriSummary } from '@/components/ui/NuriSummary/ui';
import { ResourceAllocation } from '@/components/ui/ResourceAllocation/ui';
import MultiLineChart from '@/components/ui/Charts/MultiLineChart/ui';
import { mockDashboardData, mockChartData } from './data';

export default function DashboardContainer() {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-02');

  const chartData = useMemo(() => {
    const baseData = mockChartData;

    if (startDate === endDate) {
      return baseData;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) diffDays = 1;
    const labels: string[] = [];

    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      labels.push(`${mm}.${dd}`);
    }

    const seed = startDate.charCodeAt(startDate.length - 1) + endDate.charCodeAt(endDate.length - 1);

    return {
      ...baseData,
      labels,
      datasets: baseData.datasets.map((dataset, dsIndex) => ({
        ...dataset,
        data: labels.map((_, i) => {
          const baseVal = (dataset.data[i % dataset.data.length] as number) || 200;
          const change = ((seed + i + dsIndex) % 40) - 20;
          return Math.max(0, baseVal + change * 5);
        })
      }))
    };
  }, [startDate, endDate]);

  const legendData = useMemo(() => [
    { label: 'CPU', color: '#95E8FF', value: '' },
    { label: 'MEM', color: '#030982', value: '' }
  ], []);

  return (
    <S.DashboardLayout>

      <S.TopSection>
        <WelcomeHero userName={mockDashboardData.userName} />
        <NuriSummary metrics={mockDashboardData.nuriSummary} />
      </S.TopSection>

      <S.BottomSection>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiLineChart
            title="최애의 사인"
            data={chartData}
            legendData={legendData}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            yAxisMax={600}
            yAxisUnit=""
          />
        </div>
        <ResourceAllocation projects={mockDashboardData.projectResources} />
      </S.BottomSection>

    </S.DashboardLayout>
  );
}
