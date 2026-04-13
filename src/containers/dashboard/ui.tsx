'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as S from './style';
import { WelcomeHeroCard } from '@/components/dashboard/WelcomeHeroCard/ui';
import { SummaryMetricsCard } from '@/components/dashboard/SummaryMetricsCard/ui';
import { ResourceAllocation } from '@/components/ui/ResourceAllocation/ui';
import { useProjectListQuery } from '@/services/project/project.query';
import { getProjectById } from '@/services/project/project.api';
import { useUserProfileQuery } from '@/services/user/user.query';
import { SummaryMetric } from '@/types/dashboard';
import { useUserStore } from '@/store/userStore';
import { average, clampPercent, parseNumeric, toResourceRatioPercent } from './utils';

export default function DashboardContainer() {
  const { data: userProfile } = useUserProfileQuery();
  const user = useUserStore((state) => state.user);
  const projectListQuery = useProjectListQuery({ limit: 20 });
  const projectItems = projectListQuery.data?.items ?? [];
  const userName = userProfile?.nickname || userProfile?.github_id || user?.nickname || user?.github_id || '류승찬';

  const projectDetailsQuery = useQuery({
    queryKey: ['dashboardProjectDetails', projectItems.map((item) => String(item.id)).join(',')],
    queryFn: async () => {
      const detailResponses = await Promise.all(
        projectItems.map(async (project) => {
          const detailResponse = await getProjectById(String(project.id));
          return {
            id: String(project.id),
            name: project.name,
            detail: detailResponse.data,
          };
        })
      );
      return detailResponses;
    },
    enabled: projectItems.length > 0,
    staleTime: 1000 * 60,
  });

  const detailRows = projectDetailsQuery.data ?? [];
  const resourceProjects = detailRows.slice(0, 3).map((row) => {
    const resource = row.detail.resource;
    const memoryCurrent = parseNumeric(resource?.memory?.used);
    const memoryMaxRaw = parseNumeric(resource?.memory?.limit);
    const memoryMax = memoryMaxRaw > 0 ? memoryMaxRaw : Math.max(memoryCurrent, 1);
    const diskCurrent = parseNumeric(resource?.disk?.used);
    const diskMaxRaw = parseNumeric(resource?.disk?.limit);
    const diskMax = diskMaxRaw > 0 ? diskMaxRaw : Math.max(diskCurrent, 1);
    const instanceCurrent = parseNumeric(resource?.instance?.used);
    const instanceMaxRaw = parseNumeric(resource?.instance?.limit);
    const instanceMax = instanceMaxRaw > 0 ? instanceMaxRaw : Math.max(instanceCurrent, 1);

    return {
      id: row.id,
      name: `${row.name} 자원 할당량`,
      allocation: {
        cpu: clampPercent(resource?.cpu?.percentage ?? 0),
        memory: {
          current: Number(memoryCurrent.toFixed(1)),
          max: Number(memoryMax.toFixed(1)),
        },
        disk: {
          current: Number(diskCurrent.toFixed(1)),
          max: Number(diskMax.toFixed(1)),
        },
        instance: {
          current: Math.round(instanceCurrent),
          max: Math.max(1, Math.round(instanceMax)),
        },
      },
    };
  });

  const allDeployments = detailRows.flatMap((row) => row.detail.deployments ?? []);
  const totalDeployments = allDeployments.length;
  const unhealthyCount = allDeployments.filter((deployment) => {
    const health = String(deployment.health_status || '').toLowerCase();
    return health === 'unhealthy' || health === 'stopped' || health === 'pending';
  }).length;
  const errorRate = totalDeployments > 0 ? clampPercent((unhealthyCount / totalDeployments) * 100) : 0;

  const cpuAverage = clampPercent(average(detailRows.map((row) => row.detail.resource?.cpu?.percentage ?? 0)));
  const memoryAverage = clampPercent(average(detailRows.map((row) => {
    const memory = row.detail.resource?.memory;
    return memory?.percentage ?? toResourceRatioPercent(memory?.used, memory?.limit);
  })));
  const diskAverage = clampPercent(average(detailRows.map((row) => {
    const disk = row.detail.resource?.disk;
    return disk?.percentage ?? toResourceRatioPercent(disk?.used, disk?.limit);
  })));

  const summaryMetrics: SummaryMetric[] = [
    {
      id: 'visitors',
      label: '방문자',
      value: '추후 추가 예정',
      percentage: 0,
      comingSoon: true,
      helperText: '실제 데이터 준비 중',
    },
    {
      id: 'cpu',
      label: 'CPU',
      value: `${cpuAverage}%`,
      percentage: cpuAverage,
    },
    {
      id: 'mem',
      label: 'MEM',
      value: `${memoryAverage}%`,
      percentage: memoryAverage,
    },
    {
      id: 'traffic',
      label: '트래픽',
      value: '추후 추가 예정',
      percentage: 0,
      comingSoon: true,
      helperText: '실제 데이터 준비 중',
    },
    {
      id: 'disk',
      label: 'DISK',
      value: `${diskAverage}%`,
      percentage: diskAverage,
    },
    {
      id: 'error_rate',
      label: '오류율',
      value: `${errorRate}%`,
      percentage: errorRate,
    },
  ];

  if (projectListQuery.isPending) {
    return (
      <S.DashboardLayout>
        <p>대시보드 데이터를 불러오는 중입니다.</p>
      </S.DashboardLayout>
    );
  }

  if (projectListQuery.isError || projectDetailsQuery.isError) {
    return (
      <S.DashboardLayout>
        <p>대시보드 데이터 조회에 실패했습니다.</p>
      </S.DashboardLayout>
    );
  }

  if (projectDetailsQuery.isPending && detailRows.length === 0 && projectItems.length > 0) {
    return (
      <S.DashboardLayout>
        <p>프로젝트 상세 데이터를 불러오는 중입니다.</p>
      </S.DashboardLayout>
    );
  }

  return (
    <S.DashboardLayout>

      <S.TopSection>
        <WelcomeHeroCard userName={userName} />
        <SummaryMetricsCard title="누리 요약" metrics={summaryMetrics} />
      </S.TopSection>

      <S.BottomSection>
        <S.ChartArea>
          <S.TrafficPlaceholderCard>
            <S.TrafficPlaceholderHeader>
              <S.TrafficPlaceholderTitle>{detailRows[0]?.name || '프로젝트 트래픽'}</S.TrafficPlaceholderTitle>
            </S.TrafficPlaceholderHeader>
            <S.TrafficPlaceholderBody>
              트래픽 그래프는 추후에 추가될 기능입니다.
            </S.TrafficPlaceholderBody>
          </S.TrafficPlaceholderCard>
        </S.ChartArea>
        <ResourceAllocation projects={resourceProjects} />
      </S.BottomSection>

    </S.DashboardLayout>
  );
}
