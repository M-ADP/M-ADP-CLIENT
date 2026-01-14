import styled from '@emotion/styled';
import { background, black } from '@/styles/colors';

export const ChartContainer = styled.div<{
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
}>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => {
    if (typeof width === 'number') return `${width}px`;
    return width || '100%';
  }};
  height: ${({ height }) => {
    if (typeof height === 'number') return `${height}px`;
    return height || '100%';
  }};
  min-width: ${({ minWidth }) => {
    if (typeof minWidth === 'number') return `${minWidth}px`;
    return minWidth || '0';
  }};
  max-width: ${({ maxWidth }) => {
    if (typeof maxWidth === 'number') return `${maxWidth}px`;
    return maxWidth || '100%';
  }};
  box-sizing: border-box;
  overflow: hidden;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const ChartTitle = styled.h3`
  color: ${black[50]};
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

export const ChartContent = styled.div<{
  $isFixedHeight?: boolean;
  aspectRatio?: string;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  
  ${({ $isFixedHeight, aspectRatio }) => {
    if ($isFixedHeight) {
      return `
        flex: 1;
        min-height: 0;
      `;
    }
    return `
      aspect-ratio: ${aspectRatio || 'auto'};
    `;
  }}

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;