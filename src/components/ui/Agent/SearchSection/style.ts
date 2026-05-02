import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const Dock = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AssistPanel = styled.div`
  width: 100%;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 14px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AssistHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const AssistTitle = styled.div`
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: 600;
  line-height: ${typography.text14Medium.lineHeight};
  color: ${colors.black[300]};
`;

export const AssistBody = styled.p`
  margin: 0;
  font-family: ${typography.text14Regular.fontFamily};
  font-size: ${typography.text14Regular.fontSize};
  font-weight: ${typography.text14Regular.fontWeight};
  line-height: 1.5;
  color: ${colors.black[75]};
`;

export const AssistFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AssistField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const AssistLabel = styled.label`
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: ${typography.text14Medium.fontWeight};
  line-height: ${typography.text14Medium.lineHeight};
  color: ${colors.black[100]};
`;

export const AssistInput = styled.input`
  width: 100%;
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0 12px;
  box-sizing: border-box;
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: ${typography.text14Medium.fontWeight};
  line-height: ${typography.text14Medium.lineHeight};
  color: ${colors.black[300]};
  outline: none;

  &:focus {
    border-color: ${colors.black[100]};
  }
`;

export const AssistActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

export const AssistActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  min-width: 96px;
  height: 38px;
  border: 1px solid ${({ variant }) => (variant === 'primary' ? '#111827' : '#d1d5db')};
  border-radius: 999px;
  padding: 0 16px;
  cursor: pointer;
  transition: opacity 0.18s ease;
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: ${typography.text14Medium.fontWeight};
  line-height: ${typography.text14Medium.lineHeight};
  background: ${({ variant }) => (variant === 'primary' ? '#111827' : '#ffffff')};
  color: ${({ variant }) => (variant === 'primary' ? '#ffffff' : colors.black[100])};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
  overflow: hidden;
  flex-shrink: 0;
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

export const UsageRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 6px;
  box-sizing: border-box;
`;

export const UsageText = styled.div<{ exhausted?: boolean }>`
  font-family: ${typography.text12Regular.fontFamily};
  font-size: 12px;
  line-height: 1.4;
  color: ${({ exhausted }) => (exhausted ? '#dc2626' : colors.black[75])};
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

export const UsageReset = styled.span`
  color: ${colors.black[50]};
`;

export const UsageBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
`;

export const UsageBarFill = styled.div<{ ratio: number; exhausted?: boolean }>`
  width: ${({ ratio }) => `${Math.max(0, Math.min(1, ratio)) * 100}%`};
  height: 100%;
  background: ${({ exhausted }) => (exhausted ? '#dc2626' : colors.primary.default)};
  transition: width 0.3s ease;
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
