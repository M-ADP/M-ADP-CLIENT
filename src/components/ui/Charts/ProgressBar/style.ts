import styled from '@emotion/styled';
import { black } from '@/styles/colors';

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProgressLabel = styled.div`
  color: ${black[75]};
  font-size: 14px;
  font-weight: 500;
`;

export const ProgressValue = styled.div`
  color: ${black[50]};
  font-size: 24px;
  font-weight: 600;
`;

export const ProgressBarContainer = styled.div<{ height?: number }>`
  width: 100%;
  height: ${({ height }) => height || 6}px;
  background-color: #2D2E5F;
  border-radius: ${({ height }) => (height ? height / 2 : 3)}px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ progress: number; color?: string }>`
  height: 100%;
  width: ${({ progress }) => Math.max(0, Math.min(progress, 100))}%;
  background-color: ${({ color }) => color || '#0075FF'};
  border-radius: 3px;
  transition: width 0.3s ease;
`;