'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import Card, { MetaItem, FooterMessage } from '@/components/ui/Card/ui';
import * as S from './style';
import { useProjectListQuery } from '@/services/project/project.query';

export default function ProjectManageContainer() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError } = useProjectListQuery();

  const filteredProjects = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleProjectClick = (projectId: string | number) => {
    router.push(`/project/manage/${projectId}`);
  };

  const handleNewProject = () => {
    router.push('/project/create');
  };

  if (isLoading) {
    return (
      <S.PageWrapper>
        <S.PageTitle>프로젝트</S.PageTitle>
        <p>로딩 중...</p>
      </S.PageWrapper>
    );
  }

  if (isError) {
    return (
      <S.PageWrapper>
        <S.PageTitle>프로젝트</S.PageTitle>
        <p>프로젝트 목록을 불러오는데 실패했습니다.</p>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.PageTitle>프로젝트</S.PageTitle>
      <S.HeaderRow>
        <Input
          placeholder="프로젝트 명을 입력해주세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width={280}
        />
        <Button variant="confirm" onClick={handleNewProject}>
          새 프로젝트
        </Button>
      </S.HeaderRow>
      <S.ProjectGrid>
        {filteredProjects.length === 0 ? (
          <p>프로젝트가 없습니다.</p>
        ) : (
          filteredProjects.map((project) => {
            const hasWarning = project.deployment_summary.warning > 0;
            return (
              <Card
                key={project.id}
                title={project.name}
                onClick={() => handleProjectClick(project.id)}
                footer={
                  hasWarning ? (
                    <FooterMessage>
                      <Image src="/icons/project/warning.svg" alt="warning" width={14} height={14} />
                      {project.deployment_status.message || '프로젝트에 경고가 있습니다.'}
                    </FooterMessage>
                  ) : undefined
                }
              >
                <MetaItem>
                  Deployments: Running {project.deployment_summary.running} · Warning {project.deployment_summary.warning}
                </MetaItem>
                {project.domain && <MetaItem>Domain: {project.domain}</MetaItem>}
              </Card>
            );
          })
        )}
      </S.ProjectGrid>
    </S.PageWrapper>
  );
}

