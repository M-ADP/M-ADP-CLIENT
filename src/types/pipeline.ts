export type WorkflowStatus = 'running' | 'success' | 'crashed';

export interface Workflow {
  id: number;
  status: WorkflowStatus;
  duration: string;
  trigger: string;
  timestamp: string;
}

export type LogStepStatus = 'success' | 'failed' | 'running';

export interface LogLine {
  lineNumber: number;
  content: string;
}

export interface LogStep {
  name: string;
  status: LogStepStatus;
  duration: string;
  expanded?: boolean;
  logs?: LogLine[];
}

export interface WorkflowDetail {
  id: number;
  status: WorkflowStatus;
  steps: LogStep[];
}
