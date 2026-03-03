'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import Card, { MetaItem, FooterMessage } from '@/components/ui/Card/ui';
import * as S from './style';

const MOCK_DATABASES = [
  {
    id: 'db-001',
    name: 'users-db',
    type: 'PostgreSQL',
    tables: 5,
  },
  {
    id: 'db-002',
    name: 'products-db',
    type: 'MySQL',
    tables: 8,
  },
  {
    id: 'db-003',
    name: 'analytics-db',
    type: 'PostgreSQL',
    tables: 12,
  },
];

export default function CloudDatabaseContainer() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDatabases = useMemo(() => {
    return MOCK_DATABASES.filter((db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCreateDatabase = () => {
    router.push('/cloud-database/create');
  };

  const handleDatabaseClick = (id: string) => {
    router.push(`/cloud-database/${id}`);
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>클라우드 데이터베이스</S.Title>
        <S.ActionBar>
          <S.SearchWrapper>
            <Input
              placeholder="DB명을 입력해주세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </S.SearchWrapper>
          <Button variant="confirm" size="medium" onClick={handleCreateDatabase}>
            새 DB
          </Button>
        </S.ActionBar>
      </S.Header>

      <S.GridContainer>
        {filteredDatabases.map((database) => (
          <Card
            key={database.id}
            onClick={() => handleDatabaseClick(database.id)}
            title={database.name}
            meta={[
              { icon: '/icons/sidebar/cloud-db.svg', label: database.type },
              { icon: '/icons/cloud-db/table.svg', label: `테이블 ${database.tables}개` },
            ]}
          />
        ))}
      </S.GridContainer>

      {filteredDatabases.length === 0 && (
        <S.EmptyState>
          <S.EmptyIcon>🔍</S.EmptyIcon>
          <S.EmptyText>검색 결과가 없습니다</S.EmptyText>
        </S.EmptyState>
      )}
    </S.Container>
  );
}
