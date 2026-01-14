'use client';

import * as S from './style';
import type { ReactNode } from 'react';

interface ChartGridProps {
  children: ReactNode;
  columns?: number;
  gap?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface ChartGridItemProps {
  children: ReactNode;
  colspan?: number;
  minWidth?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ChartGrid({
  children,
  columns = 2,
  gap = '20px',
  responsive = true,
  className,
  style,
}: ChartGridProps) {
  return (
    <S.GridContainer
      columns={columns}
      gap={gap}
      responsive={responsive}
      className={className}
      style={style}
    >
      {children}
    </S.GridContainer>
  );
}

export function ChartGridItem({
  children,
  colspan = 1,
  minWidth = '300px',
  className,
  style,
}: ChartGridItemProps) {
  return (
    <S.GridItem
      colspan={colspan}
      minWidth={minWidth}
      className={className}
      style={style}
    >
      {children}
    </S.GridItem>
  );
}