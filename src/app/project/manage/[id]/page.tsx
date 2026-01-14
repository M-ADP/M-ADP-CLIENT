import ProjectDetailContainer from '@/containers/project/detail/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectDetailContainer projectId={id} />;
}
