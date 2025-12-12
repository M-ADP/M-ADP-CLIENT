import styled from '@emotion/styled';
import { FONT_FAMILY } from '@/styles/typography';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Card = styled.div<{ width?: string | number; height?: string | number }>`
  background: white;
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '400px')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '400px')};
  font-family: ${FONT_FAMILY};
`;