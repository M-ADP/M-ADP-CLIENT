import styled from '@emotion/styled';
import { colors } from '@/styles/colors';

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

// Moved to components/ui/Agent/...
