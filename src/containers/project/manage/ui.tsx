'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input/ui';
import Button from '@/components/ui/Button/ui';
import Card, { MetaItem, FooterMessage } from '@/components/ui/Card/ui';
import * as S from './style';

const MOCK_PROJECTS = [
  {
    id: 'b7e23ec2-8aaf-4c2b-9c3d-1e2f3a4b5c6d',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: 'test.mdeveloper.platform',
    hasWarning: true,
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: 'c0ffee42-1337-4bad-babe-123456789abc',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: 'deadbeef-0000-4000-8000-abcdefabcdef',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: true,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '987fbc97-4bed-5078-9f07-9141ba07c9f3',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: 'e4eaaaf2-d142-11e1-b3e4-080027620cdd',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: true,
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '6fa459ea-ee8a-3ca4-894e-db77e160355e',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
];

export default function ProjectManageContainer() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = MOCK_PROJECTS.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/manage/${projectId}`);
  };

  const handleNewProject = () => {
    router.push('/project/create');
  };

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
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            title={project.name}
            onClick={() => handleProjectClick(project.id)}
            footer={
              project.hasWarning ? (
                <FooterMessage>
                  <Image src="/icons/project/warning.svg" alt="warning" width={14} height={14} />
                  프로젝트가 현재 중지 상태입니다.
                </FooterMessage>
              ) : undefined
            }
          >
            <MetaItem>Deployments: {project.deployments} · {project.warning}</MetaItem>
            {project.domain && <MetaItem>Domain: {project.domain}</MetaItem>}
          </Card>
        ))}
      </S.ProjectGrid>
    </S.PageWrapper>
  );
}
