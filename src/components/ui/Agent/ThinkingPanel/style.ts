import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Panel = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const PanelHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
  user-select: none;
`;

export const SpinnerIcon = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(3, 9, 130, 0.14);
  border-top-color: ${colors.primary.default};
  border-radius: 50%;
  flex-shrink: 0;
  animation: ${spin} 0.8s linear infinite;
`;

export const CheckIcon = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #fff;
`;

export const FailIcon = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ef4444;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #fff;
`;

export const PauseIcon = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  color: #fff;
`;

export const CancelIcon = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
`;

export const HeaderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
`;

export const HeaderCopy = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const HeaderText = styled.span`
  font-family: ${typography.text14Medium.fontFamily};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #1e293b;
  min-width: 0;
  word-break: break-word;
`;

export const HeaderStatus = styled.span`
  font-family: ${typography.text12Regular.fontFamily};
  font-size: 12px;
  font-weight: ${typography.text12Regular.fontWeight};
  line-height: 1.2;
  color: #64748b;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const ChevronIcon = styled.span<{ open: boolean }>`
  font-size: 10px;
  color: #64748b;
  transition: transform 0.2s ease;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const StepList = styled.div`
  margin-top: 2px;
  padding: 10px 12px 12px;
  border-radius: 12px;
  border: 1px solid #e7eefb;
  background: #fbfdff;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeIn} 0.2s ease;
`;

export const SummaryText = styled.p`
  margin: 0 0 8px;
  font-family: ${typography.text14Regular.fontFamily};
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  color: #64748b;
`;

export const StepItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 6px 0;
  position: relative;
  animation: ${slideDown} 0.2s ease;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 18px;
    bottom: -6px;
    width: 1px;
    background: #e7eefb;
  }
`;

export const StepDot = styled.span<{ status: 'active' | 'paused' | 'done' | 'failed' }>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  background: ${({ status }) =>
    status === 'active'
      ? colors.primary.default
      : status === 'paused'
        ? '#f59e0b'
        : status === 'failed'
          ? '#ef4444'
          : '#10b981'};
  animation: ${({ status }) => (status === 'active' ? pulse : 'none')} 1.4s ease infinite;
  box-shadow: ${({ status }) =>
    status === 'active' ? '0 0 0 3px rgba(3, 9, 130, 0.12)' : 'none'};
`;

export const StepContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StepMessage = styled.p<{ isActive?: boolean }>`
  margin: 0;
  font-family: ${typography.text14Regular.fontFamily};
  font-size: 14px;
  color: ${({ isActive }) => (isActive ? '#0f172a' : '#475569')};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  line-height: 1.4;
`;

export const ProgressBar = styled.div<{ value: number }>`
  height: 3px;
  border-radius: 999px;
  margin: 0 12px 6px;
  background: #e7eefb;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ value }) => value}%;
    background: ${colors.gradient.primary};
    transition: width 0.4s ease;
    border-radius: 999px;
  }
`;
