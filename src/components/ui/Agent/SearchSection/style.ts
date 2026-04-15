import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const SearchContainer = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  height: 52px;
  padding: 0 20px;
  background: #ffffff;
  border: 1px solid ${colors.black[50]};
  border-radius: 26px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  margin-bottom: 20px;

  &:focus-within {
    border-color: ${colors.primary.default};
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  &.send-button {
    background: ${colors.primary.default};
    cursor: pointer;
    border: 1px solid ${colors.primary.default};
  }
`;

export const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${colors.primary.default};
  cursor: pointer;
  border: 1px solid ${colors.primary.default};
  padding: 0;
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  padding: 0;
  font-family: ${typography.text16Medium.fontFamily};
  font-size: ${typography.text16Medium.fontSize};
  font-weight: ${typography.text16Medium.fontWeight};
  line-height: ${typography.text16Medium.lineHeight};
  color: ${colors.black[75]};
  outline: none;

  &::placeholder {
    color: ${colors.black[75]};
  }
`;
