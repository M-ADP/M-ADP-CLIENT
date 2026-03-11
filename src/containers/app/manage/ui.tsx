'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Chart from '@/components/ui/Charts/Chart/ui';
import MultiLineChart from '@/components/ui/Charts/MultiLineChart/ui';
import ProgressBar from '@/components/ui/Charts/ProgressBar/ui';
import ProgressRing from '@/components/ui/Charts/ProgressRing/ui';
import * as S from './style';
import { useAppDetailsQuery, useAppResourceStatusQuery } from '@/services/app/app.query';
import {
  APP_NAME,
  latestLogs,
  resourceMetrics,
  trafficChartData,
  userStatsChartData,
  userStatsChartOptions,
  userStatsLegend,
} from './data';

interface AppManageContainerProps {
  projectId: string;
}

const clampPercent = (value: number) => {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

const parseNumber = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number.parseFloat(value.replace(/,/g, '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

const toRatioPercent = (used: string | undefined, total: string | undefined) => {
  const usedNumber = parseNumber(used);
  const totalNumber = parseNumber(total);
  if (usedNumber === null || totalNumber === null || totalNumber <= 0) return 0;
  return clampPercent(Math.round((usedNumber / totalNumber) * 100));
};

const formatStatusLabel = (status: string | undefined) => {
  if (!status) return '';
  const normalized = status.trim().toLowerCase();
  if (normalized === 'healthy' || normalized === 'running') return 'Healthy';
  if (normalized === 'unhealthy' || normalized === 'error' || normalized === 'failed') return 'Unhealthy';
  if (normalized === 'stopped' || normalized === 'stop') return 'Stopped';
  return status;
};

export default function AppManageContainer({ projectId }: AppManageContainerProps) {
  const searchParams = useSearchParams();
  const appName = (searchParams.get('appName') || APP_NAME).trim();
  const appDetails = useAppDetailsQuery(projectId, appName).data;
  const appStatusQuery = useAppResourceStatusQuery(projectId, appName);
  const appStatus = appStatusQuery.data;
  const [trafficStartDate, setTrafficStartDate] = useState('2025-01-01');
  const [trafficEndDate, setTrafficEndDate] = useState('2025-01-02');

  const trafficData = useMemo(() => {
    const baseData = trafficChartData;

    if (trafficStartDate === trafficEndDate) {
      return baseData;
    }

    const start = new Date(trafficStartDate);
    const end = new Date(trafficEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) diffDays = 1;
    const labels: string[] = [];

    for (let i = 0; i <= diffDays; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      labels.push(`${mm}.${dd}`);
    }

    const seed = trafficStartDate.charCodeAt(trafficStartDate.length - 1) + trafficEndDate.charCodeAt(trafficEndDate.length - 1);

    return {
      ...baseData,
      labels,
      datasets: baseData.datasets.map((dataset, dsIndex) => ({
        ...dataset,
        data: labels.map((_, i) => {
          const baseVal = (dataset.data[i % dataset.data.length] as number) || 200;
          const change = ((seed + i + dsIndex) % 40) - 20;
          return Math.max(0, baseVal + change * 5);
        }),
      })),
    };
  }, [trafficStartDate, trafficEndDate]);

  const cpuPercent = clampPercent(appStatus?.cpu_usage_percentage ?? 74);
  const memoryPercent = toRatioPercent(appStatus?.memory_used, appStatus?.memory_total);
  const diskPercent = toRatioPercent(appStatus?.disk_used, appStatus?.disk_total);
  const currentInstances = appStatus?.current_instances ?? 2;
  const availableInstances = appStatus?.available_instances ?? 2;
  const totalInstances = currentInstances + availableInstances;
  const instancePercent = totalInstances > 0 ? clampPercent(Math.round((currentInstances / totalInstances) * 100)) : 0;
  const repositoryUrl = appDetails?.github_repository_url?.trim() || `https://github.com/M-ADP/${appName.toLowerCase()}`;
  const repositoryLabel = repositoryUrl.replace(/^https?:\/\/github\.com\//i, '');
  const statusLabelFromDetails = formatStatusLabel(appDetails?.status);
  const healthLabel = statusLabelFromDetails || (cpuPercent >= 90 ? 'Risky' : 'Healthy');
  const topSummaryMetrics = [
    {
      id: 'app_id',
      label: '앱 ID',
      value: appDetails?.app_id ? String(appDetails.app_id) : '-',
    },
    {
      id: 'port',
      label: '포트',
      value: appDetails?.port ? String(appDetails.port) : '-',
    },
    {
      id: 'resource',
      label: '자원 사용량',
      value: typeof appDetails?.resource_use_percentage === 'number'
        ? `${clampPercent(appDetails.resource_use_percentage)}%`
        : `${cpuPercent}%`,
    },
    {
      id: 'status',
      label: '상태',
      value: statusLabelFromDetails || healthLabel,
    },
  ];
  const dynamicResourceMetrics = [
    {
      id: 'cpu',
      label: 'CPU',
      value: `${cpuPercent}%`,
      percent: cpuPercent,
    },
    {
      id: 'mem',
      label: 'MEM',
      value: appStatus?.memory_used ? `${appStatus.memory_used}${appStatus.memory_total ? ` / ${appStatus.memory_total}` : ''}` : resourceMetrics[1].value,
      percent: memoryPercent,
    },
    {
      id: 'disk',
      label: 'DISK',
      value: appStatus?.disk_used ? `${appStatus.disk_used}${appStatus.disk_total ? ` / ${appStatus.disk_total}` : ''}` : resourceMetrics[2].value,
      percent: diskPercent,
    },
    {
      id: 'instance',
      label: 'INSTANCE',
      value: String(currentInstances),
      percent: instancePercent,
    },
  ];

  return (
    <S.PageWrapper>
      <S.TopCard>
        <S.AppName>{appName}</S.AppName>

        <S.TopContent>
          <S.OverviewArea>
            <S.StatGrid>
              {topSummaryMetrics.map((item) => (
                <S.StatItem key={item.id}>
                  <S.StatLabel>{item.label}</S.StatLabel>
                  <S.StatValue>{item.value}</S.StatValue>
                </S.StatItem>
              ))}
            </S.StatGrid>

            <S.GithubSection>
              <S.BrandMark>
                <Image src="/assets/logo.svg" alt="M-ADP" width={66} height={66} />
              </S.BrandMark>
              <S.GithubTitle>GitHub - {repositoryLabel} : 애매하노</S.GithubTitle>
              <S.GithubDesc>
                애매하노. Contribute to {repositoryLabel} development by creating an account on GitHub.
              </S.GithubDesc>
              <S.GithubDesc>
                Contribute to {repositoryLabel} development by creating an account on GitHub.
              </S.GithubDesc>
              <S.GithubLinkRow>
                <Image src="/icons/github.svg" alt="github" width={20} height={20} />
                <S.GithubLink href={repositoryUrl} target="_blank" rel="noreferrer">
                  {repositoryUrl}
                </S.GithubLink>
              </S.GithubLinkRow>
            </S.GithubSection>
          </S.OverviewArea>

          <S.HealthArea>
            <S.CornerMenu>...</S.CornerMenu>
            <S.HealthLabel>상태</S.HealthLabel>
            <ProgressRing
              value={cpuPercent}
              max={100}
              size={184}
              strokeWidth={12}
              label={healthLabel}
              unit=""
              gradientStops={[
                { offset: 0, color: '#030982' },
                { offset: 67, color: '#1174F7' },
                { offset: 90, color: '#00C2FF' },
                { offset: 100, color: '#95E8FF' },
              ]}
              backgroundColor="transparent"
            />
          </S.HealthArea>
        </S.TopContent>
      </S.TopCard>

      <S.MiddleSection>
        <S.LogCard>
          <S.SectionHeader>
            <S.SectionTitle>최신 로그</S.SectionTitle>
          </S.SectionHeader>
          <S.LogList>
            {latestLogs.map((log, index) => (
              <S.LogItem key={`${projectId}-log-${index}`}>{log}</S.LogItem>
            ))}
          </S.LogList>
        </S.LogCard>

        <S.RightPanel>
          <S.UserStatsCard>
            <S.SectionHeader>
              <S.SectionTitle>사용자 통계</S.SectionTitle>
              <S.CardMenu>...</S.CardMenu>
            </S.SectionHeader>

            <S.UserChartArea>
              <Chart
                type="line"
                data={userStatsChartData}
                options={userStatsChartOptions}
                height={210}
              />
            </S.UserChartArea>

            <S.LegendList>
              {userStatsLegend.map((item) => (
                <S.LegendRow key={item.id}>
                  <S.LegendLeft>
                    <S.LegendDot $color={item.color} />
                    <S.LegendName>{item.label}</S.LegendName>
                  </S.LegendLeft>
                  <S.LegendValue>{item.value}</S.LegendValue>
                </S.LegendRow>
              ))}
            </S.LegendList>
          </S.UserStatsCard>

          <S.ResourceCard>
            <S.SectionHeader>
              <S.SectionTitle>자원 할당량</S.SectionTitle>
            </S.SectionHeader>

            <S.ResourceGrid>
              {dynamicResourceMetrics.map((item) => (
                <S.ResourceItem key={item.id}>
                  <S.ResourceLabel>{item.label}</S.ResourceLabel>
                  <S.ResourceValue>{item.value}</S.ResourceValue>
                  <ProgressBar value={item.percent} max={100} height={5} />
                </S.ResourceItem>
              ))}
            </S.ResourceGrid>
          </S.ResourceCard>
        </S.RightPanel>
      </S.MiddleSection>

      <S.BottomSection>
        <S.TrafficCard>
          <MultiLineChart
            title="트래픽"
            data={trafficData}
            legendData={[{ label: '트래픽', color: '#151EA9', value: '' }]}
            startDate={trafficStartDate}
            endDate={trafficEndDate}
            onStartDateChange={setTrafficStartDate}
            onEndDateChange={setTrafficEndDate}
            yAxisMax={500}
            yAxisUnit=""
            showMenu={false}
            height={320}
          />
        </S.TrafficCard>

        <S.RiskCard>
          <S.RiskHeader>
            <Image src="/icons/project/warning.svg" alt="warning" width={24} height={24} />
            <S.RiskTitle>Active Performance Risk</S.RiskTitle>
          </S.RiskHeader>

          <S.RiskName>최애의 사인 응답 지연 감지</S.RiskName>
          <S.RiskMeta>사용자 영향 : 이탈율 증가</S.RiskMeta>
          <S.RiskMeta>발생 시점 : 12분전</S.RiskMeta>
        </S.RiskCard>
      </S.BottomSection>
    </S.PageWrapper>
  );
}
