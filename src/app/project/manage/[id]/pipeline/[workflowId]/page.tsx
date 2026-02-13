import PipelineDetailContainer from '@/containers/pipeline/detail/ui';

interface PageProps {
  params: Promise<{ id: string; workflowId: string }>;
}

export default async function PipelineDetailPage({ params }: PageProps) {
  const { id, workflowId } = await params;
  return <PipelineDetailContainer projectId={id} workflowId={workflowId} />;
}
