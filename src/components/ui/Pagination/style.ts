import styled from '@emotion/styled';
import { primary, black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 2rem;
`;

export const NavButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  padding: 0;

  span {
    font-family: ${FONT_FAMILY};
    font-weight: ${fontWeights.semibold};
    font-size: 1.125rem;
    color: ${({ $disabled }) => ($disabled ? black[75] : primary[10])};
  }

  svg {
    fill: ${({ $disabled }) => ($disabled ? black[75] : primary[10])};
  }
`;

export const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PageNumber = styled.button<{ $active?: boolean }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${({ $active }) => ($active ? primary[10] : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : black[200])};
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ $active }) => ($active ? primary[10] : black[50])};
  }
`;
