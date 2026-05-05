'use client';

import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigationStore } from '@/store/navigationStore';

export default function TopProgressBar() {
  const fetchingCount = useIsFetching();
  const navPending = useNavigationStore((s) => s.pendingCount);
  const isActive = fetchingCount > 0 || navPending > 0;

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: number | undefined;
    let trickle: number | undefined;

    if (isActive) {
      setVisible(true);
      setProgress((p) => (p < 10 ? 15 : p));
      trickle = window.setInterval(() => {
        setProgress((p) => (p < 85 ? p + (90 - p) * 0.08 : p));
      }, 200);
    } else if (visible) {
      setProgress(100);
      timer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      if (trickle) window.clearInterval(trickle);
    };
  }, [isActive, visible]);

  if (!visible) return null;

  return <Bar style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }} />;
}

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #00c2ff 0%, #1174f7 50%, #030982 100%);
  box-shadow: 0 0 8px rgba(0, 194, 255, 0.6);
  z-index: 9999;
  transition: width 200ms ease-out, opacity 200ms ease-out;
  pointer-events: none;
`;
