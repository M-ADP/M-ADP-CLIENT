'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/colors';

export default function ProjectLoading() {
  return (
    <Wrap>
      <Header />
      <Grid>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} />
        ))}
      </Grid>
    </Wrap>
  );
}

const shimmer = `
  background: linear-gradient(90deg, ${colors.black[50]} 0%, #f4f4f4 50%, ${colors.black[50]} 100%);
  background-size: 200% 100%;
  animation: projectShimmer 1.4s ease-in-out infinite;

  @keyframes projectShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const Wrap = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.div`
  width: 240px;
  height: 32px;
  border-radius: 8px;
  ${shimmer}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  height: 160px;
  border-radius: 16px;
  ${shimmer}
`;
