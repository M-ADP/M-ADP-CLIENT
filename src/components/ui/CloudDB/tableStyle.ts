import styled from '@emotion/styled';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';
import { black, primary } from '@/styles/colors';

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${black[50]};
`;

export const ModalTitle = styled.h2`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 1.75rem;
  color: ${black[300]};
  margin: 0;
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label<{ $color?: string }>`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.875rem;
  color: ${({ $color }) => $color || primary.default};
`;

export const SectionTitle = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 1.25rem;
  color: ${black[300]};
  margin: 0 0 1rem 0;
`;

/* Columns Table styles */
export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 32px 1.5fr 1fr 1fr 60px 72px;
  gap: 0.5rem;
  padding: 0 0.5rem 0.5rem 0.5rem;
  margin-bottom: 0.25rem;
`;

export const HeaderCell = styled.div<{ $align?: 'center' }>`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.75rem;
  color: ${black[300]};
  text-align: ${({ $align }) => $align || 'left'};
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 32px 1.5fr 1fr 1fr 60px 72px;
  gap: 0.5rem;
  align-items: center;
  background-color: ${black[50]}33;
  padding: 0.5rem;
  border-radius: 4px;
`;

export const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: ${black[100]};

  &:active {
    cursor: grabbing;
  }
`;

export const InputWrapper = styled.div<{ $hasIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid ${black[50]};
  border-radius: 4px;
  box-sizing: border-box;
  
  &:focus-within {
    border-color: ${primary[10]};
  }
`;

const commonInputStyle = `
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: transparent;
  padding: 0.5rem 0.75rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  color: ${black[300]};
  outline: none;

  &::placeholder {
    color: ${black[100]};
  }
`;

export const TableInput = styled.input`
  ${commonInputStyle}
`;

export const TableSelect = styled.select`
  ${commonInputStyle}
  appearance: none;
  cursor: pointer;
  padding-right: 2rem;
`;

export const InputIcon = styled.div`
  position: absolute;
  right: 0.5rem;
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${black[100]};
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #10b981; /* green color from screenshot */
  cursor: pointer;
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${black[100]};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: ${black[50]};
    color: ${black[300]};
  }
`;

export const DashedButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: transparent;
  border: 1px dashed ${black[75]};
  border-radius: 4px;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  color: ${black[100]};
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    border-color: ${black[200]};
    color: ${black[200]};
  }
`;

export const ForeignKeyBox = styled.div`
  border: 1px solid ${black[50]};
  padding: 1.5rem;
  border-radius: 4px;
`;

export const FKTargetWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const FKShip = styled.div`
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  color: ${black[300]};
  font-weight: ${fontWeights.medium};
`;

export const ModalFooter = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid ${black[50]};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const SelectBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: ${black[50]}66;
  border: 1px solid ${black[50]};
  border-radius: 4px;
  font-size: 0.875rem;
  color: ${black[300]};
`;

export const CustomInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${black[50]};
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: ${black[100]};
  }

  &:focus {
    border-color: ${primary.default};
    box-shadow: 0 0 0 1px ${primary.default};
  }
`;

export const OptionalInputWrapper = styled.div`
  border: 1px solid ${black[50]};
  border-radius: 4px;
  box-sizing: border-box;
  
  input {
    width: 100%;
    box-sizing: border-box;
    border: none;
    padding: 0.75rem 1rem;
    font-family: ${FONT_FAMILY};
    font-size: 0.875rem;
    outline: none;

    &::placeholder {
      color: ${black[100]};
    }
    
    &:focus {
      border-color: ${black[100]};
    }
  }
`;

export const NameInputWrapper = styled.div`
  display: flex;
  align-items: stretch;
  background: white;
  border: 1px solid ${black[50]};
  border-radius: 4px;
  box-sizing: border-box;
  
  &:focus-within {
    border-color: ${primary[10]};
  }
`;

export const NameInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: transparent;
  padding: 0.5rem 0.75rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  color: ${black[300]};
  outline: none;

  &::placeholder {
    color: ${black[100]};
  }

  border-radius: 4px 0 0 4px;
`;

export const ChainButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-left: 1px dashed ${black[100]};
  color: ${black[300]};
  cursor: pointer;
  padding: 0 0.5rem;
  border-radius: 0 4px 4px 0;

  &:hover {
    background: ${black[50]}33;
  }
`;

export const FKModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FKFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const FKSelectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
