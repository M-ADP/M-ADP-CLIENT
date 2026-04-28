'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useEffect, useRef } from 'react';
import { useNavigationStore } from '@/store/navigationStore';

export const useTransitionRouter = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { start, finish } = useNavigationStore();
  const startedRef = useRef(false);

  useEffect(() => {
    if (isPending && !startedRef.current) {
      startedRef.current = true;
      start();
    } else if (!isPending && startedRef.current) {
      startedRef.current = false;
      finish();
    }
  }, [isPending, start, finish]);

  useEffect(() => {
    return () => {
      if (startedRef.current) {
        finish();
      }
    };
  }, [finish]);

  return {
    push: (href: string) => startTransition(() => router.push(href)),
    replace: (href: string) => startTransition(() => router.replace(href)),
    prefetch: (href: string) => router.prefetch(href),
    back: () => startTransition(() => router.back()),
    isPending,
  };
};
