'use client';

import * as S from './style';
import type { WorkflowStatus, LogStepStatus } from '@/types/pipeline';

const STATUS_COLORS: Record<WorkflowStatus | LogStepStatus, string> = {
  running: 'rgba(249, 115, 22, 0.7)',
  success: '#BDFFD7',
  crashed: '#CA2500',
  failed: '#CA2500',
};

const STATUS_LABELS: Record<WorkflowStatus, string> = {
  running: 'Running',
  success: 'Success',
  crashed: 'Crashed',
};

interface StatusDotProps {
  status: WorkflowStatus | LogStepStatus;
  showLabel?: boolean;
}

export default function StatusDot({ status, showLabel = false }: StatusDotProps) {
  return (
    <>
      <S.Dot $color={STATUS_COLORS[status]} />
      {showLabel && <span>{STATUS_LABELS[status as WorkflowStatus]}</span>}
    </>
  );
}

export { STATUS_COLORS, STATUS_LABELS };
