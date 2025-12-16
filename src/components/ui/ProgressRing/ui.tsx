'use client';

import * as S from './style';
import type { ProgressRingProps } from '@/types/chart';

export default function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#22c55e',
  backgroundColor = '#374151',
  label,
  unit = '%',
  className,
  style,
}: ProgressRingProps) {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <S.ProgressContainer className={className} style={style}>
      <S.ProgressSvg size={size}>
        <S.ProgressCircle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0}
        />
        <S.ProgressCircle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </S.ProgressSvg>

      <S.ProgressLabel>
        <S.ProgressValue>
          {label || `${Math.round(value)}`}
        </S.ProgressValue>
        <S.ProgressUnit>{unit}</S.ProgressUnit>
      </S.ProgressLabel>
    </S.ProgressContainer>
  );
}