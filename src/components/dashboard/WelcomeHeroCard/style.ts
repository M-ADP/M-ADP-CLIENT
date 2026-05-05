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
  padding: 20px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(60px);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(8, 10, 20, 0.88) 0%, rgba(8, 10, 20, 0.62) 28%, rgba(8, 10, 20, 0.12) 58%, rgba(8, 10, 20, 0) 78%);
  }
`;

export const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('/assets/hepari.png');
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
  z-index: 0;
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
  max-width: 100%;
  display: flex;
  align-items: baseline;
  gap: 0;
  min-width: 0;
`;

export const GreetingName = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const GreetingNameSkeleton = styled.span`
  display: inline-block;
  width: 140px;
  height: 1em;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.12) 100%);
  background-size: 200% 100%;
  animation: heroShimmer 1.4s ease-in-out infinite;
  vertical-align: middle;

  @keyframes heroShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const GreetingSuffix = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
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
