import styled from '@emotion/styled';
import { typography } from '@/styles/typography';

export const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  background-color: #0c102a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(60px);
`;

export const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60%;
  background-image: url('/images/jellyfish.png');
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
  z-index: 1;
  mask-image: linear-gradient(to right, transparent, black 40%);
  -webkit-mask-image: linear-gradient(to right, transparent, black 40%);
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 50%;
`;

export const GreetingSub = styled.span`
  font-family: ${typography.text14Regular.fontFamily};
  font-size: ${typography.text14Regular.fontSize};
  font-weight: ${typography.text14Regular.fontWeight};
  line-height: ${typography.text14Regular.lineHeight};
  color: #9ca3af;
`;

export const GreetingMain = styled.h1`
  font-family: ${typography.text32Bold.fontFamily};
  font-size: ${typography.text32Bold.fontSize};
  font-weight: ${typography.text32Bold.fontWeight};
  line-height: ${typography.text32Bold.lineHeight};
  color: #ffffff;
  margin: 0;
`;

export const QuestionText = styled.span`
  font-family: ${typography.text14Regular.fontFamily};
  font-size: ${typography.text14Regular.fontSize};
  font-weight: ${typography.text14Regular.fontWeight};
  line-height: ${typography.text14Regular.lineHeight};
  color: #d1d5db;
  margin-top: 4px;
`;

export const ProfileLink = styled.button`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: ${typography.text14Medium.fontWeight};
  line-height: ${typography.text14Medium.lineHeight};
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  margin-top: auto;
  align-self: flex-start;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;
