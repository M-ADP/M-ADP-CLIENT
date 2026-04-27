import { notFound } from 'next/navigation';
import AgentClient from '../../AgentClient';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function AgentSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const numericId = Number(sessionId);

  if (!Number.isFinite(numericId) || numericId <= 0) {
    notFound();
  }

  return <AgentClient key={numericId} sessionId={numericId} />;
}
