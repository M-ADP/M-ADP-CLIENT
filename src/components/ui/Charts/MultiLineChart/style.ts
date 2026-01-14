import styled from '@emotion/styled';
import { background, black } from '@/styles/colors';

export const ChartContainer = styled.div<{
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
}>`
  background-color: ${background.secondary};
  border-radius: 12px;
  padding: 24px;
  width: ${({ width }) => {
    if (typeof width === 'number') return `${width}px`;
    return width || '100%';
  }};
  height: ${({ height }) => {
    if (typeof height === 'number') return `${height}px`;
    return height || '400px';
  }};
  min-width: ${({ minWidth }) => {
    if (typeof minWidth === 'number') return `${minWidth}px`;
    return minWidth || '300px';
  }};
  max-width: ${({ maxWidth }) => {
    if (typeof maxWidth === 'number') return `${maxWidth}px`;
    return maxWidth || '100%';
  }};
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ChartTitle = styled.h3`
  color: ${black[50]};
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${black[75]};
  font-size: 20px;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: ${black[50]};
  }
`;

export const ChartContent = styled.div<{
  aspectRatio?: string;
}>`
  height: ${({ aspectRatio }) => (aspectRatio ? 'auto' : 'calc(100% - 120px)')};
  margin-bottom: 20px;
  width: 100%;
  position: relative;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio || 'auto'};

  /* Ensure chart doesn't overflow */
  canvas {
    max-width: 100% !important;
    height: auto !important;
  }
`;

export const ChartLegend = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LegendDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export const LegendLabel = styled.span`
  color: ${black[75]};
  font-size: 14px;
`;

export const LegendValue = styled.span`
  color: ${black[50]};
  font-size: 14px;
  margin-left: 8px;
`;