'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Chart from '@/components/ui/Charts/Chart/ui';
import MultiLineChart from '@/components/ui/Charts/MultiLineChart/ui';
import ProgressBar from '@/components/ui/Charts/ProgressBar/ui';
import ProgressRing from '@/components/ui/Charts/ProgressRing/ui';
import * as S from './style';
import {
  APP_NAME,
  latestLogs,
  resourceMetrics,
  summaryMetrics,
  trafficChartData,
  userStatsChartData,
  userStatsChartOptions,
  userStatsLegend,
} from './data';

interface AppManageContainerProps {
  projectId: string;
}

export default function AppManageContainer({ projectId }: AppManageContainerProps) {
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

  return (
    <S.PageWrapper>
      <S.TopCard>
        <S.AppName>{APP_NAME}</S.AppName>

        <S.TopContent>
          <S.OverviewArea>
            <S.StatGrid>
              {summaryMetrics.map((item) => (
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
              <S.GithubTitle>GitHub - M-ADP/{APP_NAME.toLowerCase()} : 애매하노</S.GithubTitle>
              <S.GithubDesc>
                애매하노. Contribute to M-ADP/{APP_NAME.toLowerCase()} development by creating an account on GitHub.
              </S.GithubDesc>
              <S.GithubDesc>
                Contribute to M-ADP/{APP_NAME.toLowerCase()} development by creating an account on GitHub.
              </S.GithubDesc>
              <S.GithubLinkRow>
                <Image src="/icons/github.svg" alt="github" width={20} height={20} />
                <S.GithubLink href={`https://github.com/M-ADP/${APP_NAME.toLowerCase()}`} target="_blank" rel="noreferrer">
                  https://github.com/M-ADP/{APP_NAME.toLowerCase()}
                </S.GithubLink>
              </S.GithubLinkRow>
            </S.GithubSection>
          </S.OverviewArea>

          <S.HealthArea>
            <S.CornerMenu>...</S.CornerMenu>
            <S.HealthLabel>상태</S.HealthLabel>
            <ProgressRing
              value={74}
              max={100}
              size={184}
              strokeWidth={12}
              label="Healthy"
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
              {resourceMetrics.map((item) => (
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
