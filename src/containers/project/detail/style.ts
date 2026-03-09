import styled from '@emotion/styled';
import { black, primary, gray } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PageWrapper = styled.div`
  background-color: #ffffff;
  padding: 5rem 2.25rem 0 2.25rem;
`;

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;


export const PageTitle = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 3rem;
  color: ${black[300]};
  margin: 0;
`;

export const ProjectId = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 1.25rem;
  color: ${black[75]};
`;

export const SectionTitle = styled.h2`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.5rem;
  color: ${black[300]};
  margin: 0 0 1.5rem 0;
`;

export const AppGridWrapper = styled.div<{ $showLeftGradient: boolean; $showRightGradient: boolean }>`
  position: relative;
  margin-bottom: 3rem;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.2s ease;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    opacity: ${({ $showLeftGradient }) => ($showLeftGradient ? 1 : 0)};
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    opacity: ${({ $showRightGradient }) => ($showRightGradient ? 1 : 0)};
  }
`;

export const AppGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    min-width: 350px;
    flex-shrink: 0;
  }
`;

export const AppCard = styled.div`
  border: 1px solid ${black[50]};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const AppHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const AppName = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.125rem;
  color: ${black[300]};
  margin: 0;
`;

export const ArrowIcon = styled.span`
  color: ${black[75]};
  font-size: 1.25rem;
  cursor: pointer;
`;

export const AppMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const AppMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[75]};
`;

export const AppStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${black[50]};
`;

export const StatusMessage = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.75rem;
  color: ${black[75]};
`;

export const StatusBadge = styled.span<{ $healthy?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.75rem;
  color: ${({ $healthy }) => ($healthy ? '#10b981' : '#ef4444')};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $healthy }) => ($healthy ? '#10b981' : '#ef4444')};
  }
`;

export const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const ChartCard = styled.div`
  background: #1e293b;
  border-radius: 8px;
  padding: 0.75rem;
  height: 160px;
  display: flex;
  flex-direction: column;
`;

export const ChartTitle = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: right;
  margin-bottom: 0.5rem;
`;

export const ChartPlaceholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
`;

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const PortSection = styled.div``;

export const PortTitle = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.25rem;
  color: ${black[300]};
  margin: 0 0 1rem 0;
`;

export const PortInputRow = styled.div`
  display: flex;
  gap: 1rem;
`;

export const PortInputGroup = styled.div`
  flex: 1;
`;

export const PortLabel = styled.label`
  display: block;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  color: ${black[75]};
  margin-bottom: 0.5rem;
`;

export const PortInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${black[50]};
  border-radius: 8px;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  color: ${black[300]};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${primary.default};
  }
`;

export const FirewallSection = styled.div``;

export const FirewallTitle = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.25rem;
  color: ${black[300]};
  margin: 0 0 1rem 0;
`;

export const FirewallTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: ${black[75]};
  font-weight: ${fontWeights.medium};
  border-bottom: 1px solid ${black[50]};
`;

export const TableCell = styled.td`
  padding: 0.75rem 0.5rem;
  color: ${black[300]};
  border-bottom: 1px solid ${black[50]};
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

export const ModalTitle = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.25rem;
  color: ${black[300]};
  margin: 0;
`;

export const ModalText = styled.p`
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  color: ${black[75]};
  margin: 0;
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const SearchPreviewBox = styled.div`
  background: ${gray[50]};
  border: 1px solid ${gray[200]};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 24px;
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${black[50]};
    border-radius: 3px;
  }
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
`;

export const MemberInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const AvatarImage = styled.div<{ $imageUrl?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${black[50]};
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export const MemberName = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 14px;
  color: ${black[300]};
`;

export const OwnerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  background-color: #fef08a; /* Yellow-200 equivalent */
  color: #a16207; /* Yellow-700 equivalent */
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 11px;
  border-radius: 12px;
`;

export const KickButton = styled.button`
  background: none;
  border: none;
  padding: 6px 12px;
  color: #ef4444; /* Status Error Red */
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fef2f2; /* Red-50 */
  }
`;

