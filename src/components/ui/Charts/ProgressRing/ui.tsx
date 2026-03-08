'use client';

import { useId } from 'react';
import * as S from './style';
import type { ProgressRingProps } from '@/types/chart';

function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#22c55e',
  gradientStops,
  backgroundColor = '#374151',
  label,
  unit = '%',
  className,
  style,
}: ProgressRingProps) {
  const ringId = useId().replace(/:/g, '');
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = Math.max(0, Math.min(value / max, 1));
  const strokeDashoffset = circumference * (1 - progress);
  const gradientDefId = `progress-ring-gradient-${ringId}`;
  const strokeColor = gradientStops && gradientStops.length > 0 ? `url(#${gradientDefId})` : color;

  return (
    <S.ProgressContainer className={className} style={style}>
      <S.ProgressSvg size={size}>
        {gradientStops && gradientStops.length > 0 && (
          <defs>
            <linearGradient id={gradientDefId} x1="0%" y1="50%" x2="100%" y2="50%">
              {gradientStops.map((stop) => (
                <stop
                  key={`${stop.offset}-${stop.color}`}
                  offset={`${Math.max(0, Math.min(100, stop.offset))}%`}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity ?? 1}
                />
              ))}
            </linearGradient>
          </defs>
        )}
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
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </S.ProgressSvg>

      <S.ProgressLabel>
        <S.ProgressValue>
          {label || `${Math.min(max, Math.max(0, Math.round(value)))}`}
        </S.ProgressValue>
        <S.ProgressUnit>{unit}</S.ProgressUnit>
      </S.ProgressLabel>
    </S.ProgressContainer>
  );
}

export default ProgressRing;
