import { useQuery } from '@tanstack/react-query';
import { AppDeploymentInfo, AppDeploymentStatusItem, AppResourceStatus, getAppDetails, getAppLogs, getAppResourceStatus, getAppsByProjectId } from './app.api';

export const useAppsByProjectIdQuery = (projectId: string) => {
    return useQuery<AppDeploymentStatusItem[]>({
        queryKey: ['apps', 'list', projectId],
        queryFn: async () => {
            const response = await getAppsByProjectId(projectId);
            return response.data ?? [];
        },
        enabled: projectId.length > 0,
        staleTime: 1000 * 30,
    });
};

export const useAppResourceStatusQuery = (projectId: string, appName: string) => {
    return useQuery<AppResourceStatus | null>({
        queryKey: ['apps', 'status', projectId, appName],
        queryFn: async () => {
            const response = await getAppResourceStatus(projectId, appName);
            return response.data ?? null;
        },
        enabled: projectId.length > 0 && appName.length > 0,
        refetchInterval: 1000 * 10,
        staleTime: 1000 * 5,
    });
};

export const useAppDetailsQuery = (projectId: string, appName: string) => {
    return useQuery<AppDeploymentInfo | null>({
        queryKey: ['apps', 'details', projectId, appName],
        queryFn: async () => {
            const response = await getAppDetails(projectId, appName);
            return response.data ?? null;
        },
        enabled: projectId.length > 0 && appName.length > 0,
        staleTime: 1000 * 30,
    });
};

export const useAppLogsQuery = (projectId: string, appName: string) => {
    return useQuery<string[]>({
        queryKey: ['apps', 'logs', projectId, appName],
        queryFn: async () => {
            const response = await getAppLogs(projectId, appName);
            const rawLogs = response.data;
            if (!rawLogs || rawLogs.trim().length === 0) return [];
            return rawLogs
                .split(/\r?\n/g)
                .map((line) => line.trimEnd())
                .filter((line) => line.length > 0);
        },
        enabled: projectId.length > 0 && appName.length > 0,
        refetchInterval: 1000 * 10,
        staleTime: 1000 * 5,
    });
};
