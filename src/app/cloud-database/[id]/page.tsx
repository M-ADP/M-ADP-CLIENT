import TableDetailContainer from '@/containers/cloud-database/detail/ui';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DatabaseDetailPage({ params }: Props) {
  const { id } = await params;
  return <TableDetailContainer databaseId={id} />;
}
