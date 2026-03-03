import styled from '@emotion/styled';
import { black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const Container = styled.div`
  padding: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 2rem;
  color: ${black[300]};
  margin: 0 0 1.5rem 0;
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const SearchWrapper = styled.div`
  flex: 1;
  max-width: 400px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.p`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 1rem;
  color: ${black[100]};
  margin: 0;
`;
