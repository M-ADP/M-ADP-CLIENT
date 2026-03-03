import styled from '@emotion/styled';
import { black } from '@/styles/colors';
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

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 39.5rem;
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 1rem;
  color: ${black[300]};
`;

export const Select = styled.select`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 1rem;
  color: ${black[300]};
  border: 1px solid ${black[50]};
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236B6B6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: ${black[75]};
  }

  option {
    padding: 0.5rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
  margin-top: 3rem;
`;
