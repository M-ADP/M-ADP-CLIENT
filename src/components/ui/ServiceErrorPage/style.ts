import styled from '@emotion/styled';
import { background, gray, primary } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const Page = styled.main`
  min-height: 100vh;
  background: #ffffff;
  color: ${background.secondary};
`;

export const Shell = styled.div`
  width: min(100%, 960px);
  margin: 0 auto;
  padding: 28px 24px 56px;
  box-sizing: border-box;

  @media (max-width: 720px) {
    padding: 20px 16px 32px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BrandName = styled.span`
  font-family: ${FONT_FAMILY};
  font-size: 18px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.08em;
  color: ${background.primary};
`;

export const Content = styled.div`
  max-width: 520px;
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: ${FONT_FAMILY};
  font-size: 13px;
  font-weight: ${fontWeights.semibold};
  color: ${gray[500]};
`;

export const Title = styled.h1`
  margin: 12px 0 0;
  font-family: ${FONT_FAMILY};
  font-size: clamp(32px, 6vw, 44px);
  font-weight: ${fontWeights.bold};
  line-height: 1.16;
  letter-spacing: -0.06em;
  color: ${background.primary};
`;

export const Description = styled.p`
  max-width: 380px;
  margin: 14px 0 0;
  font-family: ${FONT_FAMILY};
  font-size: 15px;
  line-height: 1.7;
  color: ${gray[600]};

  @media (max-width: 720px) {
    font-size: 15px;
  }
`;

export const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

export const NoticeItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 0;
`;

export const NoticeDot = styled.span`
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  margin-top: 11px;
  border-radius: 999px;
  background: ${primary.default};
`;

export const NoticeText = styled.span`
  font-family: ${FONT_FAMILY};
  font-size: 17px;
  line-height: 1.7;
  color: ${background.primary};
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
`;

const actionBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 152px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 12px;
  font-family: ${FONT_FAMILY};
  font-size: 15px;
  font-weight: ${fontWeights.semibold};
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
  cursor: pointer;

  &:hover {
    transform: none;
  }
`;

export const ActionButton = styled.a<{ $variant: 'primary' | 'secondary' }>`
  ${actionBase}

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
        border: 1px solid ${primary.default};
        background: ${primary.default};
        color: #ffffff;
      `
      : `
        border: 1px solid rgba(17, 24, 39, 0.1);
        background: #ffffff;
        color: ${background.primary};
      `}
`;

export const ActionButtonElement = styled.button<{ $variant: 'primary' | 'secondary' }>`
  ${actionBase}

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
        border: 1px solid ${primary.default};
        background: ${primary.default};
        color: #ffffff;
      `
      : `
        border: 1px solid rgba(17, 24, 39, 0.1);
        background: #ffffff;
        color: ${background.primary};
      `}
`;

export const StageSection = styled.section`
  margin-top: 12px;
`;

export const StageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
`;

export const StageTitle = styled.strong`
  display: block;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.16em;
  color: ${gray[500]};
`;

export const StageHint = styled.span`
  display: block;
  margin-top: 6px;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  line-height: 1.5;
  color: ${gray[500]};
`;

export const StageMetrics = styled.div`
  display: flex;
  gap: 18px;
`;

export const StageMetric = styled.div`
  text-align: right;
`;

export const StageMetricLabel = styled.span`
  display: block;
  font-family: ${FONT_FAMILY};
  font-size: 11px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.14em;
  color: ${gray[500]};
`;

export const StageMetricValue = styled.strong`
  display: block;
  margin-top: 6px;
  font-family: ${FONT_FAMILY};
  font-size: 28px;
  font-weight: ${fontWeights.bold};
  line-height: 1;
  color: ${background.primary};
`;

export const InfoSection = styled.section`
  margin-top: 28px;
`;

export const VisualCard = styled.div`
  position: relative;
  width: min(100%, 470px);
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 36px;
  border: 2px solid rgba(3, 9, 130, 0.14);
  background:
    linear-gradient(rgba(3, 9, 130, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(3, 9, 130, 0.05) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(228, 240, 255, 0.88));
  background-size:
    28px 28px,
    28px 28px,
    auto;
  box-shadow:
    20px 20px 0 rgba(3, 9, 130, 0.08),
    0 24px 48px rgba(17, 24, 39, 0.08);
`;

export const VisualMark = styled.span`
  position: absolute;
  left: 28px;
  top: 18px;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.16em;
  color: rgba(3, 9, 130, 0.5);
`;

export const VisualLetter = styled.span`
  position: absolute;
  right: 22px;
  bottom: -32px;
  font-family: ${FONT_FAMILY};
  font-size: clamp(200px, 30vw, 280px);
  font-weight: ${fontWeights.bold};
  line-height: 1;
  letter-spacing: -0.12em;
  color: rgba(3, 9, 130, 0.06);
`;

export const VisualAccentBlock = styled.div`
  position: absolute;
  right: 36px;
  bottom: 38px;
  width: 176px;
  height: 194px;
  border-radius: 30px 30px 12px 30px;
  background: linear-gradient(180deg, ${primary[10]} 0%, ${primary.default} 100%);
`;

export const VisualCircle = styled.div`
  position: absolute;
  left: 34px;
  top: 54px;
  width: 136px;
  height: 136px;
  border-radius: 999px;
  border: 2px solid rgba(3, 9, 130, 0.14);
`;

export const VisualCircleSmall = styled.div`
  position: absolute;
  left: 122px;
  top: 122px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #ffffff;
  border: 6px solid ${primary.default};
`;

export const VisualCardMini = styled.div`
  position: absolute;
  left: 34px;
  bottom: 42px;
  width: 176px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid rgba(3, 9, 130, 0.1);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 34px rgba(17, 24, 39, 0.08);
`;

export const VisualBar = styled.span<{ $width: string }>`
  display: block;
  width: ${({ $width }) => $width};
  height: 10px;
  border-radius: 999px;
  background: ${({ $width }) =>
    $width === '100%'
      ? 'linear-gradient(90deg, #030982 0%, #1174F7 100%)'
      : 'rgba(3, 9, 130, 0.14)'};

  & + & {
    margin-top: 10px;
  }
`;

export const VisualSquare = styled.div`
  position: absolute;
  top: 116px;
  right: 54px;
  width: 92px;
  height: 92px;
  border-radius: 24px;
  border: 2px solid rgba(3, 9, 130, 0.14);
  background: rgba(255, 255, 255, 0.5);
`;

export const VisualLine = styled.div`
  position: absolute;
  left: 32px;
  right: 32px;
  top: 238px;
  height: 2px;
  background: linear-gradient(90deg, rgba(3, 9, 130, 0), rgba(3, 9, 130, 0.18), rgba(3, 9, 130, 0));
`;

export const GameCard = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 0;
  border: none;
  background: transparent;
  box-shadow: none;

  @media (max-width: 960px) {
    height: 200px;
  }
`;

export const GameHud = styled.div`
  display: none;
`;

export const GameScoreDisplay = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  gap: 16px;
  z-index: 10;
`;

export const GameScoreItem = styled.div`
  text-align: right;
`;

export const GameScoreNumber = styled.span`
  display: block;
  font-family: ${FONT_FAMILY};
  font-size: 16px;
  font-weight: ${fontWeights.bold};
  font-variant-numeric: tabular-nums;
  color: ${gray[700]};
`;

export const GameLabel = styled.span`
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: #ffffff;
  font-family: ${FONT_FAMILY};
  font-size: 11px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.16em;
  color: ${primary.default};
`;

export const GameTitle = styled.strong`
  display: block;
  margin-top: 8px;
  font-family: ${FONT_FAMILY};
  font-size: 20px;
  font-weight: ${fontWeights.bold};
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${background.primary};
`;

export const GameScoreGrid = styled.div`
  display: flex;
  gap: 10px;
`;

export const GameScoreCard = styled.div`
  min-width: 74px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: #ffffff;
`;

export const GameScoreLabel = styled.span`
  display: block;
  font-family: ${FONT_FAMILY};
  font-size: 10px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.14em;
  color: rgba(3, 9, 130, 0.55);
`;

export const GameScoreValue = styled.strong`
  display: block;
  margin-top: 8px;
  font-family: ${FONT_FAMILY};
  font-size: 24px;
  font-weight: ${fontWeights.bold};
  line-height: 1;
  color: ${background.primary};
`;

export const GameViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0;
  background: #ffffff;
  border: none;
  outline: none;
  touch-action: manipulation;
  user-select: none;
  cursor: pointer;
`;

export const GameTrack = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
`;

export const GameGroundSprite = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background-repeat: repeat-x;
  image-rendering: pixelated;
`;

export const GameCloudSprite = styled.div`
  position: absolute;
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

export const GamePlayerShadow = styled.div`
  position: absolute;
  height: 12px;
  border-radius: 999px;
  background: rgba(3, 9, 130, 0.12);
  filter: blur(2px);
`;

export const GamePlayer = styled.div`
  position: absolute;
  image-rendering: pixelated;
`;

export const GamePlayerSprite = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

export const GamePlayerLogo = styled.img<{ $isJumping: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.1s ease-out;
  animation: ${({ $isJumping }) => ($isJumping ? 'spin 0.4s linear infinite' : 'none')};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const GameObstacle = styled.div`
  position: absolute;
  image-rendering: pixelated;
`;

export const GameObstacleSprite = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
`;

export const GameOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0 0 28px;
  box-sizing: border-box;
  pointer-events: none;
`;

export const GameOverlayCard = styled.div`
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  text-align: left;
`;

export const GameOverlayTitle = styled.strong`
  display: block;
  font-family: ${FONT_FAMILY};
  font-size: 18px;
  font-weight: ${fontWeights.bold};
  line-height: 1.3;
  color: ${background.primary};
`;

export const GameOverlayText = styled.p`
  margin: 6px 0 0;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  line-height: 1.6;
  color: ${gray[600]};
`;

export const GameHint = styled.p`
  display: none;
  margin: 0;
  font-family: ${FONT_FAMILY};
  font-size: 13px;
  line-height: 1.5;
  color: rgba(17, 24, 39, 0.48);
  text-align: left;
`;

export const PosterCard = styled.div`
  width: min(100%, 520px);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 18px;
  border: 1px solid rgba(17, 24, 39, 0.1);
  background: #fafafa;
  box-shadow: 0 12px 32px rgba(17, 24, 39, 0.06);
`;

export const PosterLabel = styled.span`
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: #ffffff;
  font-family: ${FONT_FAMILY};
  font-size: 11px;
  font-weight: ${fontWeights.bold};
  letter-spacing: 0.14em;
  color: ${primary.default};
`;

export const PosterViewport = styled.div`
  position: relative;
  height: 220px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: #ffffff;
`;

export const PosterCaption = styled.p`
  margin: 14px 0 0;
  font-family: ${FONT_FAMILY};
  font-size: 13px;
  line-height: 1.6;
  color: ${gray[600]};
`;
