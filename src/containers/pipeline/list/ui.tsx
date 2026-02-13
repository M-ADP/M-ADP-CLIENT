'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import StatusDot from '@/components/ui/StatusDot/ui';
import Pagination from '@/components/ui/Pagination/ui';
import type { Workflow } from '@/types/pipeline';
import * as S from './style';

const MOCK_WORKFLOWS: Workflow[] = [
  { id: 43, status: 'running', duration: '3m 12s', trigger: 'push: main', timestamp: '2025-02-08T06:34:00Z' },
  { id: 42, status: 'success', duration: '2m 45s', trigger: 'push: main', timestamp: '2025-02-07T14:20:00Z' },
  { id: 41, status: 'crashed', duration: '1m 03s', trigger: 'push: develop', timestamp: '2025-02-07T10:15:00Z' },
  { id: 40, status: 'success', duration: '2m 50s', trigger: 'push: main', timestamp: '2025-02-06T18:45:00Z' },
  { id: 39, status: 'success', duration: '3m 01s', trigger: 'push: main', timestamp: '2025-02-06T09:30:00Z' },
  { id: 38, status: 'crashed', duration: '0m 45s', trigger: 'push: develop', timestamp: '2025-02-05T22:10:00Z' },
  { id: 37, status: 'success', duration: '2m 30s', trigger: 'push: main', timestamp: '2025-02-05T16:00:00Z' },
];

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}년 ${m}월 ${d}일 ${h}:${min}`;
}

interface PipelineListContainerProps {
  projectId: string;
}

export default function PipelineListContainer({ projectId }: PipelineListContainerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWorkflows = MOCK_WORKFLOWS.filter((wf) => {
    if (!searchQuery) return true;
    return (
      `#${wf.id}`.includes(searchQuery) ||
      wf.status.includes(searchQuery.toLowerCase()) ||
      wf.trigger.includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredWorkflows.length / 5));
  const paginatedWorkflows = filteredWorkflows.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <S.PageWrapper>
      <S.Header>
        <S.ProjectName>TestProject</S.ProjectName>
        <S.BackButtonWrapper>
          <Button
            variant="confirm"
            onClick={() => router.push(`/project/manage/${projectId}`)}
          >
            돌아가기
          </Button>
        </S.BackButtonWrapper>
      </S.Header>

      <S.SectionHeader>
        <S.SectionTitle>전체 워크플로우</S.SectionTitle>
        <S.SearchWrapper>
          <Input
            placeholder="워크플로우 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </S.SearchWrapper>
      </S.SectionHeader>

      <S.TableContainer>
        <S.TableHeader>
          <S.WorkflowCount>{filteredWorkflows.length} workflow runs</S.WorkflowCount>
          <S.StatusFilter>
            상태
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </S.StatusFilter>
        </S.TableHeader>

        {paginatedWorkflows.map((workflow) => (
          <S.WorkflowRow key={workflow.id}>
            <S.WorkflowNumber>#{workflow.id}</S.WorkflowNumber>
            <S.StatusCell>
              <StatusDot status={workflow.status} showLabel />
            </S.StatusCell>
            <S.Duration>{workflow.duration}</S.Duration>
            <S.Trigger>{workflow.trigger}</S.Trigger>
            <S.Timestamp>{formatTimestamp(workflow.timestamp)}</S.Timestamp>
            <S.DetailButtonWrapper>
              <Button
                variant="confirm"
                onClick={() => router.push(`/project/manage/${projectId}/pipeline/${workflow.id}`)}
              >
                자세히 보기
              </Button>
            </S.DetailButtonWrapper>
          </S.WorkflowRow>
        ))}
      </S.TableContainer>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </S.PageWrapper>
  );
}
