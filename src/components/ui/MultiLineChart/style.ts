import styled from '@emotion/styled';
import { background, black } from '@/styles/colors';

export const ChartContainer = styled.div`
  background-color: ${background.secondary};
  border-radius: 12px;
  padding: 24px;
  height: 400px;
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

export const ChartContent = styled.div`
  height: calc(100% - 120px);
  margin-bottom: 20px;
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