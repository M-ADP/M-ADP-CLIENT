import styled from '@emotion/styled';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';
import { black, primary } from '@/styles/colors';

// Table Modal specific styles
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 1.5rem;
  color: ${black[300]};
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${black[50]};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 0.875rem;
  color: ${black[300]};
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${black[50]};
  gap: 1rem;
`;

export const Tab = styled.button<{ $active: boolean }>`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.875rem;
  color: ${({ $active }) => ($active ? primary.default : black[100])};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? primary.default : 'transparent')};
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${primary.default};
  }
`;

export const ColumnsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
`;

export const ColumnRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${black[50]};
  border-radius: 8px;
  align-items: center;
`;

export const ColumnInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
`;

export const Select = styled.select`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[300]};
  border: 1px solid ${black[50]};
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${primary.default};
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.75rem;
  color: ${black[200]};
  cursor: pointer;

  input[type='checkbox'] {
    cursor: pointer;
  }
`;

export const RemoveButton = styled.button`
  font-size: 1.25rem;
  color: ${black[100]};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: ${primary.default};
  }
`;

export const ForeignKeysSection = styled.div`
  padding: 2rem;
  text-align: center;
`;

export const InfoText = styled.p`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[100]};
  margin: 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid ${black[50]};
`;
