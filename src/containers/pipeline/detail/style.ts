import styled from '@emotion/styled';
import { black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PageWrapper = styled.div`
  background-color: #ffffff;
  padding: 5rem 2.25rem 2.25rem 2.25rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
`;

export const WorkflowTitle = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 3rem;
  color: ${black[300]};
  margin: 0;
`;

export const BackButtonWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  }
`;

export const LogPanel = styled.div`
  border: 0.5px solid ${black[75]};
  border-radius: 4px;
  overflow: hidden;
`;

export const LogPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 0.5px solid ${black[75]};
`;

export const LogPanelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LogPanelTitle = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.125rem;
  color: ${black[300]};
`;

export const LogPanelStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[200]};
`;

export const SearchWrapper = styled.div`
  width: 16rem;
`;

export const StepItem = styled.div`
  border-bottom: 0.5px solid ${black[50]};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const StepHeader = styled.button<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${({ $expanded }) => ($expanded ? '#F9F9F9' : 'transparent')};
  border: none;
  cursor: pointer;
  gap: 0.75rem;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const ChevronIcon = styled.span<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
  flex-shrink: 0;
`;

export const StepName = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.9375rem;
  color: ${black[200]};
  flex: 1;
  text-align: left;
`;

export const StepDuration = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.8125rem;
  color: ${black[75]};
  flex-shrink: 0;
`;

export const LogContainer = styled.div`
  background-color: #1e1e1e;
  padding: 1rem 0;
  max-height: 25rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${black[100]};
    border-radius: 3px;
  }
`;

export const LogLineRow = styled.div`
  display: flex;
  padding: 0.125rem 1.5rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.8125rem;
  line-height: 1.6;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

export const LineNumber = styled.span`
  color: #6f6f6f;
  min-width: 3rem;
  text-align: right;
  margin-right: 1.5rem;
  user-select: none;
  flex-shrink: 0;
`;

export const LineContent = styled.span`
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
`;
