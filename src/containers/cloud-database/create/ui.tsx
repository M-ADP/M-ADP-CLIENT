'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import { useCreateCloudDbMutation } from '@/services/cloud-database/cloudDb.mutation';
import * as S from './style';

interface Props {
  projectId: string;
}

const DB_TYPES = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
];

const DISK_OPTIONS = ['1Gi', '5Gi', '10Gi', '20Gi', '50Gi'];
const CPU_OPTIONS = ['250m', '500m', '1', '2'];
const MEMORY_OPTIONS = ['256Mi', '512Mi', '1Gi', '2Gi', '4Gi'];

export default function CreateDatabaseContainer({ projectId }: Props) {
  const router = useRouter();
  const [dbName, setDbName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [replicas, setReplicas] = useState<number>(1);
  const [diskSize, setDiskSize] = useState<string>('5Gi');
  const [cpu, setCpu] = useState<string>('500m');
  const [memory, setMemory] = useState<string>('512Mi');

  const createMutation = useCreateCloudDbMutation();

  const handleCancel = () => {
    router.back();
  };

  const handleCreate = () => {
    if (!dbName || !selectedType) {
      alert('데이터베이스 이름과 타입을 선택해주세요.');
      return;
    }

    createMutation.mutate(
      {
        project_id: projectId,
        type: selectedType,
        replicas,
        containers: [
          {
            name: dbName,
            disk: { size: diskSize },
            resources: {
              requests: { cpu, memory },
              limits: { cpu, memory },
            },
          },
        ],
      },
      {
        onSuccess: () => {
          router.push(`/project/manage/${projectId}`);
        },
        onError: (err) => {
          alert(err instanceof Error ? err.message : '데이터베이스 생성에 실패했습니다.');
        },
      }
    );
  };

  return (
    <S.PageWrapper>
      <S.PageTitle>Cloud DB 생성</S.PageTitle>
      <S.FormContainer>
        <Input
          label="DB 명"
          placeholder="예: users-db"
          value={dbName}
          onChange={(e) => setDbName(e.target.value)}
        />
        <S.SelectWrapper>
          <S.Label>DB 종류 선택</S.Label>
          <S.Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">DB 종류</option>
            {DB_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </S.Select>
        </S.SelectWrapper>

        <S.SelectWrapper>
          <S.Label>레플리카 수 (1-10)</S.Label>
          <S.Select
            value={replicas}
            onChange={(e) => setReplicas(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </S.Select>
        </S.SelectWrapper>

        <S.SelectWrapper>
          <S.Label>디스크 크기</S.Label>
          <S.Select value={diskSize} onChange={(e) => setDiskSize(e.target.value)}>
            {DISK_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </S.Select>
        </S.SelectWrapper>

        <S.SelectWrapper>
          <S.Label>CPU</S.Label>
          <S.Select value={cpu} onChange={(e) => setCpu(e.target.value)}>
            {CPU_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </S.Select>
        </S.SelectWrapper>

        <S.SelectWrapper>
          <S.Label>메모리</S.Label>
          <S.Select value={memory} onChange={(e) => setMemory(e.target.value)}>
            {MEMORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </S.Select>
        </S.SelectWrapper>

        <S.ButtonGroup>
          <Button
            variant="confirm"
            onClick={handleCreate}
            disabled={!dbName || !selectedType || createMutation.isPending}
          >
            {createMutation.isPending ? '생성 중...' : '확인'}
          </Button>
          <Button variant="cancel" onClick={handleCancel}>
            취소
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </S.PageWrapper>
  );
}
