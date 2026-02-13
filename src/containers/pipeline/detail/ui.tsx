'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import StatusDot from '@/components/ui/StatusDot/ui';
import type { WorkflowDetail, LogStep } from '@/types/pipeline';
import * as S from './style';

const MOCK_DETAIL: WorkflowDetail = {
  id: 43,
  status: 'running',
  steps: [
    {
      name: 'Set up job',
      status: 'success',
      duration: '2s',
      logs: [
        { lineNumber: 1, content: 'Current runner version: 2.321.0' },
        { lineNumber: 2, content: 'Runner name: github-runner-abcdef' },
        { lineNumber: 3, content: 'Runner group name: Default' },
        { lineNumber: 4, content: 'Machine name: runner-host-01' },
        { lineNumber: 5, content: 'Operating System: Ubuntu 22.04.3 LTS' },
        { lineNumber: 6, content: 'Runner Image: ubuntu-latest' },
        { lineNumber: 7, content: 'GITHUB_TOKEN Permissions: Actions: write' },
      ],
    },
    {
      name: 'Pull ghcr.io/madp/app:latest',
      status: 'success',
      duration: '15s',
      logs: [
        { lineNumber: 1, content: 'Pulling image ghcr.io/madp/app:latest...' },
        { lineNumber: 2, content: 'latest: Pulling from madp/app' },
        { lineNumber: 3, content: 'Digest: sha256:abc123def456...' },
        { lineNumber: 4, content: 'Status: Downloaded newer image for ghcr.io/madp/app:latest' },
      ],
    },
    {
      name: 'Run docker compose up -d',
      status: 'running',
      duration: '1m 23s',
      logs: [
        { lineNumber: 1, content: 'Creating network "madp_default" with the default driver' },
        { lineNumber: 2, content: 'Creating madp_app_1 ...' },
        { lineNumber: 3, content: 'Creating madp_db_1  ...' },
      ],
    },
    {
      name: 'Health check',
      status: 'running',
      duration: '-',
      logs: [],
    },
    {
      name: 'Post cleanup',
      status: 'running',
      duration: '-',
      logs: [],
    },
  ],
};

interface PipelineDetailContainerProps {
  projectId: string;
  workflowId: string;
}

export default function PipelineDetailContainer({ projectId, workflowId }: PipelineDetailContainerProps) {
  const router = useRouter();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
  const [searchQuery, setSearchQuery] = useState('');

  const detail = { ...MOCK_DETAIL, id: Number(workflowId) };

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const filterLogs = (step: LogStep) => {
    if (!searchQuery || !step.logs) return step.logs || [];
    return step.logs.filter((log) =>
      log.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <S.PageWrapper>
      <S.Header>
        <S.WorkflowTitle>#{detail.id} Workflow run</S.WorkflowTitle>
        <S.BackButtonWrapper>
          <Button
            variant="confirm"
            onClick={() => router.push(`/project/manage/${projectId}/pipeline`)}
          >
            돌아가기
          </Button>
        </S.BackButtonWrapper>
      </S.Header>

      <S.LogPanel>
        <S.LogPanelHeader>
          <S.LogPanelLeft>
            <S.LogPanelTitle>Run logs</S.LogPanelTitle>
            <S.LogPanelStatus>
              <StatusDot status={detail.status} showLabel />
            </S.LogPanelStatus>
          </S.LogPanelLeft>
          <S.SearchWrapper>
            <Input
              placeholder="로그 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </S.SearchWrapper>
        </S.LogPanelHeader>

        {detail.steps.map((step, index) => {
          const isExpanded = expandedSteps.has(index);
          const filteredLogs = filterLogs(step);

          return (
            <S.StepItem key={index}>
              <S.StepHeader $expanded={isExpanded} onClick={() => toggleStep(index)}>
                <S.ChevronIcon $expanded={isExpanded}>
                  <Image src="/icons/sidebar/chevron-right.svg" alt="toggle" width={20} height={20} />
                </S.ChevronIcon>
                <StatusDot status={step.status} />
                <S.StepName>{step.name}</S.StepName>
                <S.StepDuration>{step.duration}</S.StepDuration>
              </S.StepHeader>

              {isExpanded && filteredLogs.length > 0 && (
                <S.LogContainer>
                  {filteredLogs.map((log) => (
                    <S.LogLineRow key={log.lineNumber}>
                      <S.LineNumber>{log.lineNumber}</S.LineNumber>
                      <S.LineContent>{log.content}</S.LineContent>
                    </S.LogLineRow>
                  ))}
                </S.LogContainer>
              )}
            </S.StepItem>
          );
        })}
      </S.LogPanel>
    </S.PageWrapper>
  );
}
