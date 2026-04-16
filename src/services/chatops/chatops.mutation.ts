import { useMutation } from '@tanstack/react-query';
import { postSessionMessage, approveRequest, rejectRequest, createSession, deleteSession } from './chatops.api';

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
  return useMutation({
    mutationFn: ({ sessionId }: { sessionId: number }) => deleteSession(sessionId),
  });
};
