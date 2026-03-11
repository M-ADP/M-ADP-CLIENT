'use client';

import { useState } from 'react';
import * as S from './style';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateAppMutation } from '@/services/app/app.mutation';

export default function AppCreateContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const createAppMutation = useCreateAppMutation();
  const [formData, setFormData] = useState({
    appName: '',
    port: '',
    cpu: '',
    memory: '',
    disk: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.appName.trim()) {
      alert('애플리케이션 이름을 입력해주세요.');
      return;
    }

    if (!projectId) {
      alert('프로젝트 정보가 없습니다.');
      return;
    }

    try {
      const result = await createAppMutation.mutateAsync({
        name: formData.appName.trim(),
        project_id: Number(projectId),
        ...(formData.port && { port: Number(formData.port) }),
        ...(formData.cpu && { cpu: Number(formData.cpu) }),
        ...(formData.memory && { memory: Number(formData.memory) }),
        ...(formData.disk && { disk: Number(formData.disk) }),
      });

      alert(result.message || '애플리케이션이 생성되었습니다.');
      if (result.data) {
        router.push(`/project/manage/${projectId}/app`);
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
        />
        <Input
          label="PORT"
          name="port"
          value={formData.port}
          onChange={handleChange}
          placeholder="예: 8000"
        />
        <Input
          label="CPU (0.1v ~ 4.0v)"
          name="cpu"
          value={formData.cpu}
          onChange={handleChange}
          placeholder="예: 0.3"
        />
        <Input
          label="MEMORY (32MB ~ 4096MB)"
          name="memory"
          value={formData.memory}
          onChange={handleChange}
          placeholder="예: 4096"
        />
        <Input
          label="DISK (32MB ~ 50GB)"
          name="disk"
          value={formData.disk}
          onChange={handleChange}
          placeholder="예: 4"
        />
        <S.NoticeText>
          {`※ MEMORY는 MB 단위, DISK는 GB 단위로 입력해주세요.\n※ 이후 DISK는 증가만 가능하며 감소는 불가합니다.`}
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
