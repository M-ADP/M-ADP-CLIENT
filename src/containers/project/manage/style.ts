import styled from '@emotion/styled';
import { black, primary, status } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PageWrapper = styled.div`
  background-color: #ffffff;
  padding: 5rem 2.25rem;
`;

export const PageTitle = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 3rem;
  color: ${black[300]};
  margin: 0 0 1.5rem 0;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input`
  width: 280px;
  padding: 12px 16px;
  border: 1px solid ${black[50]};
  border-radius: 8px;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  color: ${black[300]};

  &::placeholder {
    color: ${black[75]};
  }

  &:focus {
    outline: none;
    border-color: ${primary.default};
  }
`;

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
`;

export const ProjectName = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.125rem;
  color: ${black[300]};
  margin: 0 0 0.5rem 0;
`;

export const ArrowIcon = styled.span`
  color: ${black[75]};
  font-size: 1.5rem;
  line-height: 1;
`;

export const ProjectInfo = styled.p`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.8125rem;
  color: ${black[75]};
  margin: 0;
  line-height: 1.5;
`;

export const ProjectDomain = styled.p`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.75rem;
  color: ${black[75]};
  margin: 0.375rem 0 0 0;
`;

export const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: auto;
  padding-top: 0.75rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.75rem;
  color: ${black[100]};
`;

export const WarningIcon = styled.span`
  color: ${status.warning};
`;
