import CreateDatabaseContainer from '@/containers/cloud-database/create/ui';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CloudDatabaseCreatePage({ params }: PageProps) {
  const { id } = await params;
  return <CreateDatabaseContainer projectId={id} />;
}
