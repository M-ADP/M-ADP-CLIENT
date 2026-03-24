import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const panelStyle = `
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  padding: 26px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const TopCard = styled.section`
  ${panelStyle}
  padding: 14px 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AppName = styled.h1`
  margin: 0;
  color: ${colors.black[300]};
  font-family: ${typography.text28Bold.fontFamily};
  font-size: ${typography.text28Bold.fontSize};
  font-weight: ${typography.text28Bold.fontWeight};
  line-height: ${typography.text28Bold.lineHeight};
`;

export const TopContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 14px;
  align-items: start;
`;

export const OverviewArea = styled.div`
  --summary-card-height: 74px;
  --summary-grid-gap: 12px;
  border-radius: 20px;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
  align-items: start;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, var(--summary-card-height));
  gap: var(--summary-grid-gap);
  height: calc((var(--summary-card-height) * 2) + var(--summary-grid-gap));
`;

export const StatItem = styled.div`
  border-radius: 16px;
  background: #f6f7fa;
  padding: 10px 12px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`;

export const StatLabel = styled.span`
  color: #a1adbe;
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: ${typography.text14Medium.fontWeight};
  line-height: ${typography.text14Medium.lineHeight};
`;

export const StatValue = styled.span`
  color: ${colors.black[300]};
  font-family: ${typography.text18Bold.fontFamily};
  font-size: ${typography.text18Bold.fontSize};
  font-weight: ${typography.text18Bold.fontWeight};
  line-height: ${typography.text18Bold.lineHeight};
`;

export const GithubSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-width: 0;
  height: calc((var(--summary-card-height) * 2) + var(--summary-grid-gap));
  box-sizing: border-box;
  border-radius: 16px;
  background: #f6f7fa;
  padding: 10px 96px 10px 14px;
`;

export const GithubTitle = styled.h3`
  margin: 0;
  color: ${colors.black[300]};
  font-family: ${typography.text16Semibold.fontFamily};
  font-size: ${typography.text16Semibold.fontSize};
  font-weight: ${typography.text16Semibold.fontWeight};
  line-height: ${typography.text16Semibold.lineHeight};
`;

export const GithubDesc = styled.p`
  margin: 2px 0 0;
  color: ${colors.black[75]};
  font-family: ${typography.text12Regular.fontFamily};
  font-size: ${typography.text12Regular.fontSize};
  font-weight: ${typography.text12Regular.fontWeight};
  line-height: 1.4;
`;

export const GithubLinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const GithubLink = styled.a`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${colors.black[200]};
  text-decoration: none;
  font-family: ${typography.text16Medium.fontFamily};
  font-size: ${typography.text16Medium.fontSize};
  font-weight: ${typography.text16Medium.fontWeight};
  line-height: ${typography.text16Medium.lineHeight};
`;

export const BrandMark = styled.div`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HealthArea = styled.div`
  ${panelStyle}
  padding: 8px 16px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  position: relative;

  > div:last-of-type {
    margin-top: -14px;
  }

  > div:last-of-type > div {
    top: 56%;
  }

  > div:last-of-type > div > div:first-of-type {
    font-size: ${typography.text24Semibold.fontSize};
  }
`;

export const HealthLabel = styled.span`
  color: #b5bfd0;
  font-family: ${typography.text14Medium.fontFamily};
  font-size: ${typography.text14Medium.fontSize};
  font-weight: ${typography.text14Medium.fontWeight};
  line-height: ${typography.text14Medium.lineHeight};
  position: absolute;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  pointer-events: none;
`;

export const CardMenu = styled.button`
  border: none;
  background: transparent;
  color: ${colors.black[100]};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
`;

export const CornerMenu = styled(CardMenu)`
  position: absolute;
  top: -24px;
  right: 4px;
  z-index: 3;
`;

export const MiddleSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
`;

export const LogCard = styled.article`
  ${panelStyle}
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${colors.black[300]};
  font-family: ${typography.text20Bold.fontFamily};
  font-size: ${typography.text20Bold.fontSize};
  font-weight: ${typography.text20Bold.fontWeight};
  line-height: ${typography.text20Bold.lineHeight};
`;

export const LogList = styled.ul`
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  border-radius: 14px;
  max-height: 412px;
  overflow-y: auto;
`;

export const LogItem = styled.li`
  font-family: ${typography.text12Regular.fontFamily};
  font-size: ${typography.text12Regular.fontSize};
  font-weight: ${typography.text12Regular.fontWeight};
  line-height: 1.4;
  color: ${colors.black[200]};
  padding: 9px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const UserStatsCard = styled.article`
  ${panelStyle}
  padding: 14px 16px 12px;
`;

export const UserChartArea = styled.div`
  margin-top: 8px;
`;

export const LegendList = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LegendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LegendDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const LegendName = styled.span`
  color: ${colors.black[200]};
  font-family: ${typography.text14Regular.fontFamily};
  font-size: ${typography.text14Regular.fontSize};
  font-weight: ${typography.text14Regular.fontWeight};
  line-height: ${typography.text14Regular.lineHeight};
`;

export const LegendValue = styled.span`
  color: ${colors.black[300]};
  font-family: ${typography.text16Medium.fontFamily};
  font-size: ${typography.text16Medium.fontSize};
  font-weight: ${typography.text16Medium.fontWeight};
  line-height: ${typography.text16Medium.lineHeight};
`;

export const ResourceCard = styled.article`
  ${panelStyle}
  padding: 14px 16px;
`;

export const ResourceGrid = styled.div`
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
`;

export const ResourceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ResourceLabel = styled.span`
  color: #97a3b7;
  font-family: ${typography.text12Medium.fontFamily};
  font-size: ${typography.text12Medium.fontSize};
  font-weight: ${typography.text12Medium.fontWeight};
  line-height: ${typography.text12Medium.lineHeight};
`;

export const ResourceValue = styled.span`
  color: ${colors.black[300]};
  font-family: ${typography.text16Bold.fontFamily};
  font-size: ${typography.text16Bold.fontSize};
  font-weight: ${typography.text16Bold.fontWeight};
  line-height: ${typography.text16Bold.lineHeight};
`;

export const BottomSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 3fr) 260px;
  gap: 16px;
`;

export const TrafficCard = styled.article`
  ${panelStyle}
  padding: 12px 12px 8px;
`;

export const TrafficHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const TrafficHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TrafficLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const TrafficLegendLabel = styled.span`
  color: #687288;
  font-family: ${typography.text12Regular.fontFamily};
  font-size: ${typography.text12Regular.fontSize};
  font-weight: ${typography.text12Regular.fontWeight};
  line-height: ${typography.text12Regular.lineHeight};
`;

export const DateRange = styled.button`
  border: none;
  background: transparent;
  color: #4c5568;
  font-family: ${typography.text16Medium.fontFamily};
  font-size: ${typography.text16Medium.fontSize};
  font-weight: ${typography.text16Medium.fontWeight};
  line-height: ${typography.text16Medium.lineHeight};
  padding: 6px;
  cursor: pointer;
`;

export const TrafficChartArea = styled.div`
  margin-top: 4px;

  > div > div:first-of-type {
    display: none;
  }
`;

export const RiskCard = styled.article`
  background: #f2eee7;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RiskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const RiskTitle = styled.h3`
  margin: 0;
  color: ${colors.black[100]};
  font-family: ${typography.text18Semibold.fontFamily};
  font-size: ${typography.text18Semibold.fontSize};
  font-weight: ${typography.text18Semibold.fontWeight};
  line-height: ${typography.text18Semibold.lineHeight};
`;

export const RiskName = styled.p`
  margin: 2px 0;
  color: ${colors.black[200]};
  font-family: ${typography.text20Regular.fontFamily};
  font-size: ${typography.text20Regular.fontSize};
  font-weight: ${typography.text20Regular.fontWeight};
  line-height: 1.3;
`;

export const RiskMeta = styled.p`
  margin: 0;
  color: ${colors.black[75]};
  font-family: ${typography.text16Regular.fontFamily};
  font-size: ${typography.text16Regular.fontSize};
  font-weight: ${typography.text16Regular.fontWeight};
  line-height: ${typography.text16Regular.lineHeight};
`;
