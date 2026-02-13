import PipelineListContainer from '@/containers/pipeline/list/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PipelinePage({ params }: PageProps) {
  const { id } = await params;
  return <PipelineListContainer projectId={id} />;
}
