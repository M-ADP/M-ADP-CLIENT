import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { isTerminalSSEEvent, isTerminalStatus, SSEEvent } from '@/types/chatops';
import { normalizeSSEEvent } from '@/services/chatops/chatops.sse';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;

/**
 * SSE 스트림 훅 — 백엔드 계약(2026-04-15) 기준.
 *
 * - DB 기반 재생이므로 Last-Event-ID 재연결이 안전하다.
 * - terminal status 수신 시 자동 종료한다.
 * - keep-alive(`: keep-alive\n`) 코멘트는 무시한다.
 */
export const useStream = (sessionId: number, requestId: number | null) => {
  const { updateFromSSE } = useChatStore();
  const lastSequenceRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const activeRef = useRef(false);
  const terminalRef = useRef(false);

  // store의 lastSequence와 동기화
  const storeLastSequence = useChatStore((s) => s.lastSequence);
  const storeRequestStatus = useChatStore((s) => s.requestStatus);
  useEffect(() => {
    if (storeLastSequence !== null) {
      lastSequenceRef.current = String(storeLastSequence);
    }
  }, [storeLastSequence]);

  useEffect(() => {
    if (storeRequestStatus && isTerminalStatus(storeRequestStatus)) {
      terminalRef.current = true;
      activeRef.current = false;
      abortRef.current?.abort();
    }
  }, [storeRequestStatus]);

  const connect = useCallback(async () => {
    if (!activeRef.current || !requestId) return;
    if (storeRequestStatus && isTerminalStatus(storeRequestStatus)) {
      terminalRef.current = true;
      activeRef.current = false;
      return;
    }

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      terminalRef.current = false;

      const token = Cookies.get('token');
      const headers: Record<string, string> = {
        Accept: 'text/event-stream',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams({ follow: 'true' });
      if (lastSequenceRef.current) {
        headers['Last-Event-ID'] = lastSequenceRef.current;
        params.set('last_event_id', lastSequenceRef.current);
      }
      const url = `${BASE_URL}/chatops/sessions/${sessionId}/requests/${requestId}/stream?${params.toString()}`;

      const response = await fetch(url, {
        headers,
        signal: abortController.signal,
      });

      if (!response.ok) {
        console.error(`[SSE] HTTP ${response.status}`);
        // 4xx는 재시도 불가
        if (response.status >= 400 && response.status < 500) return;
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) {
        console.error('[SSE] ReadableStream not supported');
        return;
      }

      // 연결 성공 → 재시도 카운터 리셋
      retryCountRef.current = 0;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (activeRef.current) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');

        let boundaryIdx: number;
        while ((boundaryIdx = buffer.indexOf('\n\n')) !== -1) {
          const rawChunk = buffer.slice(0, boundaryIdx);
          buffer = buffer.slice(boundaryIdx + 2);

          const lines = rawChunk.split('\n');

          // keep-alive 감지: 코멘트만 있는 프레임
          const isKeepAlive = lines.every(
            (l) => l.startsWith(':') || l.trim() === ''
          );
          if (isKeepAlive) continue;

          let dataStr = '';
          let eventId: string | null = null;
          let eventType: string | null = null;

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.replace(/^event:\s*/, '');
            } else if (line.startsWith('data:')) {
              const part = line.replace(/^data:\s*/, '');
              dataStr += dataStr ? '\n' + part : part;
            } else if (line.startsWith('id:')) {
              eventId = line.replace(/^id:\s*/, '');
            }
            // `:` 로 시작하는 코멘트 라인은 무시
          }

          // data가 없으면 skip
          if (!dataStr) continue;

          // JSON 파싱
          let parsed: SSEEvent;
          try {
            const normalized = normalizeSSEEvent(JSON.parse(dataStr), eventType ?? undefined);
            if (!normalized) {
              continue;
            }
            parsed = normalized;
          } catch {
            console.warn('[SSE] JSON parse failed:', dataStr);
            continue;
          }

          const sequence =
            eventId && Number.isFinite(Number(eventId)) ? Number(eventId) : null;
          if (sequence !== null) {
            lastSequenceRef.current = String(sequence);
          }

          // store 갱신 (모든 이벤트 타입 일괄 처리)
          updateFromSSE(parsed, sequence);

          // terminal 이벤트/상태 감지 → 스트림 종료
          if (isTerminalSSEEvent(parsed)) {
            terminalRef.current = true;
            activeRef.current = false;
            reader.cancel();
            return;
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // 컴포넌트 언마운트
      }
      console.error('[SSE] Error:', err);
    }

    // 비정상 종료 → 재연결 시도
    if (activeRef.current && !terminalRef.current && retryCountRef.current < MAX_RETRIES) {
      const delay = INITIAL_BACKOFF_MS * Math.pow(2, retryCountRef.current);
      retryCountRef.current += 1;
      console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${retryCountRef.current}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (activeRef.current) {
        connect();
      }
    }
  }, [sessionId, requestId, storeRequestStatus, updateFromSSE]);

  useEffect(() => {
    if (requestId === null) return;

    activeRef.current = true;
    retryCountRef.current = 0;
    connect();

    return () => {
      activeRef.current = false;
      terminalRef.current = false;
      abortRef.current?.abort();
    };
  }, [sessionId, requestId, connect]);
};
