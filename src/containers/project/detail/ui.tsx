'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Card, { MetaItem, FooterMessage, StatusBadge } from '@/components/ui/Card/ui';
import * as S from './style';

const MOCK_APPS = [
  {
    id: '1',
    name: 'Aemaehano',
    language: 'Python',
    replicas: 2,
    port: 8000,
    cpu: '78%',
    ram: '51%',
    status: 'healthy',
    statusMessage: '애플리케이션이 정지 상태입니다.',
  },
  {
    id: '2',
    name: 'Aemaehano',
    language: 'Python',
    replicas: 2,
    port: 8000,
    cpu: '78%',
    ram: '51%',
    status: 'unhealthy',
    statusMessage: '애플리케이션이 정지 상태입니다.',
  },
  {
    id: '3',
    name: 'Aemaehano',
    language: 'Python',
    replicas: 2,
    port: 8000,
    cpu: '78%',
    ram: '51%',
    status: 'healthy',
    statusMessage: '애플리케이션이 정지 상태입니다.',
  },
  {
    id: '4',
    name: 'Aemaehano',
    language: 'Python',
    replicas: 2,
    port: 8000,
    cpu: '78%',
    ram: '51%',
    status: 'healthy',
    statusMessage: '애플리케이션이 정지 상태입니다.',
  },
];

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

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.TitleRow>
          <S.PageTitle>TestProject</S.PageTitle>
          <S.ProjectId>(asdfas23iowdnis)</S.ProjectId>
        </S.TitleRow>
      </S.PageHeader>

      <S.SectionTitle>앱 배포 목록</S.SectionTitle>
      <S.AppGridWrapper $showLeftGradient={showLeftGradient} $showRightGradient={showRightGradient}>
        <S.AppGrid ref={scrollRef}>
          {MOCK_APPS.map((app) => (
            <Card
              key={app.id}
              title={app.name}
              footer={
                <>
                  <FooterMessage>
                    <Image src="/icons/project/warning.svg" alt="warning" width={12} height={12} />
                    {app.statusMessage}
                  </FooterMessage>
                  <StatusBadge $variant={app.status === 'healthy' ? 'healthy' : 'unhealthy'}>
                    {app.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
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
                CPU: {app.cpu} · RAM: {app.ram}
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
