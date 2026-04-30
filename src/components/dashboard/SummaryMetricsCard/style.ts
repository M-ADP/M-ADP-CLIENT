import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 20px;
  flex: 1;
  box-sizing: border-box;
  background: #FFF;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(60px);
`;

export const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SummaryTitle = styled.h2`
  font-family: ${typography.text24Bold.fontFamily};
  font-size: ${typography.text24Bold.fontSize};
  font-weight: ${typography.text24Bold.fontWeight};
  line-height: ${typography.text24Bold.lineHeight};
  color: ${colors.black[300]};
  margin: 0;
`;

export const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${colors.black[100]};
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.black[300]};
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const MetricCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MetricLabel = styled.span`
  font-family: ${typography.text12Medium.fontFamily};
  font-size: ${typography.text12Medium.fontSize};
  font-weight: ${typography.text12Medium.fontWeight};
  line-height: ${typography.text12Medium.lineHeight};
  color: ${colors.black[100]};
`;

export const MetricValue = styled.span`
  font-family: ${typography.text18Bold.fontFamily};
  font-size: ${typography.text18Bold.fontSize};
  font-weight: ${typography.text18Bold.fontWeight};
  line-height: ${typography.text18Bold.lineHeight};
  color: ${colors.black[300]};
`;

export const ComingSoonText = styled.span`
  font-family: ${typography.text12Regular.fontFamily};
  font-size: ${typography.text12Regular.fontSize};
  font-weight: ${typography.text12Regular.fontWeight};
  line-height: ${typography.text12Regular.lineHeight};
  color: ${colors.black[75]};
`;

export const ProgressBarWrapper = styled.div`
  margin-top: auto;
  padding-top: 8px;
`;

export const ComingSoonBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: repeating-linear-gradient(
    90deg,
    #c4cada 0,
    #c4cada 12px,
    #e4e8f0 12px,
    #e4e8f0 20px
  );
`;
