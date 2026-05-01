import { useQuery } from '@tanstack/react-query';
import { getCloudDbs, getCloudDb } from './cloudDb.api';

export const useCloudDbsQuery = (projectId: string) => {
    return useQuery({
        queryKey: ['cloudDbs', projectId],
        queryFn: () => getCloudDbs(projectId),
        select: (response) => response.data ?? [],
        enabled: !!projectId,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });
};

export const useCloudDbQuery = (cloudDbId: string, projectId: string) => {
    return useQuery({
        queryKey: ['cloudDb', cloudDbId, projectId],
        queryFn: () => getCloudDb(cloudDbId, projectId),
        select: (response) => response.data,
        enabled: !!cloudDbId && !!projectId,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });
};
