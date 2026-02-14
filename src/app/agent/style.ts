import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const Container = styled.div<{ isChat?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ isChat }) => (isChat ? 'space-between' : 'center')};
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: ${({ isChat }) => (isChat ? '40px 0' : '0')};
  box-sizing: border-box;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 60px;
`;

export const LogoTitle = styled.span`
  font-family: 'IBM Plex Sans KR', sans-serif;
  font-weight: 700;
  font-size: 80px;
  line-height: normal;
  color: ${colors.black[300]};
  margin: 0;
`;

export const SearchContainer = styled.div`
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

export const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1240px;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  gap: 20px;
  flex: 1;
`;

export const MessageRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
  justify-content: center;
`;

export const Avatar = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ color }) => color || '#e2e8f0'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: ${typography.text16Regular.fontFamily};
  font-size: ${typography.text16Regular.fontSize};
  font-weight: ${typography.text16Regular.fontWeight};
  line-height: ${typography.text16Regular.lineHeight};
  color: #ffffff;
`;

export const UserMessageCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 15px 21px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  background-color: #ffffff;
  color: ${colors.primary.default};
  font-family: ${typography.text18Regular.fontFamily};
  font-size: ${typography.text18Regular.fontSize};
  font-weight: ${typography.text18Regular.fontWeight};
  line-height: ${typography.text18Regular.lineHeight};
`;

export const AIMessageCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 22px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  box-shadow: 14px 27px 45px 4px rgba(112, 144, 176, 0.2);
  color: #1b2559;
  font-family: ${typography.text18Regular.fontFamily};
  font-size: ${typography.text18Regular.fontSize};
  font-weight: ${typography.text18Regular.fontWeight};
  line-height: ${typography.text18Regular.lineHeight};
  white-space: pre-wrap;
  min-height: 100px;
`;
