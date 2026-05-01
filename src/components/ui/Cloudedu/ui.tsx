'use client';

import { useEffect, useRef, useState } from 'react';
import { useCloudeduTrigger } from '@/hooks/useCloudeduTrigger';
import * as S from './style';
import CloudeduPanel from './CloudeduPanel';

const PANEL_WIDTH = 360;
const PANEL_OFFSET = 12;

export default function Cloudedu() {
  const { trigger, dismiss } = useCloudeduTrigger({ idleDelayMs: 8000 });
  const [panel, setPanel] = useState<
    | { source: 'selection'; text: string; left: number; top: number }
    | { source: 'idle' }
    | null
  >(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openSelectionPanel = () => {
    if (trigger?.type !== 'selection') return;
    const left = Math.min(
      Math.max(trigger.x - PANEL_WIDTH / 2, 16),
      window.innerWidth - PANEL_WIDTH - 16,
    );
    const top = trigger.bottom + PANEL_OFFSET;
    setPanel({ source: 'selection', text: trigger.text, left, top });
    dismiss();
  };

  const openIdlePanel = () => {
    setPanel({ source: 'idle' });
    dismiss();
  };

  const closePanel = () => setPanel(null);

  useEffect(() => {
    if (!panel) return;
    const onMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [panel]);

  return (
    <>
      {trigger?.type === 'idle' && !panel && (
        <S.IdleCard role="dialog" aria-live="polite">
          <S.IdleHeader>
            <S.Avatar>
              <S.Sparkle>✨</S.Sparkle>
            </S.Avatar>
            <div>
              <S.IdleTitle>cloudedu에게 물어볼까요?</S.IdleTitle>
              <S.IdleSubtitle>막힌 부분이 있다면 도와드릴게요.</S.IdleSubtitle>
            </div>
          </S.IdleHeader>
          <S.IdleActions>
            <S.GhostAction onClick={dismiss}>나중에</S.GhostAction>
            <S.PrimaryAction onClick={openIdlePanel}>물어보기</S.PrimaryAction>
          </S.IdleActions>
        </S.IdleCard>
      )}

      {trigger?.type === 'selection' && !panel && (
        <S.SelectionBubble
          style={{
            position: 'fixed',
            left: trigger.x,
            top: trigger.y,
            transform: 'translate(-50%, calc(-100% - 10px))',
          }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={openSelectionPanel}
        >
          <img src="/assets/cloudedu.png" alt="" width={14} height={14} />
          CloudEdu에게 물어보기
        </S.SelectionBubble>
      )}

      {panel && (
        <CloudeduPanel
          ref={panelRef}
          anchor={
            panel.source === 'selection'
              ? { left: panel.left, top: panel.top }
              : { right: 24, bottom: 24 }
          }
          selectedText={panel.source === 'selection' ? panel.text : undefined}
        />
      )}
    </>
  );
}
