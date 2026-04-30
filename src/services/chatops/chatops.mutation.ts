import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postSessionMessage, approveRequest, rejectRequest, createSession, deleteSession } from './chatops.api';
import { chatopsKeys } from './chatops.query';
import { SessionListResponse } from '@/types/chatops';
import { useChatStore } from '@/store/chatStore';

const removeSessionFromList = (
  previous: SessionListResponse | undefined,
  sessionId: number
): SessionListResponse | undefined => {
  if (!previous) return previous;

  return {
    ...previous,
    sessions: previous.sessions.filter((session) => session.session_id !== sessionId),
  };
};

export const usePostMessage = () => {
  return useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: number; message: string }) =>
      postSessionMessage(sessionId, message),
  });
};

export const useApproveRequest = () => {
  return useMutation({
    mutationFn: ({ sessionId, requestId, confirmationText }: { sessionId: number; requestId: number; confirmationText?: string }) =>
      approveRequest(sessionId, requestId, confirmationText),
  });
};

export const useRejectRequest = () => {
  return useMutation({
    mutationFn: ({ sessionId, requestId }: { sessionId: number; requestId: number }) =>
      rejectRequest(sessionId, requestId),
  });
};

export const useCreateSession = () => {
  return useMutation({
    mutationFn: ({ title }: { title?: string }) => createSession(title),
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const hideDeletedSession = useChatStore((state) => state.hideDeletedSession);
  const restoreDeletedSession = useChatStore((state) => state.restoreDeletedSession);

  return useMutation({
    mutationFn: ({ sessionId }: { sessionId: number }) => deleteSession(sessionId),
    onMutate: async ({ sessionId }) => {
      await queryClient.cancelQueries({ queryKey: chatopsKeys.sessions() });
      hideDeletedSession(sessionId);

      const previousSessions = queryClient.getQueryData<SessionListResponse>(chatopsKeys.sessions());

      queryClient.setQueryData<SessionListResponse | undefined>(
        chatopsKeys.sessions(),
        (current) => removeSessionFromList(current, sessionId)
      );

      return { previousSessions };
    },
    onError: (_error, _variables, context) => {
      restoreDeletedSession(_variables.sessionId);
      if (!context?.previousSessions) return;

      queryClient.setQueryData(chatopsKeys.sessions(), context.previousSessions);
    },
    onSuccess: (_data, { sessionId }) => {
      queryClient.removeQueries({ queryKey: chatopsKeys.sessionDetail(sessionId) });
      queryClient.removeQueries({ queryKey: chatopsKeys.sessionMessages(sessionId), exact: false });
      queryClient.removeQueries({ queryKey: ['chatops', 'request-events', sessionId], exact: false });
    },
  });
};
