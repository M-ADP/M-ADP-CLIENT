import {
  ConversationMessage,
  SSEEventRecord,
  TaskSnapshot,
} from '@/types/chatops';

export const PAUSE_EVENT_TYPES = new Set([
  'approval.required',
  'request.input_required',
  'request.ambiguous',
]);

export const ACTIONABLE_TASK_ACTIONS = new Set([
  'approve',
  'cancel',
  'edit',
  'fill_inputs',
  'choose_option',
]);

export const TERMINAL_APPROVAL_STATES = new Set([
  'completed',
  'failed',
  'cancelled',
  'expired',
]);

export function createFallbackTask(
  eventType: string | null,
  eventMessage?: string | null
): TaskSnapshot | null {
  if (eventType === 'approval.required') {
    return {
      kind: 'approval',
      title: '승인 필요',
      status: 'interrupted',
      request_type: null,
      approval_state: 'pending',
      operation_id: null,
      risk_level: null,
      target: null,
      filled_inputs: null,
      missing_inputs: null,
      next_actions: ['approve', 'cancel'],
      summary: eventMessage || '이 작업을 실행하려면 승인이 필요합니다.',
      clarification_type: null,
      is_ambiguous: false,
    };
  }

  return null;
}

export function getLatestTaskFromEvents(
  events: SSEEventRecord[],
  requestId: string | null
): TaskSnapshot | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index].event;

    if (requestId !== null && event.request_id !== requestId) {
      continue;
    }

    if ('task' in event && event.task) {
      return event.task;
    }
  }

  return null;
}

export function getLatestTaskFromMessages(
  messages: ConversationMessage[],
  requestId: string | null
): TaskSnapshot | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (requestId !== null && message.request_id !== requestId) {
      continue;
    }

    if (message.task) {
      return message.task;
    }
  }

  return null;
}

export function getLatestAssistantMessage(
  messages: ConversationMessage[],
  requestId: string | null
): ConversationMessage | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (requestId !== null && message.request_id !== requestId) {
      continue;
    }

    if (message.role === 'assistant') {
      return message;
    }
  }

  return null;
}

export function taskNeedsUserAction(task: TaskSnapshot | null | undefined): boolean {
  if (!task) {
    return false;
  }

  if (task.approval_state === 'pending' || task.approval_state === 'not_ready') {
    return true;
  }

  return task.next_actions.some((action) => ACTIONABLE_TASK_ACTIONS.has(action));
}

export function isTerminalApprovalState(task: TaskSnapshot | null | undefined): boolean {
  if (!task) {
    return false;
  }

  return TERMINAL_APPROVAL_STATES.has(task.approval_state);
}
