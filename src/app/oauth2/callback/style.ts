import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/colors';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 0%, rgba(0, 194, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 100%, rgba(3, 9, 130, 0.06) 0%, transparent 50%),
    #ffffff;
`;

export const LoaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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

export const LoaderCaption = styled.span`
  font-size: 14px;
  color: ${colors.black[100]};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 40px 32px 32px;
  background: #ffffff;
  border: 1px solid ${colors.black[50]};
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(3, 9, 130, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${fadeIn} 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

export const BrandName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.black[300]};
  letter-spacing: -0.02em;
`;

export const IconBadge = styled.div<{ $variant: 'warning' | 'error' }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
  animation: ${pulse} 2.4s ease-in-out infinite;
  background: ${({ $variant }) =>
    $variant === 'warning'
      ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'
      : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};
  border: 1px solid
    ${({ $variant }) => ($variant === 'warning' ? '#fed7aa' : '#fecaca')};
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: ${colors.black[300]};
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const Description = styled.p`
  margin: 0 0 4px;
  font-size: 15px;
  line-height: 1.55;
  color: ${colors.black[200]};
  word-break: keep-all;
`;

export const Hint = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${colors.primary.default};
  font-weight: 500;
`;

export const DetailBox = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 12px 14px;
  background: ${colors.black[50]};
  border-radius: 10px;
  text-align: left;
`;

export const DetailLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.black[100]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

export const DetailText = styled.div`
  font-size: 12px;
  color: ${colors.black[200]};
  font-family: 'SFMono-Regular', Consolas, monospace;
  word-break: break-word;
  line-height: 1.5;
`;

export const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 28px;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, ${colors.primary.default} 0%, #1174f7 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(3, 9, 130, 0.2);
  }

  &:active {
    transform: translateY(0);
    opacity: 0.95;
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  height: 44px;
  border: 1px solid ${colors.black[50]};
  border-radius: 12px;
  background: #ffffff;
  color: ${colors.black[200]};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${colors.black[50]};
    border-color: ${colors.black[75]};
  }
`;

