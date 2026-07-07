'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal/ui';
import Button from '@/components/ui/Button/ui';
import * as S from './style';

const STORAGE_KEY = 'madp:hasSeenDocsGuide';

const emptySubscribe = () => () => {};

const readHasSeen = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
};

export default function FirstVisitGuide() {
  const router = useRouter();

  const hasSeen = useSyncExternalStore(emptySubscribe, readHasSeen, () => true);
  const [dismissed, setDismissed] = useState(false);

  const open = !hasSeen && !dismissed;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // 저장에 실패해도 팝업은 닫는다.
    }
    setDismissed(true);
  };

  const handleViewGuide = () => {
    dismiss();
    router.push('/docs');
  };

  return (
    <Modal open={open} onClose={dismiss} width={440} height="auto">
      <S.Content>
        <S.Title>M-ADP가 처음이신가요?</S.Title>
        <S.Description>
          사용 가이드에서 프로젝트 생성부터 앱 배포까지 핵심 흐름을 5분 만에
          익힐 수 있어요.
        </S.Description>
        <S.Actions>
          <Button variant="cancel" onClick={dismiss}>
            다음에 볼게요
          </Button>
          <Button variant="confirm" onClick={handleViewGuide}>
            가이드 보기
          </Button>
        </S.Actions>
      </S.Content>
    </Modal>
  );
}
