import styled from '@emotion/styled';
import { black, primary, status } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const Card = styled.div`
  border: 1px solid ${black[50]};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${primary.default};
    box-shadow: 0 4px 12px rgba(3, 9, 130, 0.1);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1.125rem;
  color: ${black[300]};
  margin: 0 0 0.5rem 0;
`;

export const ArrowIcon = styled.span`
  color: ${black[75]};
  font-size: 1.5rem;
  line-height: 1;
`;

export const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[75]};
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 2.75rem;
`;

export const FooterMessage = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.75rem;
  color: ${black[100]};
`;

const getStatusColor = (variant?: 'healthy' | 'unhealthy' | 'warning') => {
  if (variant && variant in status) {
    return status[variant];
  }
  return black[75];
};

export const StatusBadge = styled.span<{ $variant?: 'healthy' | 'unhealthy' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${FONT_FAMILY};
  font-size: 0.75rem;
  color: ${({ $variant }) => getStatusColor($variant)};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $variant }) => getStatusColor($variant)};
  }
`;
