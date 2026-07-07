'use client';

import ServiceErrorPage from '@/components/ui/ServiceErrorPage/ui';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  void error;

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ServiceErrorPage
          eyebrow="잠시만 기다려 주세요"
          title="잠시 문제가 생겼어요."
          description="새로고침하거나 잠시 후 다시 시도해 주세요."
          primaryAction={{
            label: '다시 시도',
            onClick: reset,
          }}
          secondaryAction={{
            label: '홈으로 돌아가기',
            href: '/',
          }}
        />
      </body>
    </html>
  );
}
