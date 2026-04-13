'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ProgressBar from '@/components/ui/Charts/ProgressBar/ui';
import ProgressRing from '@/components/ui/Charts/ProgressRing/ui';
import * as S from './style';
import { useDeleteAppMutation, usePatchAppResourcesMutation } from '@/services/app/app.mutation';
import {
  useAppDeploymentsQuery,
  useAppDetailsQuery,
  useAppLogsQuery,
  useAppResourceStatusQuery,
} from '@/services/app/app.query';
import { resourceMetrics } from './data';

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

const getStatusRingValue = (status: string | undefined) => {
  if (!status) return 0;
  const normalized = status.trim().toLowerCase();
  if (normalized === 'healthy' || normalized === 'running') return 100;
  if (normalized === 'unhealthy' || normalized === 'error' || normalized === 'failed') return 30;
  if (normalized === 'stopped' || normalized === 'stop') return 10;
  return 0;
};

const promptNumber = (label: string, initialValue: number) => {
  const input = window.prompt(label, String(initialValue));
  if (input === null) return null;
  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

const normalizeRepositoryUrl = (value: string | undefined) => {
  const raw = value?.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^github\.com\//i.test(raw)) return `https://${raw}`;
  if (raw.includes('/')) return `https://github.com/${raw.replace(/^\/+/, '')}`;
  return '';
};

const parseLogTimestamp = (line: string) => {
  const matched = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\s?(.*)$/);
  if (!matched) {
    return {
      timestamp: '',
      message: line,
      rawTimestamp: '',
    };
  }

  const [, rawTimestamp, message] = matched;
  const timestampDate = new Date(rawTimestamp);
  const timestamp = Number.isNaN(timestampDate.getTime())
    ? rawTimestamp
    : timestampDate.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return {
    timestamp,
    message,
    rawTimestamp,
  };
};

export default function AppManageContainer({ projectId }: AppManageContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appNameFromQuery = (searchParams.get('appName') || '').trim();
  const appDeploymentsQuery = useAppDeploymentsQuery(projectId);
  const deployments = appDeploymentsQuery.data ?? [];
  const appName = useMemo(() => {
    if (deployments.length === 0) return appNameFromQuery;
    if (appNameFromQuery && deployments.some((deployment) => deployment.name === appNameFromQuery)) {
      return appNameFromQuery;
    }
    return deployments[0]?.name ?? appNameFromQuery;
  }, [deployments, appNameFromQuery]);
  const appDetailsQuery = useAppDetailsQuery(projectId, appName || null);
  const appDetails = appDetailsQuery.data;
  const appLogsQuery = useAppLogsQuery(projectId, appName || null);
  const appStatusQuery = useAppResourceStatusQuery(projectId, appName || null);
  const appStatus = appStatusQuery.data;
  const patchResourcesMutation = usePatchAppResourcesMutation();
  const deleteAppMutation = useDeleteAppMutation();

  const cpuPercent = clampPercent(appStatus?.cpu_usage_percentage ?? 74);
  const memoryPercent = toRatioPercent(appStatus?.memory_used, appStatus?.memory_total);
  const diskPercent = toRatioPercent(appStatus?.disk_used, appStatus?.disk_total);
  const currentInstances = appStatus?.current_instances ?? 2;
  const availableInstances = appStatus?.available_instances ?? 2;
  const totalInstances = currentInstances + availableInstances;
  const instancePercent = totalInstances > 0 ? clampPercent(Math.round((currentInstances / totalInstances) * 100)) : 0;
  const repositoryUrl = normalizeRepositoryUrl(appDetails?.github_repository_url);
  const repositoryLabel = repositoryUrl
    ? repositoryUrl.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '')
    : '연결된 저장소 없음';
  const statusLabelFromDetails = formatStatusLabel(appDetails?.status);
  const healthLabel = statusLabelFromDetails || 'Unknown';
  const statusRingValue = getStatusRingValue(appDetails?.status);
  const githubSummary = repositoryUrl
    ? `${repositoryLabel} 저장소가 현재 앱과 연결되어 있습니다.`
    : 'GitHub 저장소가 아직 연결되지 않았습니다.';
  const appIdValue = appDetails?.app_id ? String(appDetails.app_id) : '-';
  const topSummaryMetrics: Array<{ id: string; label: string; value: string; fullValue?: string }> = [
    {
      id: 'app_id',
      label: '앱 ID',
      value: appDetails?.app_id ? String(appDetails.app_id) : '-',
      fullValue: appIdValue,
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
      value: healthLabel,
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
  const renderedLogs = appLogsQuery.isPending
    ? ['로그를 불러오는 중입니다.']
    : !appName
      ? ['조회 가능한 애플리케이션이 없습니다.']
    : appLogsQuery.isError
      ? ['로그 조회에 실패했습니다.']
      : appLogsQuery.data && appLogsQuery.data.length > 0
        ? appLogsQuery.data
        : ['표시할 로그가 없습니다.'];
  const formattedLogs = renderedLogs.map((log, index) => {
    const parsed = parseLogTimestamp(log);
    return {
      id: `${projectId}-log-${index}-${log.slice(0, 16)}`,
      line: String(index + 1).padStart(3, '0'),
      timestamp: parsed.timestamp,
      rawTimestamp: parsed.rawTimestamp,
      text: parsed.message,
      isBlank: parsed.message.trim().length === 0,
    };
  });
  const openRepository = () => {
    if (!repositoryUrl) return;
    window.open(repositoryUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePatchResources = async () => {
    if (patchResourcesMutation.isPending) return;
    const applicationId = appDetails?.app_id;
    if (!applicationId) {
      alert('앱 ID를 확인할 수 없습니다.');
      return;
    }

    const parsedMemoryTotal = parseNumber(appStatus?.memory_total);
    const parsedDiskTotal = parseNumber(appStatus?.disk_total);
    const defaultCpu = Math.min(4, Math.max(1, Math.round(cpuPercent / 25) || 1));
    const defaultMemory = Math.min(2048, Math.max(512, parsedMemoryTotal === null ? 512 : Math.round(parsedMemoryTotal)));
    const defaultDisk = Math.min(16, Math.max(2, parsedDiskTotal === null ? 2 : Math.round(parsedDiskTotal)));

    const maxCpu = promptNumber('max_cpu (1~4)', defaultCpu);
    if (maxCpu === null || maxCpu < 1 || maxCpu > 4) {
      alert('max_cpu는 1~4 정수여야 합니다.');
      return;
    }

    const maxMemory = promptNumber('max_memory (512~2048)', defaultMemory);
    if (maxMemory === null || maxMemory < 512 || maxMemory > 2048) {
      alert('max_memory는 512~2048 정수여야 합니다.');
      return;
    }

    const maxDisk = promptNumber('max_disk (2~16)', defaultDisk);
    if (maxDisk === null || maxDisk < 2 || maxDisk > 16) {
      alert('max_disk는 2~16 정수여야 합니다.');
      return;
    }

    try {
      const result = await patchResourcesMutation.mutateAsync({
        application_id: applicationId,
        max_cpu: maxCpu,
        max_memory: maxMemory,
        max_disk: maxDisk,
      });
      alert(result.message || '자원 정보가 변경되었습니다.');
      await Promise.all([appStatusQuery.refetch(), appDetailsQuery.refetch()]);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert('자원 정보 변경에 실패했습니다.');
    }
  };

  const handleDeleteApp = async () => {
    if (deleteAppMutation.isPending) return;
    const applicationId = appDetails?.app_id;
    if (!applicationId) {
      alert('앱 ID를 확인할 수 없습니다.');
      return;
    }

    const confirmed = window.confirm(`"${appName || '선택된 앱'}"을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const result = await deleteAppMutation.mutateAsync({
        application_id: applicationId,
      });
      alert(result.message || '앱이 삭제되었습니다.');
      router.push(`/project/manage/${projectId}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert('앱 삭제에 실패했습니다.');
    }
  };

  const handleActionMenu = () => {
    if (patchResourcesMutation.isPending || deleteAppMutation.isPending) return;
    if (!appName) {
      alert('조회 가능한 애플리케이션이 없습니다.');
      return;
    }
    const action = window.prompt('작업 선택: 1=자원 변경, 2=앱 삭제', '1');
    if (action === '2') {
      void handleDeleteApp();
      return;
    }
    if (action === '1') {
      void handlePatchResources();
    }
  };

  if (appDeploymentsQuery.isPending && deployments.length === 0) {
    return (
      <S.PageWrapper>
        <p>애플리케이션 목록을 불러오는 중입니다.</p>
      </S.PageWrapper>
    );
  }

  if (appDeploymentsQuery.isError) {
    return (
      <S.PageWrapper>
        <p>애플리케이션 목록 조회에 실패했습니다.</p>
      </S.PageWrapper>
    );
  }

  if (deployments.length === 0) {
    return (
      <S.PageWrapper>
        <p>배포된 애플리케이션이 없습니다.</p>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.TopCard>
        <S.AppName>{appName || '애플리케이션'}</S.AppName>

        <S.TopContent>
          <S.OverviewArea>
            <S.StatGrid>
              {topSummaryMetrics.map((item) => (
                <S.StatItem key={item.id} title={item.id === 'app_id' ? (item.fullValue ?? item.value) : undefined}>
                  <S.StatLabel>{item.label}</S.StatLabel>
                  <S.StatValue $compact={item.id === 'app_id'} title={item.fullValue ?? item.value}>{item.value}</S.StatValue>
                </S.StatItem>
              ))}
            </S.StatGrid>

            <S.GithubSection
              $clickable={Boolean(repositoryUrl)}
              onClick={openRepository}
              title={repositoryUrl || '연결된 저장소가 없습니다.'}
            >
              <S.BrandMark>
                <Image src="/assets/logo.svg" alt="M-ADP" width={66} height={66} />
              </S.BrandMark>
              <S.GithubTitle>GitHub - {repositoryLabel}</S.GithubTitle>
              <S.GithubDesc>{githubSummary}</S.GithubDesc>
              <S.GithubDesc>
                {repositoryUrl ? '카드를 클릭하면 GitHub 저장소로 이동합니다.' : '저장소 연결 후 상세 정보를 확인할 수 있습니다.'}
              </S.GithubDesc>
              <S.GithubLinkRow>
                <Image src="/icons/github.svg" alt="github" width={20} height={20} />
                {repositoryUrl ? (
                  <S.GithubLink href={repositoryUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                    {repositoryLabel}
                  </S.GithubLink>
                ) : (
                  <S.GithubLinkPlaceholder>연결된 저장소 없음</S.GithubLinkPlaceholder>
                )}
              </S.GithubLinkRow>
            </S.GithubSection>
          </S.OverviewArea>

          <S.HealthArea>
            <S.CornerMenu onClick={handleActionMenu}>
              {patchResourcesMutation.isPending || deleteAppMutation.isPending ? '...' : '...'}
            </S.CornerMenu>
            <S.HealthLabel>상태</S.HealthLabel>
            <ProgressRing
              value={statusRingValue}
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
            <S.LogCount>{formattedLogs.length} lines</S.LogCount>
          </S.SectionHeader>
          <S.LogList>
            {formattedLogs.map((log) => (
              <S.LogItem key={log.id}>
                <S.LogLine>{log.line}</S.LogLine>
                <S.LogTime title={log.rawTimestamp || undefined}>
                  {log.timestamp || '--:--:--'}
                </S.LogTime>
                <S.LogText>{log.isBlank ? '\u00A0' : log.text}</S.LogText>
              </S.LogItem>
            ))}
          </S.LogList>
        </S.LogCard>

        <S.RightPanel>
          <S.UserStatsCard>
            <S.SectionHeader>
              <S.SectionTitle>사용자 통계</S.SectionTitle>
            </S.SectionHeader>
            <S.FeaturePlaceholder>
              추후에 추가될 기능입니다.
            </S.FeaturePlaceholder>
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
          <S.SectionHeader>
            <S.SectionTitle>트래픽</S.SectionTitle>
          </S.SectionHeader>
          <S.FeaturePlaceholder>
            추후에 추가될 기능입니다.
          </S.FeaturePlaceholder>
        </S.TrafficCard>

        <S.RiskCard>
          <S.RiskHeader>
            <Image src="/icons/project/warning.svg" alt="warning" width={24} height={24} />
            <S.RiskTitle>Active Performance Risk</S.RiskTitle>
          </S.RiskHeader>
          <S.RiskName>추후에 추가될 기능입니다.</S.RiskName>
        </S.RiskCard>
      </S.BottomSection>
    </S.PageWrapper>
  );
}
