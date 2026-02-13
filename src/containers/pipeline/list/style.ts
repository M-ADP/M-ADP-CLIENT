import styled from '@emotion/styled';
import { black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PageWrapper = styled.div`
  background-color: #ffffff;
  padding: 5rem 2.25rem 2.25rem 2.25rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
`;

export const ProjectName = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 3rem;
  color: ${black[300]};
  margin: 0;
`;

export const BackButtonWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.5rem;
  color: ${black[300]};
  margin: 0;
`;

export const SearchWrapper = styled.div`
  width: 20rem;
`;

export const TableContainer = styled.div`
  border: 0.5px solid ${black[75]};
  border-radius: 4px;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 0.5px solid ${black[75]};
`;

export const WorkflowCount = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1rem;
  color: ${black[200]};
`;

export const StatusFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[100]};
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const WorkflowRow = styled.div`
  display: grid;
  grid-template-columns: 5rem 10rem 8rem 1fr 12rem 7rem;
  align-items: center;
  padding: 0 1.5rem;
  height: 5.125rem;
  border-bottom: 0.5px solid ${black[50]};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const WorkflowNumber = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1rem;
  color: ${black[300]};
`;

export const StatusCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[200]};
`;

export const Duration = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[100]};
`;

export const Trigger = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[100]};
`;

export const Timestamp = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[100]};
`;

export const DetailButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    padding: 0.375rem 1rem;
    font-size: 0.8125rem;
    border-radius: 4px;
  }
`;
