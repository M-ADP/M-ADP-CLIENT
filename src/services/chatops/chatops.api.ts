import { api } from '@/utils/api';
import {
  SessionListResponse,
  SessionDetailResponse,
  CreateSessionMessageResponse,
  ApproveRequestResponse,
  RejectRequestResponse,
  RequestEventsResponse,
} from '@/types/chatops';

export const getSessions = async (limit?: number, cursor?: string) => {
  const query = new URLSearchParams();
  if (limit !== undefined) query.append('limit', limit.toString());
  if (cursor) query.append('cursor', cursor);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return api<SessionListResponse>(`/chatops/sessions${queryString}`, { method: 'GET' });
};

export const createSession = async (title?: string) => {
  return api<{ session_id: string; title: string | null; status: string }>(`/chatops/sessions`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
};

export const deleteSession = async (sessionId: string) => {
  return api<Record<string, never>>(`/chatops/sessions/${sessionId}`, {
    method: 'DELETE',
  });
};

export const getSession = async (sessionId: string, limit?: number) => {
  const query = new URLSearchParams();
  if (limit !== undefined) query.append('limit', limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return api<SessionDetailResponse>(`/chatops/sessions/${sessionId}${queryString}`, { method: 'GET' });
};

export const getSessionMessages = async (sessionId: string, before?: string, limit?: number) => {
  const query = new URLSearchParams();
  if (before) query.append('before', before);
  if (limit !== undefined) query.append('limit', limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return api<{ messages: unknown[]; next_cursor: string | null; has_more: boolean }>(`/chatops/sessions/${sessionId}/messages${queryString}`, { method: 'GET' });
};

export const postSessionMessage = async (sessionId: string, message: string) => {
  return api<CreateSessionMessageResponse>(`/chatops/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};

export const approveRequest = async (sessionId: string, requestId: string, confirmationText?: string) => {
  return api<ApproveRequestResponse>(`/chatops/sessions/${sessionId}/requests/${requestId}/approve`, {
    method: 'POST',
    body: JSON.stringify(confirmationText ? { confirmation_text: confirmationText } : {}),
  });
};

export const rejectRequest = async (sessionId: string, requestId: string) => {
  return api<RejectRequestResponse>(`/chatops/sessions/${sessionId}/requests/${requestId}/reject`, {
    method: 'POST',
  });
};

export const getRequestEvents = async (
  sessionId: string,
  requestId: string,
  limit?: number,
  offset?: number
) => {
  const query = new URLSearchParams();
  if (limit !== undefined) query.append('limit', limit.toString());
  if (offset !== undefined) query.append('offset', offset.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return api<RequestEventsResponse>(
    `/chatops/sessions/${sessionId}/requests/${requestId}/events${queryString}`,
    { method: 'GET' }
  );
};
