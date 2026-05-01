import TableDetailContainer from '@/containers/cloud-database/detail/ui';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string; cloudDbId: string }>;
}

export default async function CloudDatabaseDetailPage({ params }: PageProps) {
  const { id, cloudDbId } = await params;
  return <TableDetailContainer projectId={id} cloudDbId={cloudDbId} />;
}
