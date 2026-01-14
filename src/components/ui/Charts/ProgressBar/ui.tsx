'use client';

import * as S from './style';
import type { ProgressBarProps } from '@/types/chart';

function ProgressBar({
  label,
  value,
  max = 100,
  color = '#3b82f6',
  height = 8,
  className,
  style,
}: ProgressBarProps) {
  const progress = max > 0 ? (value / max) * 100 : 0;

  return (
    <S.ProgressContainer className={className} style={style}>
      {label && (
        <S.ProgressHeader>
          <S.ProgressLabel>{label}</S.ProgressLabel>
        </S.ProgressHeader>
      )}

      <S.ProgressBarContainer height={height}>
        <S.ProgressBarFill progress={progress} color={color} />
      </S.ProgressBarContainer>
    </S.ProgressContainer>
  );
}

export default ProgressBar;