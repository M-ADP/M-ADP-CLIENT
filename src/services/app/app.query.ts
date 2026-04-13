import { useQuery } from '@tanstack/react-query';
import {
    getGithubAllowedRepositories,
    GithubAllowedRepository,
    getAppsByProjectId,
    AppDeploymentStatusItem,
    getAppDetails,
    AppDeploymentInfo,
    getAppLogs,
    getAppResourceStatus,
    AppResourceStatus,
    ApiResponse,
} from './app.api';

const unwrap = <T>(response: ApiResponse<T> | T | undefined, fallback: T): T => {
    if (!response) return fallback;
    if (typeof response === 'object' && response !== null && 'data' in response) {
        return ((response as ApiResponse<T>).data ?? fallback) as T;
    }
    return response as T;
};

export const useGithubAllowedRepositoriesQuery = (appId: string | null) => {
    return useQuery<GithubAllowedRepository[]>({
        queryKey: ['githubAllowedRepositories', appId],
        queryFn: async () => {
            const response = await getGithubAllowedRepositories();
            return unwrap<GithubAllowedRepository[]>(response, []);
        },
        enabled: !!appId,
    });
};

export const useAppDeploymentsQuery = (projectId: string) => {
    return useQuery<AppDeploymentStatusItem[]>({
        queryKey: ['appDeployments', projectId],
        queryFn: async () => {
            const response = await getAppsByProjectId(projectId);
            return unwrap<AppDeploymentStatusItem[]>(response, []);
        },
        enabled: !!projectId,
    });
};

export const useAppDetailsQuery = (projectId: string, appName: string | null) => {
    return useQuery<AppDeploymentInfo>({
        queryKey: ['appDetails', projectId, appName],
        queryFn: async () => {
            const response = await getAppDetails(projectId, appName as string);
            return unwrap<AppDeploymentInfo>(response, {});
        },
        enabled: !!projectId && !!appName,
    });
};

export const useAppLogsQuery = (projectId: string, appName: string | null) => {
    return useQuery<string[]>({
        queryKey: ['appLogs', projectId, appName],
        queryFn: async () => {
            const response = await getAppLogs(projectId, appName as string);
            const rawLogs = unwrap<string>(response, '');
            if (!rawLogs) return [];
            const lines = rawLogs
                .split('\n')
                .map((line: string) => line.replace(/\r$/, ''));
            const hasVisibleLine = lines.some((line) => line.trim().length > 0);
            return hasVisibleLine ? lines : [];
        },
        enabled: !!projectId && !!appName,
    });
};

export const useAppResourceStatusQuery = (projectId: string, appName: string | null) => {
    return useQuery<AppResourceStatus>({
        queryKey: ['appResourceStatus', projectId, appName],
        queryFn: async () => {
            const response = await getAppResourceStatus(projectId, appName as string);
            return unwrap<AppResourceStatus>(response, {});
        },
        enabled: !!projectId && !!appName,
    });
};
