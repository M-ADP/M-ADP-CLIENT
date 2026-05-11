'use client';

import styled from '@emotion/styled';

interface PageTransitionProps {
  routeKey: string;
  children: React.ReactNode;
}

export default function PageTransition({ routeKey, children }: PageTransitionProps) {
  return <Wrapper key={routeKey}>{children}</Wrapper>;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  animation: pageEnter 180ms ease-out;
  will-change: opacity;

  @keyframes pageEnter {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
