import styled from '@emotion/styled';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';
import { black } from '@/styles/colors';

export const SocialLoginButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
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
  font-size: 1.1rem;
  line-height: 120%;
`;
