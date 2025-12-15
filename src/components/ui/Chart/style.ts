import styled from '@emotion/styled';
import { background } from '@/styles/colors';

export const ChartContainer = styled.div<{ width?: number | string; height?: number | string }>`
  background-color: ${background.secondary};
  border-radius: 12px;
  padding: 24px;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || 'auto')};
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const ChartTitle = styled.h3`
  color: white;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

export const ChartContent = styled.div<{ height?: number | string }>`
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '300px')};
`;