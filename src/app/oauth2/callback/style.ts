import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/colors';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${colors.black[50]};
  border-top: 3px solid ${colors.primary.default};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const ErrorText = styled.p`
  color: #ff4d4f;
  background: #fff1f0;
  border: 1px solid #ffa39e;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
`;
