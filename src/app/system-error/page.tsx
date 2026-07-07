import type { Metadata } from 'next';
import ServiceErrorPage from '@/components/ui/ServiceErrorPage/ui';

export const metadata: Metadata = {
  title: '준비 중 | M-ADP',
  description: 'M-ADP 준비 중 안내 페이지',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SystemErrorPage() {
  return (
    <ServiceErrorPage
      eyebrow="M-ADP 안내"
      title="서비스 준비 중"
      notices={[
        '잠시 후 다시 접속해 주세요.',
        '새로고침 후 다시 시도해 주세요.',
        '기다리는 동안 위 공룡 게임을 할 수 있어요.',
      ]}
      primaryAction={{
        label: '홈으로 돌아가기',
        href: '/',
      }}
      showMiniGame
    />
  );
}
