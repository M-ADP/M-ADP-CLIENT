import styled from '@emotion/styled';
import { black } from '@/styles/colors';

export const ChartContainer = styled.div<{
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
}>`
  background-color: #FFF;
  border-radius: 20px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(60px);
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
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
  color: ${black[300]};
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
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio || 'auto'};

    max-width: 100% !important;
    height: 100% !important;
  }
`;

export const ChartLegend = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const LegendDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export const LegendLabel = styled.span`
  color: ${black[300]};
  font-size: 14px;
`;

export const LegendValue = styled.span`
  color: ${black[100]};
  font-size: 14px;
  margin-left: 8px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const DateRange = styled.div`
  color: #6B7280;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${black[100]};
  }
`;

export const DatePickerPopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
`;

export const DateInput = styled.input`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  color: ${black[300]};
  outline: none;

  &:focus {
    border-color: #2563eb;
  }
`;