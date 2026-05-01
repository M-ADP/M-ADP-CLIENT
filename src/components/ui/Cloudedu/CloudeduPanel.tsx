'use client';

import { forwardRef, useState, useMemo } from 'react';
import * as S from './style';

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

const MOCK_INTRO = (text?: string) =>
  text
    ? `${text}는\n인프라 설정 없이 원클릭 배포가 되는 서비스입니다.\n\n유사 서비스\nAWS: Elastic Beanstalk\nGCP: App Engine\nAzure: App Service\n\n해당 기능 추천 클라우드 서비스: AWS > GCP > Azure`
    : '무엇이든 물어보세요. 클라우드 개념부터 우리 플랫폼 사용법까지 도와드릴게요.';

const CloudeduPanel = forwardRef<HTMLDivElement, Props>(function CloudeduPanel(
  { anchor, selectedText },
  ref,
) {
  const [input, setInput] = useState('');
  const message = useMemo(() => MOCK_INTRO(selectedText), [selectedText]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <S.SendButton type="submit" disabled={!input.trim()} aria-label="보내기">
          ➤
        </S.SendButton>
      </S.InputRow>
    </S.Panel>
  );
});

export default CloudeduPanel;
