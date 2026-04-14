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

export const TaskCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 22px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
  box-shadow: 14px 27px 45px 4px rgba(112, 144, 176, 0.2);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TaskCardTitle = styled.h3`
  font-family: ${typography.text22Bold?.fontFamily || typography.text18Regular.fontFamily};
  font-size: 18px;
  font-weight: 600;
  color: #1b2559;
  margin: 0;
`;

export const Badge = styled.span<{ level?: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ level }) => {
    if (level === 'high') return '#ffebee';
    if (level === 'medium') return '#fff3e0';
    return '#f8fafc';
  }};
  color: ${({ level }) => {
    if (level === 'high') return '#c62828';
    if (level === 'medium') return '#ef6c00';
    return '#64748b';
  }};
`;

export const TaskCardSummary = styled.p`
  margin: 0;
  font-size: 16px;
  color: #475569;
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const TaskCardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  background-color: ${({ variant }) => {
    if (variant === 'primary') return colors.primary.default;
    if (variant === 'danger') return '#ef4444';
    return '#f1f5f9';
  }};
  color: ${({ variant }) => (variant && variant !== 'secondary' ? '#ffffff' : '#475569')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TaskStatusText = styled.div<{ status?: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ status }) => (status === 'completed' ? '#10b981' : '#ef4444')};
`;
