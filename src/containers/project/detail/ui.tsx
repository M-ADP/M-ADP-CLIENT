'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card, { MetaItem, FooterMessage, StatusBadge } from '@/components/ui/Card/ui';
import Button from '@/components/ui/Button/ui';
import * as S from './style';
import { AppDeploymentStatusItem } from '@/services/app/app.api';
import { useAppsByProjectIdQuery } from '@/services/app/app.query';

type AppStatusVariant = 'healthy' | 'unhealthy' | 'stopped';

interface AppCardItem {
  key: string;
  name: string;
  language: string;
  replicas: number;
  port: number;
  cpuUsagePercentage: number;
  memoryUsagePercentage: number;
  status: AppStatusVariant;
  statusMessage?: string;
}

const getSafeNumber = (value: number | undefined) => (typeof value === 'number' ? value : 0);

const toAppCardItem = (item: AppDeploymentStatusItem): AppCardItem => {
  const name = item.name?.trim() ? item.name : 'Unknown App';
  const replicas = getSafeNumber(item.pod_count);
  const port = getSafeNumber(item.port);
  const cpuUsagePercentage = getSafeNumber(item.cpu_usage_percentage);
  const memoryUsagePercentage = getSafeNumber(item.memory_usage_percentage);

  let status: AppStatusVariant = 'healthy';
  let statusMessage: string | undefined;

  if (replicas <= 0) {
    status = 'stopped';
    statusMessage = '애플리케이션이 정지 상태입니다.';
  } else if (cpuUsagePercentage >= 90 || memoryUsagePercentage >= 90) {
    status = 'unhealthy';
    statusMessage = '애플리케이션에 오류가 발생했습니다.';
  }

  return {
    key: `${name}-${port}`,
    name,
    language: '-',
    replicas,
    port,
    cpuUsagePercentage,
    memoryUsagePercentage,
    status,
    statusMessage,
  };
};

const getStatusLabel = (status: AppStatusVariant) => {
  if (status === 'healthy') return 'Healthy';
  if (status === 'unhealthy') return 'Unhealthy';
  return 'Stopped';
};

const MOCK_FIREWALL_RULES = [
  { source: '0.0.0.0/0', port: 80, protocol: 'TCP', direction: 'Inbound', action: 'ALLOW', description: '웹 도메인' },
  { source: '22.33.44.55/32', port: 22, protocol: 'TCP', direction: 'Inbound', action: 'ALLOW', description: 'SSH (Sejun Noah Bang)' },
  { source: '10.0.0.0/16', port: 443, protocol: 'TCP', direction: 'Outbound', action: 'ALLOW', description: '내부 통신' },
  { source: '10.0.0.0/16', port: 443, protocol: 'TCP', direction: 'Outbound', action: 'ALLOW', description: '내부 통신' },
];

interface ProjectDetailContainerProps {
  projectId: string;
}

export default function ProjectDetailContainer({ projectId }: ProjectDetailContainerProps) {
  const router = useRouter();
  const appsByProjectIdQuery = useAppsByProjectIdQuery(projectId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const appCards = (appsByProjectIdQuery.data ?? []).map(toAppCardItem);

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

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.TitleRow>
          <S.PageTitle>TestProject</S.PageTitle>
          <S.ProjectId>(asdfas23iowdnis)</S.ProjectId>
        </S.TitleRow>
      </S.PageHeader>

      <S.SectionRow>
        <S.SectionTitle>앱 배포 목록</S.SectionTitle>
        <Button variant="confirm" onClick={() => router.push(`/app/create?projectId=${projectId}`)}>
          새 앱
        </Button>
      </S.SectionRow>
      <S.AppGridWrapper $showLeftGradient={showLeftGradient} $showRightGradient={showRightGradient}>
        <S.AppGrid ref={scrollRef}>
          {appsByProjectIdQuery.isPending && (
            <Card title="앱 목록을 불러오는 중입니다.">
              <MetaItem>잠시만 기다려주세요.</MetaItem>
            </Card>
          )}

          {appsByProjectIdQuery.isError && (
            <Card title="앱 목록 조회에 실패했습니다.">
              <MetaItem>잠시 후 다시 시도해주세요.</MetaItem>
            </Card>
          )}

          {!appsByProjectIdQuery.isPending && !appsByProjectIdQuery.isError && appCards.length === 0 && (
            <Card title="배포된 앱이 없습니다.">
              <MetaItem>새 앱을 생성해 배포를 시작하세요.</MetaItem>
            </Card>
          )}

          {!appsByProjectIdQuery.isPending && !appsByProjectIdQuery.isError && appCards.map((app) => (
            <Card
              key={app.key}
              title={app.name}
              onClick={() => router.push(`/project/manage/${projectId}/app?appName=${encodeURIComponent(app.name)}`)}
              footer={
                <>
                  {app.statusMessage && (
                    <FooterMessage>
                      <Image src="/icons/project/warning.svg" alt="warning" width={12} height={12} />
                      {app.statusMessage}
                    </FooterMessage>
                  )}
                  <StatusBadge $variant={app.status}>
                    {getStatusLabel(app.status)}
                  </StatusBadge>
                </>
              }
            >
              <MetaItem>
                <Image src="/icons/project/code.svg" alt="language" width={14} height={14} />
                {app.language}
              </MetaItem>
              <MetaItem>
                <Image src="/icons/project/pods.svg" alt="replicas" width={14} height={14} />
                {app.replicas}
              </MetaItem>
              <MetaItem>
                <Image src="/icons/project/port.svg" alt="port" width={14} height={14} />
                {app.port}
              </MetaItem>
              <MetaItem>
                <Image src="/icons/project/gauge.svg" alt="usage" width={14} height={14} />
                CPU: {app.cpuUsagePercentage}% · RAM: {app.memoryUsagePercentage}%
              </MetaItem>
            </Card>
          ))}
        </S.AppGrid>
      </S.AppGridWrapper>

      <S.ChartSection>
        <S.ChartGrid>
          <S.ChartCard>
            <S.ChartTitle>최근 7일</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>최근 7일</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>최근 7일</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>최근 7일</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
        </S.ChartGrid>

        <S.RightPanel>
          <S.PortSection>
            <S.PortTitle>포트 공개 정보</S.PortTitle>
            <S.PortInputRow>
              <S.PortInputGroup>
                <S.PortLabel>From Port</S.PortLabel>
                <S.PortInput type="text" defaultValue="3000" readOnly />
              </S.PortInputGroup>
              <S.PortInputGroup>
                <S.PortLabel>To Port</S.PortLabel>
                <S.PortInput type="text" defaultValue="3000" readOnly />
              </S.PortInputGroup>
            </S.PortInputRow>
          </S.PortSection>

          <S.FirewallSection>
            <S.FirewallTitle>방화벽 설정</S.FirewallTitle>
            <S.FirewallTable>
              <thead>
                <tr>
                  <S.TableHeader>소스(CIDR/IP)</S.TableHeader>
                  <S.TableHeader>포트</S.TableHeader>
                  <S.TableHeader>프로토콜</S.TableHeader>
                  <S.TableHeader>방향</S.TableHeader>
                  <S.TableHeader>허용/거부</S.TableHeader>
                  <S.TableHeader>설명</S.TableHeader>
                </tr>
              </thead>
              <tbody>
                {MOCK_FIREWALL_RULES.map((rule, index) => (
                  <tr key={index}>
                    <S.TableCell>{rule.source}</S.TableCell>
                    <S.TableCell>{rule.port}</S.TableCell>
                    <S.TableCell>{rule.protocol}</S.TableCell>
                    <S.TableCell>{rule.direction}</S.TableCell>
                    <S.TableCell>{rule.action}</S.TableCell>
                    <S.TableCell>{rule.description}</S.TableCell>
                  </tr>
                ))}
              </tbody>
            </S.FirewallTable>
          </S.FirewallSection>
        </S.RightPanel>
      </S.ChartSection>
    </S.PageWrapper>
  );
}
