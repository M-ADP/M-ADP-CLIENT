import styled from '@emotion/styled';
import { primary, black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

type SizeProp = string | number | undefined;

export const LabelText = styled.span`
  color: ${black[300]};
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.light};
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.15px;
`;

export const Container = styled.div<{ width?: SizeProp }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width ? width : '100%'};

  &:focus-within .input-label {
    color: ${primary.default};
    font-weight: ${fontWeights.regular};
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.56rem 1.56rem;
  border-radius: 4px;
  border: 0.5px solid ${black[75]};
  box-sizing: border-box;
  color: ${black[300]};
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.light};
  font-size: 16px;
  line-height: normal;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${black[75]};
    font-weight: ${fontWeights.light};
  }

  &:focus,
  &:active {
    outline: none;
    border: 1px solid ${primary.default};
  }
`;