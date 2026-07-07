import { Suspense } from 'react';
import AppManageContainer from '@/containers/app/manage/ui';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppManagePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense>
      <AppManageContainer projectId={id} />
    </Suspense>
  );
}
