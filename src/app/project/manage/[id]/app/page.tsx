import AppManageContainer from '@/containers/app/manage/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppManagePage({ params }: PageProps) {
  const { id } = await params;
  return <AppManageContainer projectId={id} />;
}
