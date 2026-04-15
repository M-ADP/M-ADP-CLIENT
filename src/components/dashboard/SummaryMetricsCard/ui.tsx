import * as S from './style';
import { SummaryMetric } from '@/types/dashboard';
import ProgressBar from '@/components/ui/Charts/ProgressBar/ui';

interface SummaryMetricsCardProps {
  title: string;
  metrics: SummaryMetric[];
}

export const SummaryMetricsCard = ({ title, metrics }: SummaryMetricsCardProps) => {
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
              {metric.comingSoon ? (
                <S.ComingSoonText>{metric.helperText || '추후 추가 예정'}</S.ComingSoonText>
              ) : null}
            </S.LabelGroup>

            <S.ProgressBarWrapper>
              {metric.comingSoon ? (
                <S.ComingSoonBar aria-hidden />
              ) : (
                <ProgressBar
                  value={metric.percentage}
                  max={100}
                  height={4}
                />
              )}
            </S.ProgressBarWrapper>
          </S.MetricCard>
        ))}
      </S.GridContainer>
    </S.SummaryContainer>
  );
};
