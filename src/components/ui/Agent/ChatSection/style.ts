import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

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
