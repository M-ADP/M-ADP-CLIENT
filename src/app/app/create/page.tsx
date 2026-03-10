import AppCreateContainer from '@/containers/app/create/ui';
import { Suspense } from 'react';

export default function AppCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppCreateContainer />
    </Suspense>
  );
}