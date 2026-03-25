import styled from '@emotion/styled';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';
import { black, primary } from '@/styles/colors';

export const Overlay = styled.div<{ $position?: 'center' | 'right' }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: ${({ $position }) => ($position === 'right' ? 'stretch' : 'center')};
  justify-content: ${({ $position }) => ($position === 'right' ? 'flex-end' : 'center')};
  z-index: 1000;
`;

export const Card = styled.div<{ $width?: string | number; $height?: string | number; $padding?: string | number }>`
  background: white;
  border-radius: 4px;
  padding: ${({ $padding }) => ($padding !== undefined ? (typeof $padding === 'number' ? `${$padding}px` : $padding) : '12px')};
  box-sizing: border-box;
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || '400px')};
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '400px')};
  font-family: ${FONT_FAMILY};
`;
