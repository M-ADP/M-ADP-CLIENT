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
    id: '1',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: 'test.mdeveloper.platform',
    hasWarning: true,
  },
  {
    id: '2',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '3',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '4',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: true,
  },
  {
    id: '5',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '6',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '7',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: true,
  },
  {
    id: '8',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '9',
    name: 'TestProject',
    deployments: 'Running 2',
    warning: 'Warning 1',
    domain: '',
    hasWarning: false,
  },
  {
    id: '10',
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
