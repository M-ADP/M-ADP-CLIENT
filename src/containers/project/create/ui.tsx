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
    if (name === 'projectName') {
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

    if (!formData.projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }

    if (/[A-Z]/.test(formData.projectName) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(formData.projectName)) {
      alert('프로젝트 이름에는 대문자와 한글을 사용할 수 없습니다.');
      return;
    }

    try {
      await createProjectMutation.mutateAsync({
        name: formData.projectName.trim(),
        ...(formData.cpu && { max_cpu: Number(formData.cpu) }),
        ...(formData.memory && { max_memory: Number(formData.memory) }),
        ...(formData.disk && { max_disk: Number(formData.disk) }),
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
          maxLength={20}
          autoComplete="off"
        />
        <Input
          label="CPU (0.1v ~ 4.0v)"
          name="cpu"
          value={formData.cpu}
          onChange={handleChange}
          placeholder="예: 0.3"
        />
        <Input
          label="MEMORY (0.5GB ~ 1GB)"
          name="memory"
          value={formData.memory}
          onChange={handleChange}
          placeholder="예: 1"
        />
        <Input
          label="DISK (2GB ~ 50GB)"
          name="disk"
          value={formData.disk}
          onChange={handleChange}
          placeholder="예: 4"
        />
        <S.NoticeText>
          {`※ 프로젝트 이름에는 대문자와 한글을 사용할 수 없습니다.\n※ 메모리와 디스크는 모두 GB 단위로 입력해 주세요.\n※ 주의: 디스크 용량은 이후 확장만 가능하며, 축소는 불가능합니다.`}
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
