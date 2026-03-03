'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import * as S from './style';

const DB_TYPES = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
  { value: 'redis', label: 'Redis', icon: '🔴' },
];

export default function CreateDatabaseContainer() {
  const router = useRouter();
  const [dbName, setDbName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const handleCancel = () => {
    router.back();
  };

  const handleCreate = () => {
    if (!dbName || !selectedType) {
      alert('데이터베이스 이름과 타입을 선택해주세요.');
      return;
    }

    // TODO: API 호출하여 데이터베이스 생성
    console.log('Creating database:', { name: dbName, type: selectedType });

    // 생성 후 목록으로 이동
    router.push('/cloud-database');
  };

  return (
    <S.PageWrapper>
      <S.PageTitle>Cloud DB 생성</S.PageTitle>
      <S.FormContainer>
        <Input
          label="DB 명"
          placeholder="예: Kill Dongwookki"
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
        <S.ButtonGroup>
          <Button variant="confirm" onClick={handleCreate} disabled={!dbName || !selectedType}>
            확인
          </Button>
          <Button variant="cancel" onClick={handleCancel}>
            취소
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </S.PageWrapper>
  );
}
