import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1240px;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  gap: 20px;
  flex: 1;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  scroll-padding-top: 24px;
`;

export const ScrollSpacer = styled.div`
  flex-shrink: 0;
  height: calc(100vh - 260px);
  min-height: 360px;
  max-height: 720px;

  @media (max-width: 768px) {
    height: calc(100vh - 220px);
    min-height: 260px;
    max-height: 520px;
  }
`;

export const MessageRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  max-width: 848px;
  margin: 0 auto;
  min-width: 0;
`;

export const ThinkingRow = styled.div`
  display: flex;
  width: 100%;
  max-width: 848px;
  margin: -6px auto -4px;
  min-width: 0;

  @media (max-width: 768px) {
    margin: -2px auto 0;
  }
`;

export const ThinkingOffset = styled.div`
  width: 48px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 0;
  }
`;

export const ThinkingPanelWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserMessageRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  min-width: 0;
  scroll-margin-top: 24px;
`;

export const Avatar = styled.div<{ color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ color }) => color || '#e2e8f0'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: ${typography.text16Regular.fontFamily};
  font-size: 13px;
  font-weight: ${typography.text16Regular.fontWeight};
  line-height: ${typography.text16Regular.lineHeight};
  color: #ffffff;
`;

export const UserMessageCard = styled.div`
  border-radius: 20px 20px 4px 20px;
  padding: 12px 18px;
  max-width: 70%;
  box-sizing: border-box;
  background-color: ${colors.primary.default};
  color: #ffffff;
  font-family: ${typography.text16Regular.fontFamily};
  font-size: ${typography.text16Regular.fontSize};
  font-weight: ${typography.text16Regular.fontWeight};
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

export const AIMessageCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 22px;
  flex: 1;
  width: auto;
  max-width: none;
  min-width: 0;
  box-sizing: border-box;
  box-shadow: 14px 27px 45px 4px rgba(112, 144, 176, 0.2);
  color: #1b2559;
  font-family: ${typography.text18Regular.fontFamily};
  font-size: ${typography.text18Regular.fontSize};
  font-weight: ${typography.text18Regular.fontWeight};
  line-height: ${typography.text18Regular.lineHeight};
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
  min-height: 100px;
`;

export const TaskCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 22px;
  flex: 1;
  width: auto;
  max-width: none;
  min-width: 0;
  box-sizing: border-box;
  box-shadow: 14px 27px 45px 4px rgba(112, 144, 176, 0.2);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: ${typography.text16Regular.fontFamily};
`;

export const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderBadges = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const TaskCardTitle = styled.h3`
  font-family: ${typography.text18Regular.fontFamily};
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

const STATE_BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  info: { bg: '#e0f2fe', color: '#0369a1' },
  warning: { bg: '#fff3e0', color: '#ef6c00' },
  success: { bg: '#dcfce7', color: '#15803d' },
  danger: { bg: '#ffebee', color: '#c62828' },
  neutral: { bg: '#f1f5f9', color: '#64748b' },
};

export const StateBadge = styled.span<{ variant?: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ variant }) => STATE_BADGE_COLORS[variant || 'neutral'].bg};
  color: ${({ variant }) => STATE_BADGE_COLORS[variant || 'neutral'].color};
`;

export const TaskCardSummary = styled.p`
  margin: 0;
  font-family: ${typography.text16Regular.fontFamily};
  font-size: 16px;
  color: #475569;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const TaskCardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-family: ${typography.text14Medium.fontFamily};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
  
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

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

export const TaskStatusText = styled.div<{ status?: string }>`
  font-family: ${typography.text14Medium.fontFamily};
  font-size: 14px;
  font-weight: 600;
  color: ${({ status }) => {
    if (status === 'completed') return '#10b981';
    if (status === 'superseded') return '#94a3b8';
    return '#ef4444';
  }};
`;

export const PendingIndicator = styled.span`
  font-family: ${typography.text12Regular.fontFamily};
  font-size: 13px;
  color: #64748b;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

// --- filled_inputs 확인 패널 ---

export const FilledInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-family: ${typography.text14Regular.fontFamily};
  min-width: 0;
`;

export const FilledInputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  gap: 12px;
  min-width: 0;
`;

export const FilledInputLabel = styled.span`
  font-family: ${typography.text14Medium.fontFamily};
  color: #64748b;
  font-weight: 500;
  min-width: 0;
`;

export const FilledInputValue = styled.span`
  font-family: ${typography.text14Semibold.fontFamily};
  color: #1e293b;
  font-weight: 600;
  min-width: 0;
  text-align: right;
  word-break: break-word;
`;

// --- missing_inputs 인라인 폼 ---

export const MissingInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #fffbeb;
  border-radius: 8px;
  border: 1px solid #fde68a;
`;

export const MissingInputsTitle = styled.span`
  font-family: ${typography.text14Medium.fontFamily};
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
`;

export const MissingInputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MissingInputLabel = styled.label`
  font-size: 13px;
  color: #78716c;
  font-weight: 500;
`;

export const MissingInputField = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  background: #ffffff;

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

// --- clarification 배지 ---

export const ClarificationBadge = styled.span`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
`;

// --- 스트리밍 커서 ---

export const StreamingCursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: #1b2559;
  margin-left: 2px;
  vertical-align: text-bottom;
  border-radius: 1px;
  animation: blink 1s step-start infinite;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;
