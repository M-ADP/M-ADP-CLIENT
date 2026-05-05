'use client';

import { useState } from 'react';
import * as S from './style';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateAppMutation } from '@/services/app/app.mutation';
import { useProjectDetailQuery } from '@/services/project/project.query';

const HARD_MIN = { cpu: 0.1, memory: 0.25, disk: 2 } as const;
const HARD_MAX = { cpu: 4, memory: 1, disk: 50 } as const;

const toNum = (value: string | number | undefined): number => {
  if (value === undefined || value === null || value === '') return 0;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (n: number): string => {
  if (!Number.isFinite(n) || n <= 0) return '0';
  return Number(n.toFixed(2)).toString();
};

export default function AppCreateContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const createAppMutation = useCreateAppMutation();
  const { data: projectDetail } = useProjectDetailQuery(projectId);
  const resource = projectDetail?.resource;

  const usage = {
    cpu: { used: toNum(resource?.cpu?.used), total: toNum(resource?.cpu?.limit) },
    memory: { used: toNum(resource?.memory?.used), total: toNum(resource?.memory?.limit) },
    disk: { used: toNum(resource?.disk?.used), total: toNum(resource?.disk?.limit) },
  };

  const remaining = {
    cpu: Math.max(0, usage.cpu.total - usage.cpu.used),
    memory: Math.max(0, usage.memory.total - usage.memory.used),
    disk: Math.max(0, usage.disk.total - usage.disk.used),
  };

  const effectiveMax = {
    cpu: Math.min(HARD_MAX.cpu, remaining.cpu || HARD_MAX.cpu),
    memory: Math.min(HARD_MAX.memory, remaining.memory || HARD_MAX.memory),
    disk: Math.min(HARD_MAX.disk, remaining.disk || HARD_MAX.disk),
  };

  const [formData, setFormData] = useState({
    appName: '',
    cpu: '',
    memory: '',
    disk: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'appName') {
      const sanitizedName = value
        .toLowerCase()
        .replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitizedName }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.appName.trim()) {
      alert('애플리케이션 이름을 입력해주세요.');
      return;
    }

    if (/[A-Z]/.test(formData.appName) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(formData.appName)) {
      alert('앱 이름에는 대문자와 한글을 사용할 수 없습니다.');
      return;
    }

    if (!projectId) {
      alert('프로젝트 정보가 없습니다.');
      return;
    }

    const fields: Array<{ key: 'cpu' | 'memory' | 'disk'; label: string; unit: string }> = [
      { key: 'cpu', label: 'CPU', unit: 'v' },
      { key: 'memory', label: 'MEMORY', unit: 'GB' },
      { key: 'disk', label: 'DISK', unit: 'GB' },
    ];

    for (const { key, label, unit } of fields) {
      const raw = formData[key];
      if (!raw) continue;
      const value = toNum(raw);
      if (value < HARD_MIN[key]) {
        alert(`${label}은(는) 최소 ${HARD_MIN[key]}${unit} 이상이어야 합니다.`);
        return;
      }
      if (value > effectiveMax[key]) {
        const usageHint = usage[key].total > 0
          ? `프로젝트 ${formatNumber(usage[key].used)}/${formatNumber(usage[key].total)}${unit} 사용 중`
          : `허용 범위 ${HARD_MAX[key]}${unit}`;
        alert(`${label}은(는) ${formatNumber(effectiveMax[key])}${unit} 이하로 입력해 주세요. (${usageHint})`);
        return;
      }
    }

    try {
      const result = await createAppMutation.mutateAsync({
        name: formData.appName.trim(),
        project_id: projectId,
        ...(formData.cpu && { cpu: Number(formData.cpu) }),
        ...(formData.memory && { memory: Number(formData.memory) }),
        ...(formData.disk && { disk: Number(formData.disk) }),
      });

      alert(result.message || '애플리케이션이 생성되었습니다.');
      if (result.data) {
        const nextQuery = new URLSearchParams({
          appId: result.data,
          projectId,
          appName: formData.appName.trim(),
        });
        router.push(`/app/github-connect?${nextQuery.toString()}`);
      } else {
        alert("애플리케이션 생성에 실패했습니다.")
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('애플리케이션 생성에 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <S.PageWrapper>
      <S.PageTitle>어플리케이션 생성</S.PageTitle>
      <S.FormContainer onSubmit={handleSubmit}>
        <Input
          label="어플리케이션 명"
          name="appName"
          value={formData.appName}
          onChange={handleChange}
          placeholder="예: Kill Black"
          autoComplete="off"
        />
        <Input
          label={`CPU (최대 ${formatNumber(effectiveMax.cpu)}v · 프로젝트 ${formatNumber(usage.cpu.used)}/${formatNumber(usage.cpu.total)}v)`}
          name="cpu"
          type="number"
          step="0.1"
          min={HARD_MIN.cpu}
          max={effectiveMax.cpu}
          value={formData.cpu}
          onChange={handleChange}
          placeholder={`예: ${Math.min(0.3, effectiveMax.cpu)}`}
        />
        <Input
          label={`MEMORY (최대 ${formatNumber(effectiveMax.memory)}GB · 프로젝트 ${formatNumber(usage.memory.used)}/${formatNumber(usage.memory.total)}GB)`}
          name="memory"
          type="number"
          step="0.25"
          min={HARD_MIN.memory}
          max={effectiveMax.memory}
          value={formData.memory}
          onChange={handleChange}
          placeholder={`예: ${Math.min(1, effectiveMax.memory)}`}
        />
        <Input
          label={`DISK (최대 ${formatNumber(effectiveMax.disk)}GB · 프로젝트 ${formatNumber(usage.disk.used)}/${formatNumber(usage.disk.total)}GB)`}
          name="disk"
          type="number"
          step="1"
          min={HARD_MIN.disk}
          max={effectiveMax.disk}
          value={formData.disk}
          onChange={handleChange}
          placeholder={`예: ${Math.min(4, effectiveMax.disk)}`}
        />
        <S.NoticeText>
          {`※ 앱 이름에는 대문자와 한글을 사용할 수 없습니다.\n※ 메모리와 디스크는 모두 GB 단위로 입력해 주세요.\n※ 주의: 디스크 용량은 이후 확장만 가능하며, 축소는 불가능합니다.\n※ 입력 가능한 최대치는 프로젝트의 잔여 자원만큼입니다.`}
        </S.NoticeText>
        <S.ButtonGroup>
          <Button variant="confirm" type="submit" disabled={createAppMutation.isPending}>
            {createAppMutation.isPending ? '생성 중...' : '확인'}
          </Button>
          <Button variant="cancel" type="button" onClick={handleCancel}>
            취소
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </S.PageWrapper>
  );
}
