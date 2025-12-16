import styled from '@emotion/styled';

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const ProgressSvg = styled.svg<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  transform: rotate(-90deg);
`;

export const ProgressCircle = styled.circle`
  fill: none;
  transition: stroke-dashoffset 0.3s ease;
`;

export const ProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

export const ProgressValue = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
`;

export const ProgressUnit = styled.div`
  color: #9ca3af;
  font-size: 12px;
  margin-top: 2px;
`;