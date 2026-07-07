import { notFound } from 'next/navigation';
import AgentClient from '../AgentClient';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function AgentSessionPage({ params }: PageProps) {
  const { sessionId } = await params;

  if (!sessionId || !/^\d+$/.test(sessionId)) {
    notFound();
  }

  return <AgentClient key={sessionId} sessionId={sessionId} />;
}
