'use client';

import * as S from './style';
import type { CSSProperties } from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  unit?: string;
  className?: string;
  style?: CSSProperties;
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  color = '#3b82f6',
  unit = '%',
  className,
  style,
}: ProgressBarProps) {
  const progress = (value / max) * 100;

  return (
    <S.ProgressContainer className={className} style={style}>
      <S.ProgressHeader>
        <S.ProgressLabel>{label}</S.ProgressLabel>
      </S.ProgressHeader>

      <S.ProgressValue>
        {Math.round(value)}{unit}
      </S.ProgressValue>

      <S.ProgressBarContainer>
        <S.ProgressBarFill progress={progress} color={color} />
      </S.ProgressBarContainer>
    </S.ProgressContainer>
  );
}