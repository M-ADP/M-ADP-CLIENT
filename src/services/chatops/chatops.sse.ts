import { SSEEvent } from '@/types/chatops';

const DIRECT_EVENT_TYPE_ALIASES: Record<string, string> = {
  response_stream_start: 'response.started',
  response_delta: 'response.delta',
  response_completed: 'response.completed',
  request_created: 'request.created',
  context_hydrated: 'context.hydrated',
  parsing_completed: 'parsing.completed',
  approval_required: 'approval.required',
  approval_rejected: 'approval.rejected',
  approval_superseded: 'approval.superseded',
  request_ambiguous: 'request.ambiguous',
  request_input_required: 'request.input_required',
  request_failed: 'request.failed',
  execution_started: 'execution.started',
  execution_completed: 'execution.completed',
  execution_failed: 'execution.failed',
};

function normalizeEventType(rawType: string, payload: Record<string, unknown>) {
  if (DIRECT_EVENT_TYPE_ALIASES[rawType]) {
    return DIRECT_EVENT_TYPE_ALIASES[rawType];
  }

  if (rawType === 'started') {
    if (payload.phase === 'execution') return 'execution.started';
    if (payload.phase === 'response') return 'response.started';
  }

  if (rawType === 'completed') {
    if (payload.phase === 'execution') return 'execution.completed';
    if (payload.phase === 'response' || typeof payload.final_response === 'string') {
      return 'response.completed';
    }
  }

  if (rawType === 'failed') {
    if (payload.phase === 'execution') return 'execution.failed';
    return 'request.failed';
  }

  return rawType;
}

export const normalizeSSEEvent = (input: unknown, fallbackType?: string): SSEEvent | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const payload = input as Record<string, unknown>;
  const rawType =
    typeof payload.type === 'string' && payload.type.trim().length > 0
      ? payload.type
      : fallbackType;

  if (!rawType) {
    return null;
  }

  return {
    ...payload,
    type: normalizeEventType(rawType, payload),
  } as SSEEvent;
};

