import styled from '@emotion/styled';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';
import { black } from '@/styles/colors';

export const SocialLoginButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.9rem 2.3rem;
  border-radius: 4.5rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  background-color: ${black[50]};

  &:hover {
    opacity: 0.9;
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ButtonText = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 2rem;
  line-height: 120%;
`;
