export interface TaskInputField {
  key: string;
  label: string;
  value: unknown;
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
