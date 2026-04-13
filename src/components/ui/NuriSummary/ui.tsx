import React from 'react';
import * as S from './style';
import { NuriMetric } from '@/types/dashboard';
import ProgressBar from '../Charts/ProgressBar/ui';

interface NuriSummaryProps {
  metrics: NuriMetric[];
}

export const NuriSummary: React.FC<NuriSummaryProps> = ({ metrics }) => {
  return (
    <S.SummaryContainer>
      <S.SummaryHeader>
        <S.SummaryTitle>누리 요약</S.SummaryTitle>
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
