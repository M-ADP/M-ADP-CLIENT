import GithubConnectContainer from '@/containers/app/github-connect/ui';
import { Suspense } from 'react';

export default function GithubConnectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GithubConnectContainer />
    </Suspense>
  );
}
