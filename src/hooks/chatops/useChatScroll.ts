import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseChatScrollParams {
  latestMessageId: string | null;
  latestMessageText: string | null | undefined;
  latestUserMessageId: string | null;
  scrollToLatestToken: number;
}

export function useChatScroll({
  latestMessageId,
  latestMessageText,
  latestUserMessageId,
  scrollToLatestToken,
}: UseChatScrollParams) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const hasSentRef = useRef(false);
  const [spacerHeight, setSpacerHeight] = useState(0);

  // spacer = max(0, viewport - (마지막 유저 메시지 ~ 마지막 콘텐츠 끝))
  useLayoutEffect(() => {
    const container = scrollRef.current;
    const userMsg = lastUserMsgRef.current;

    if (!container || !userMsg) {
      setSpacerHeight(0);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;

    const userMsgRect = userMsg.getBoundingClientRect();
    const userMsgTop = userMsgRect.top - containerRect.top + scrollTop;

    const lastEl = latestMessageRef.current ?? userMsg;
    const lastElRect = lastEl.getBoundingClientRect();
    const lastElBottom = lastElRect.top - containerRect.top + scrollTop + lastElRect.height;

    const heightFromUserMsg = lastElBottom - userMsgTop;
    const needed = container.clientHeight - heightFromUserMsg;

    setSpacerHeight(Math.max(0, needed));
  }, [latestMessageId, latestMessageText, latestUserMessageId]);

  const scrollUserMsgToTop = useCallback((behavior: ScrollBehavior) => {
    const container = scrollRef.current;
    const element = lastUserMsgRef.current;
    if (!container || !element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top - containerRect.top + container.scrollTop;

    container.scrollTo({
      top: Math.max(0, elementTop - 24),
      behavior,
    });
  }, []);

  // 유저가 메시지 전송 시에만 → 유저 메시지 상단 정렬 (마운트 시 실행 안 함)
  useEffect(() => {
    if (!hasSentRef.current) {
      hasSentRef.current = true;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      scrollUserMsgToTop('smooth');
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scrollToLatestToken, scrollUserMsgToTop]);

  // AI 응답 스트리밍 중 → 뷰포트 밖으로 나간 경우에만 스크롤
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [latestMessageId, latestMessageText]);

  return {
    scrollRef,
    latestMessageRef,
    lastUserMsgRef,
    spacerHeight,
  };
}
