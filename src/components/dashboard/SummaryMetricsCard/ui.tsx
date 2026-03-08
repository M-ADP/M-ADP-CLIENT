import React from 'react';
import * as S from './style';
import { SummaryMetric } from '@/types/dashboard';
import ProgressBar from '@/components/ui/Charts/ProgressBar/ui';

interface SummaryMetricsCardProps {
  title: string;
  metrics: SummaryMetric[];
}

export const SummaryMetricsCard: React.FC<SummaryMetricsCardProps> = ({ title, metrics }) => {
  return (
    <S.SummaryContainer>
      <S.SummaryHeader>
        <S.SummaryTitle>{title}</S.SummaryTitle>
        <S.MenuButton>⋯</S.MenuButton>
      </S.SummaryHeader>

      <S.GridContainer>
        {metrics.map((metric) => (
          <S.MetricCard key={metric.id}>
            <S.LabelGroup>
              <S.MetricLabel>{metric.label}</S.MetricLabel>
              <S.MetricValue>{metric.value}</S.MetricValue>
            </S.LabelGroup>

            <S.ProgressBarWrapper>
              <ProgressBar
                value={metric.percentage}
                max={100}
                height={4}
              />
            </S.ProgressBarWrapper>
          </S.MetricCard>
        ))}
      </S.GridContainer>
    </S.SummaryContainer>
  );
};
