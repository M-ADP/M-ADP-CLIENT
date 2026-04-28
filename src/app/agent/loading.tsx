'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/colors';

export default function AgentLoading() {
  return (
    <Container>
      <Stack>
        <Pulse $w="60%" $h="32px" />
        <Pulse $w="40%" $h="20px" />
      </Stack>
      <Composer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 32px;
  padding: 24px;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 720px;
  align-items: center;
`;

const Pulse = styled.div<{ $w: string; $h: string }>`
  width: ${({ $w }) => $w};
  height: ${({ $h }) => $h};
  border-radius: 8px;
  background: linear-gradient(90deg, ${colors.black[50]} 0%, #f4f4f4 50%, ${colors.black[50]} 100%);
  background-size: 200% 100%;
  animation: agentShimmer 1.4s ease-in-out infinite;

  @keyframes agentShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const Composer = styled.div`
  width: 100%;
  max-width: 720px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(90deg, ${colors.black[50]} 0%, #f4f4f4 50%, ${colors.black[50]} 100%);
  background-size: 200% 100%;
  animation: agentShimmer 1.4s ease-in-out infinite;
`;
