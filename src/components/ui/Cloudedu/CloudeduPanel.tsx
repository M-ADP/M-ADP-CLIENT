'use client';

import { forwardRef, useState, useMemo, useEffect } from 'react';
import * as S from './style';
import { useCloudComparison } from '@/services/cloudedu/cloudedu.mutation';

interface Anchor {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

interface Props {
  anchor: Anchor;
  selectedText?: string;
}

const INTRO_DEFAULT =
  '무엇이든 물어보세요. 클라우드 개념부터 우리 플랫폼 사용법까지 도와드릴게요.';

const formatResponse = (data: unknown): string => {
  if (data == null) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const candidate = obj.message ?? obj.result ?? obj.data ?? obj.answer ?? obj.content;
    if (typeof candidate === 'string') return candidate;
    try {
      return JSON.stringify(candidate ?? data, null, 2);
    } catch {
      return String(data);
    }
  }
  return String(data);
};

const CloudeduPanel = forwardRef<HTMLDivElement, Props>(function CloudeduPanel(
  { anchor, selectedText },
  ref,
) {
  const [input, setInput] = useState('');
  const { mutate, data, error, isPending, reset } = useCloudComparison();

  useEffect(() => {
    if (!selectedText) return;
    reset();
    mutate({ function_type: selectedText });
  }, [selectedText, mutate, reset]);

  const introMessage = useMemo(() => {
    if (selectedText) return `"${selectedText}"에 대해 알아보고 있어요...`;
    return INTRO_DEFAULT;
  }, [selectedText]);

  const message = useMemo(() => {
    if (isPending) return '클라우드 EDU에게 물어보는 중...';
    if (error) return `요청 중 오류가 발생했어요. ${error instanceof Error ? error.message : ''}`.trim();
    if (data) return formatResponse(data);
    return introMessage;
  }, [isPending, error, data, introMessage]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isPending) return;
    reset();
    mutate({ function_type: trimmed });
    setInput('');
  };

  return (
    <S.Panel
      ref={ref}
      style={{
        position: 'fixed',
        left: anchor.left,
        top: anchor.top,
        right: anchor.right,
        bottom: anchor.bottom,
      }}
    >
      <S.PanelHeader>
        <S.PanelLogo src="/assets/cloudedu.png" alt="CloudEdu" />
        <S.PanelTitle>CloudEdu에게 물어보기</S.PanelTitle>
      </S.PanelHeader>

      <S.PanelBody>
        <S.PanelBodyLogo src="/assets/cloudedu.png" alt="" />
        <S.PanelMessage>{message}</S.PanelMessage>
      </S.PanelBody>

      <S.InputRow onSubmit={onSubmit}>
        <S.InputField
          placeholder="CPU 할당은 어느 정도 해야 해?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <S.SendButton
          type="submit"
          disabled={!input.trim() || isPending}
          aria-label="보내기"
        >
          ➤
        </S.SendButton>
      </S.InputRow>
    </S.Panel>
  );
});

export default CloudeduPanel;
