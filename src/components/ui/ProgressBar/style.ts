import styled from '@emotion/styled';

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
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
`;

export const ProgressValue = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 600;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(156, 163, 175, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ progress: number; color?: string }>`
  height: 100%;
  width: ${({ progress }) => Math.min(progress, 100)}%;
  background-color: ${({ color }) => color || '#3b82f6'};
  border-radius: 3px;
  transition: width 0.3s ease;
`;