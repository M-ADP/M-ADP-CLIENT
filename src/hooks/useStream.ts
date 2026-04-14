import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const useStream = (sessionId: number, requestId: number | null) => {
  const { setIsStreaming, appendStreamingText } = useChatStore();
  const lastEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (requestId === null) return;

    const abortController = new AbortController();
    let streamActive = true;

    const connect = async () => {
      try {
        const token = Cookies.get('token');
        const headers: Record<string, string> = {
          'Accept': 'text/event-stream',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        if (lastEventIdRef.current) {
          headers['Last-Event-ID'] = lastEventIdRef.current;
        }

        const url = `${BASE_URL}/sessions/${sessionId}/requests/${requestId}/stream?follow=true`;

        const response = await fetch(url, {
          headers,
          signal: abortController.signal,
        });

        if (!response.body) {
          console.error('ReadableStream not supported');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let currentEvent = 'message';

        while (streamActive) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let eventIndex;
          while ((eventIndex = buffer.indexOf('\n\n')) !== -1) {
            const chunk = buffer.slice(0, eventIndex);
            buffer = buffer.slice(eventIndex + 2);

            const lines = chunk.split('\n');
            currentEvent = 'message';
            let currentData = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                currentEvent = line.replace(/^event:\s*/, '');
              } else if (line.startsWith('data:')) {
                const dataPart = line.replace(/^data:\s*/, '');
                currentData += currentData ? '\n' + dataPart : dataPart;
              } else if (line.startsWith('id:')) {
                lastEventIdRef.current = line.replace(/^id:\s*/, '');
              }
            }

            if (currentEvent === 'response.started') {
              setIsStreaming(true);
            } else if (currentEvent === 'response.delta') {
              try {
                const parsed = JSON.parse(currentData);
                if (parsed.text) {
                  appendStreamingText(parsed.text);
                }
              } catch (e) {
                // Ignore parse error, maybe not JSON
                console.warn('Failed to parse SSE delta', e, currentData);
              }
            } else if (currentEvent === 'response.completed') {
              setIsStreaming(false);
              // clearStreamingText()는 호출하지 않음 (요구사항)
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Unmounted, ignore
        } else {
          console.error('SSE Error:', err);
        }
      }
    };

    connect();

    return () => {
      streamActive = false;
      abortController.abort();
    };
  }, [sessionId, requestId, setIsStreaming, appendStreamingText]);
};
