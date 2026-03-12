'use client';

import { useState } from 'react';
import * as S from './style';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import { useRouter } from 'next/navigation';
import { useCreateProjectMutation } from '@/services/project/project.mutation';

export default function ProjectCreateContainer() {
  const router = useRouter();
  const createProjectMutation = useCreateProjectMutation();
  const [formData, setFormData] = useState({
    projectName: '',
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

    if (!formData.projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }

    try {
      await createProjectMutation.mutateAsync({
        name: formData.projectName.trim(),
        ...(formData.cpu && { cpu: `${Math.round(Number(formData.cpu) * 1000)}m` }),
        ...(formData.memory && { memory: `${formData.memory}Mi` }),
        ...(formData.disk && { disk: `${formData.disk}Gi` }),
      });

      alert('프로젝트가 생성되었습니다.');
      router.push('/project/manage');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('프로젝트 생성에 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <S.PageWrapper>
      <S.PageTitle>프로젝트 생성</S.PageTitle>
      <S.FormContainer onSubmit={handleSubmit}>
        <Input
          label="프로젝트 명"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="예: Kill Dongwookki"
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
          label="DISK (0.032GB ~ 50GB)"
          name="disk"
          value={formData.disk}
          onChange={handleChange}
          placeholder="예: 4"
        />
        <S.NoticeText>
          {`※ MEMORY는 MB 단위, DISK는 GB 단위로 입력해주세요.\n※ 이후 DISK는 증가만 가능하며 감소는 불가합니다.`}
        </S.NoticeText>
        <S.ButtonGroup>
          <Button variant="confirm" type="submit" disabled={createProjectMutation.isPending}>
            {createProjectMutation.isPending ? '생성 중...' : '확인'}
          </Button>
          <Button variant="cancel" type="button" onClick={handleCancel}>
            취소
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </S.PageWrapper>
  );
}