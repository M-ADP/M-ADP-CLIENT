'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Card, { MetaItem, FooterMessage, StatusBadge } from '@/components/ui/Card/ui';
import * as S from './style';
import { useProjectDetailQuery } from '@/services/project/project.query';

interface ProjectDetailContainerProps {
  projectId: string;
}

export default function ProjectDetailContainer({ projectId }: ProjectDetailContainerProps) {
  const { data: project, isLoading, isError } = useProjectDetailQuery(projectId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftGradient(scrollLeft > 0);
        setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      handleScroll();
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (isLoading) {
    return (
      <S.PageWrapper>
        <p>로딩 중...</p>
      </S.PageWrapper>
    );
  }

  if (isError || !project) {
    return (
      <S.PageWrapper>
        <p>프로젝트 정보를 불러오는데 실패했습니다.</p>
      </S.PageWrapper>
    );
  }

  const getStatusVariant = (status: string): 'healthy' | 'unhealthy' | 'stopped' => {
    switch (status) {
      case 'Healthy': return 'healthy';
      case 'Unhealthy': return 'unhealthy';
      default: return 'stopped';
    }
  };

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.TitleRow>
          <S.PageTitle>{project.name}</S.PageTitle>
          <S.ProjectId>({project.id})</S.ProjectId>
        </S.TitleRow>
      </S.PageHeader>

      <S.SectionTitle>앱 배포 목록</S.SectionTitle>
      <S.AppGridWrapper $showLeftGradient={showLeftGradient} $showRightGradient={showRightGradient}>
        <S.AppGrid ref={scrollRef}>
          {project.deployments.length === 0 ? (
            <p>배포된 앱이 없습니다.</p>
          ) : (
            project.deployments.map((app) => {
              const variant = getStatusVariant(app.health_status);
              const isUnhealthy = variant === 'unhealthy' || variant === 'stopped';
              return (
                <Card
                  key={app.id}
                  title={app.name}
                  footer={
                    <>
                      {isUnhealthy && (
                        <FooterMessage>
                          <Image src="/icons/project/warning.svg" alt="warning" width={12} height={12} />
                          {app.health_status === 'Stopped' ? '애플리케이션이 정지 상태입니다.' : '애플리케이션에 오류가 발생했습니다.'}
                        </FooterMessage>
                      )}
                      <StatusBadge $variant={variant}>
                        {app.health_status}
                      </StatusBadge>
                    </>
                  }
                >
                  <MetaItem>
                    <Image src="/icons/project/code.svg" alt="language" width={14} height={14} />
                    {app.runtime}
                  </MetaItem>
                  <MetaItem>
                    <Image src="/icons/project/pods.svg" alt="replicas" width={14} height={14} />
                    {app.pod_count}
                  </MetaItem>
                  <MetaItem>
                    <Image src="/icons/project/port.svg" alt="port" width={14} height={14} />
                    {app.exposed_port}
                  </MetaItem>
                  <MetaItem>
                    <Image src="/icons/project/gauge.svg" alt="usage" width={14} height={14} />
                    CPU: {app.cpu_usage_percent}% · RAM: {app.ram_usage_percent}%
                  </MetaItem>
                </Card>
              );
            })
          )}
        </S.AppGrid>
      </S.AppGridWrapper>

      <S.ChartSection>
        <S.ChartGrid>
          <S.ChartCard>
            <S.ChartTitle>CPU 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>메모리 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>디스크 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>네트워크 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
        </S.ChartGrid>

        <S.RightPanel>
          <S.PortSection>
            <S.PortTitle>포트 공개 정보</S.PortTitle>
            {project.ports.length === 0 ? (
              <p>공개된 포트가 없습니다.</p>
            ) : (
              project.ports.map((port) => (
                <S.PortInputRow key={port.id}>
                  <S.PortInputGroup>
                    <S.PortLabel>From ({port.from_ip})</S.PortLabel>
                    <S.PortInput type="text" value={port.from_port} readOnly />
                  </S.PortInputGroup>
                  <S.PortInputGroup>
                    <S.PortLabel>To Port</S.PortLabel>
                    <S.PortInput type="text" value={port.port_number} readOnly />
                  </S.PortInputGroup>
                </S.PortInputRow>
              ))
            )}
          </S.PortSection>
        </S.RightPanel>
      </S.ChartSection>
    </S.PageWrapper>
  );
}