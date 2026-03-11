import { useQuery } from '@tanstack/react-query';
import { AppDeploymentInfo, AppDeploymentStatusItem, AppResourceStatus, getAppDetails, getAppResourceStatus, getAppsByProjectId } from './app.api';

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
