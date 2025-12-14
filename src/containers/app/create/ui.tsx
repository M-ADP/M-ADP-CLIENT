'use client';

import { useState } from 'react';
import * as S from './style';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import { useRouter } from 'next/navigation';

export default function AppCreateContainer() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    appName: '',
    cpu: '',
    memory: '',
    disk: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 애플리케이션 생성 API 호출
    console.log('Application create:', formData);
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
          <Button variant="confirm" type="submit">
            확인
          </Button>
          <Button variant="cancel" type="button" onClick={handleCancel}>
            취소
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </S.PageWrapper>
  );
}