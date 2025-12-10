import styled from '@emotion/styled';
import { primary } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const StyledButton = styled.button<{ variant: 'confirm' | 'cancel' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.56rem 2.75rem;
  border-radius: 7px;
  cursor: pointer;
  transition: opacity 0.1s;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 18px;
  line-height: normal;
  letter-spacing: -0.15px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ variant }) =>
    variant === 'confirm'
      ? `
    background-color: ${primary.default};
    border: none;
    color: white;
  `
      : `
    background-color: white;
    border: 0.5px solid ${primary.default};
    color: ${primary.default};
  `}
`;
