export interface TaskInputField {
  key: string;
  label: string;
  value?: unknown;
}

export interface TaskSnapshot {
  kind: string;
  title: string;
  status: string;
  request_type: string | null;
  approval_state: string;
  operation_id: string | null;
  risk_level: string | null;
  target: Record<string, unknown> | null;
  filled_inputs: Record<string, unknown> | null;
  missing_inputs: TaskInputField[] | null;
  next_actions: string[];
  summary: string | null;
  clarification_type: string | null;
  is_ambiguous: boolean;
}

export interface ConversationMessage {
  message_id: string;
  request_id: number | null;
  role: 'user' | 'assistant';
  type: 'text' | 'task';
  text: string | null;
  task: TaskSnapshot | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SessionListItem {
  session_id: number;
  title: string | null;
  status: string;
  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface SessionInfo {
  session_id: number;
  user_id: string;
  title: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface SessionListResponse {
  sessions: SessionListItem[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface SessionDetailResponse {
  session: SessionInfo;
  messages: ConversationMessage[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface CreateSessionMessageResponse {
  request_id?: number | null;
  request_status?: string | null;
  request_type?: string | null;
  final_response?: string | null;
  task?: TaskSnapshot | null;
  messages: ConversationMessage[];
}

export interface ApproveRequestResponse {
  request_id: number;
  status: string;
  assistant_message: string | null;
  task: TaskSnapshot | null;
}

export interface RejectRequestResponse {
  request_id: number;
  status: string;
  assistant_message: string | null;
  task: TaskSnapshot | null;
}

// ----- SSE Event Types (2026-04-15 계약 기준) -----

export type SSEPhase = 'request' | 'planning' | 'approval' | 'response' | 'execution';

export const TERMINAL_STATUSES = [
  'executed', 'completed', 'failed', 'escalated',
  'cancelled', 'rejected', 'approval_expired', 'superseded',
] as const;

export const TERMINAL_EVENT_TYPES = [
  'response.completed',
  'request.failed',
  'execution.completed',
  'execution.failed',
  'approval.rejected',
  'approval.superseded',
] as const;

export type TerminalStatus = (typeof TERMINAL_STATUSES)[number];
export type TerminalEventType = (typeof TERMINAL_EVENT_TYPES)[number];

export function isTerminalStatus(status: string): status is TerminalStatus {
  return (TERMINAL_STATUSES as readonly string[]).includes(status);
}

export function isTerminalEventType(type: string): type is TerminalEventType {
  return (TERMINAL_EVENT_TYPES as readonly string[]).includes(type);
}

export function isTerminalSSEEvent(event: SSEEvent): boolean {
  return (
    isTerminalEventType(event.type) ||
    ('status' in event && typeof event.status === 'string' && isTerminalStatus(event.status))
  );
}

/** 구조화 이벤트 공통 필드 */
export interface SSEBaseEvent {
  type: string;
  phase?: SSEPhase;
  step?: string;
  message?: string;
  request_id: number;
  session_id: number;
  status?: string;
  progress?: number;
}

/** 감사 메타데이터 (일부 이벤트에 추가됨) */
export interface SSEAuditMeta {
  user_id?: string;
  operation?: string;
  latency_ms?: number;
  downstream?: string;
  status_code?: number;
  fallback_used?: boolean;
  clarification_type?: string | null;
}

/** task, final_response 등을 포함하는 구조화 이벤트 */
export interface SSETaskEvent extends SSEBaseEvent, Partial<SSEAuditMeta> {
  task?: TaskSnapshot | null;
  final_response?: string;
  missing_inputs?: string[] | null;
  request_type?: string;
  intent?: string;
  selected_operation_ids?: string[];
  resolved_references?: Record<string, unknown>;
  // context.hydrated 전용
  project_context_count?: number;
  application_context_count?: number;
  user_context_count?: number;
  request_trail_count?: number;
}

/** response.delta 청크 이벤트 (구조화 필드 없음) */
export interface SSEDeltaEvent {
  type: 'response.delta';
  request_id: number;
  session_id: number;
  text: string;
  source?: 'model_stream' | 'final_response' | 'execution_summary';
  synthetic?: boolean;
}

/** approval.superseded 이벤트 */
export interface SSESupersededEvent {
  type: 'approval.superseded';
  request_id: number;
  session_id: number;
  status: 'superseded';
  superseded_by: number;
  task?: TaskSnapshot | null;
}

/** approval.rejected 이벤트 (구조화 형식 아님) */
export interface SSERejectedEvent extends Partial<SSEAuditMeta> {
  type: 'approval.rejected';
  request_id: number;
  session_id: number;
  status: 'rejected';
  task?: TaskSnapshot | null;
}

export type SSEEvent = SSETaskEvent | SSEDeltaEvent | SSESupersededEvent | SSERejectedEvent;

export interface SSEEventRecord {
  sequence: number | null;
  event: SSEEvent;
}

// ----- History API -----

export interface RequestEventItem {
  sequence: number;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface RequestEventsResponse {
  items: RequestEventItem[];
  total: number;
  limit: number;
  offset: number;
}
