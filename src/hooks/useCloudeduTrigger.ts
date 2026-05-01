'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type CloudeduTrigger =
  | { type: 'idle' }
  | { type: 'selection'; text: string; x: number; y: number; bottom: number };

interface Options {
  idleDelayMs?: number;
}

export function useCloudeduTrigger({ idleDelayMs = 8000 }: Options = {}) {
  const [trigger, setTrigger] = useState<CloudeduTrigger | null>(null);
  const triggerRef = useRef<CloudeduTrigger | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedIdleRef = useRef(false);

  triggerRef.current = trigger;

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    if (dismissedIdleRef.current) return;
    idleTimerRef.current = setTimeout(() => {
      if (triggerRef.current) return;
      setTrigger({ type: 'idle' });
    }, idleDelayMs);
  }, [clearIdleTimer, idleDelayMs]);

  const dismiss = useCallback(() => {
    setTrigger((prev) => {
      if (prev?.type === 'idle') {
        dismissedIdleRef.current = true;
      }
      return null;
    });
    clearIdleTimer();
  }, [clearIdleTimer]);

  useEffect(() => {
    const onActivity = () => {
      if (triggerRef.current) return;
      dismissedIdleRef.current = false;
      startIdleTimer();
    };

    const onMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? '';
      if (!text || !sel || sel.rangeCount === 0) return;
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      setTrigger({
        type: 'selection',
        text,
        x: rect.left + rect.width / 2,
        y: rect.top,
        bottom: rect.bottom,
      });
    };

    const onSelectionChange = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? '';
      if (!text) {
        setTrigger((prev) => (prev?.type === 'selection' ? null : prev));
      }
    };

    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('scroll', onActivity, true);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('selectionchange', onSelectionChange);

    startIdleTimer();

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('scroll', onActivity, true);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('selectionchange', onSelectionChange);
      clearIdleTimer();
    };
  }, [startIdleTimer, clearIdleTimer]);

  return { trigger, dismiss };
}
