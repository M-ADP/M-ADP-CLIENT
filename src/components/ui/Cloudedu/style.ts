import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { COLORS } from '@/styles/colors';
import { FONT_FAMILY, typography } from '@/styles/typography';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInRise = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(17, 116, 247, 0.45); }
  50% { box-shadow: 0 0 0 10px rgba(17, 116, 247, 0); }
`;

export const IdleCard = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1100;
  width: 320px;
  padding: 16px 18px;
  border-radius: 12px;
  background: ${COLORS.BG_PRIMARY};
  color: #fff;
  font-family: ${FONT_FAMILY};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  animation: ${fadeInRise} 220ms ease-out;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const IdleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${COLORS.GRADIENT_PRIMARY};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

export const IdleTitle = styled.div`
  font-size: ${typography.text14Semibold.fontSize};
  font-weight: ${typography.text14Semibold.fontWeight};
`;

export const IdleSubtitle = styled.div`
  font-size: ${typography.text12Regular.fontSize};
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

export const IdleActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

export const PrimaryAction = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${COLORS.PRIMARY_10};
  color: #fff;
  font-family: ${FONT_FAMILY};
  font-size: ${typography.text12Semibold.fontSize};
  font-weight: ${typography.text12Semibold.fontWeight};
  &:hover { background: ${COLORS.PRIMARY_20}; color: ${COLORS.BG_PRIMARY}; }
`;

export const GhostAction = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-family: ${FONT_FAMILY};
  font-size: ${typography.text12Regular.fontSize};
  &:hover { background: rgba(255, 255, 255, 0.08); }
`;

export const Panel = styled.div`
  z-index: 1100;
  width: 360px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  border: 1px solid ${COLORS.BLACK_50};
  font-family: ${FONT_FAMILY};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${COLORS.BLACK_50};
`;

export const PanelLogo = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;

export const PanelTitle = styled.div`
  font-size: ${typography.text14Semibold.fontSize};
  font-weight: ${typography.text14Semibold.fontWeight};
  color: ${COLORS.BG_PRIMARY};
`;

export const PanelBody = styled.div`
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

export const PanelBodyLogo = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const PanelMessage = styled.div`
  font-size: ${typography.text14Regular.fontSize};
  color: ${COLORS.BLACK_300};
  line-height: 1.55;
  white-space: pre-wrap;
`;

export const InputRow = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid ${COLORS.BLACK_50};
`;

export const InputField = styled.input`
  flex: 1;
  border: 1px solid ${COLORS.BLACK_50};
  border-radius: 999px;
  padding: 8px 14px;
  font-family: ${FONT_FAMILY};
  font-size: ${typography.text12Regular.fontSize};
  color: ${COLORS.BLACK_300};
  outline: none;
  &::placeholder { color: ${COLORS.BLACK_75}; }
  &:focus { border-color: ${COLORS.PRIMARY_10}; }
`;

export const SendButton = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${COLORS.GRADIENT_PRIMARY};
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const SelectionBubble = styled.button`
  z-index: 1100;
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${COLORS.BG_PRIMARY};
  color: #fff;
  font-family: ${FONT_FAMILY};
  font-size: ${typography.text12Semibold.fontSize};
  font-weight: ${typography.text12Semibold.fontWeight};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  animation: ${fadeIn} 160ms ease-out;
  &:hover { background: ${COLORS.PRIMARY_10}; }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -4px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: translateX(-50%) rotate(45deg);
    border-radius: 2px;
  }
`;

export const Sparkle = styled.span`
  font-size: 14px;
`;
