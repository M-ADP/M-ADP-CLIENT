import { useQuery } from '@tanstack/react-query';
import { getSessions, getSession, getSessionMessages, getRequestEvents } from './chatops.api';

export const chatopsKeys = {
  all: ['chatops'] as const,
  sessions: () => [...chatopsKeys.all, 'sessions'] as const,
  sessionDetails: () => [...chatopsKeys.all, 'session'] as const,
  sessionDetail: (id: string | null) => [...chatopsKeys.sessionDetails(), id] as const,
  sessionMessages: (id: string | null) => [...chatopsKeys.sessionDetails(), id, 'messages'] as const,
  requestEvents: (sessionId: string | null, requestId: string | null) =>
    [...chatopsKeys.all, 'request-events', sessionId, requestId] as const,
};

export const useSessions = () => {
  return useQuery({
    queryKey: chatopsKeys.sessions(),
    queryFn: () => getSessions(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const useSession = (sessionId: string | null) => {
  return useQuery({
    queryKey: chatopsKeys.sessionDetail(sessionId),
    queryFn: () => {
      if (sessionId === null) throw new Error('sessionId is null');
      return getSession(sessionId);
    },
    enabled: sessionId !== null,
  });
};

export const useSessionMessages = (sessionId: string | null, before?: string) => {
  return useQuery({
    queryKey: [...chatopsKeys.sessionMessages(sessionId), { before }],
    queryFn: () => {
      if (sessionId === null) throw new Error('sessionId is null');
      return getSessionMessages(sessionId, before);
    },
    enabled: sessionId !== null,
  });
};

export const useRequestEvents = (sessionId: string | null, requestId: string | null) => {
  return useQuery({
    queryKey: chatopsKeys.requestEvents(sessionId, requestId),
    queryFn: () => {
      if (sessionId === null || requestId === null) {
        throw new Error('sessionId or requestId is null');
      }
      return getRequestEvents(sessionId, requestId, 100);
    },
    enabled: sessionId !== null && requestId !== null,
    staleTime: 5_000,
  });
};
