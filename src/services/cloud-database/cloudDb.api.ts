import { api } from '@/utils/api';
import {
    CloudDbListResponse,
    CloudDbDetailResponse,
    CreateCloudDbPayload,
    UpdateCloudDbPayload,
    SqlExecuteRequest,
    SqlExecuteResponse,
} from '@/types/cloudDatabase';

const buildQuery = (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        searchParams.set(key, String(value));
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

export const getCloudDbs = (projectId: string) => {
    return api<CloudDbListResponse>(`/clouddb${buildQuery({ project_id: projectId })}`, {
        method: 'GET',
    });
};

export const getCloudDb = (cloudDbId: string, projectId: string) => {
    return api<CloudDbDetailResponse>(`/clouddb/${cloudDbId}${buildQuery({ project_id: projectId })}`, {
        method: 'GET',
    });
};

export const postCreateCloudDb = (payload: CreateCloudDbPayload) => {
    return api<CloudDbDetailResponse>('/clouddb', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const patchUpdateCloudDb = (cloudDbId: string, projectId: string, payload: UpdateCloudDbPayload) => {
    return api(`/clouddb/${cloudDbId}${buildQuery({ project_id: projectId })}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const deleteCloudDb = (cloudDbId: string, projectId: string) => {
    return api(`/clouddb/${cloudDbId}${buildQuery({ project_id: projectId })}`, {
        method: 'DELETE',
    });
};

export const postExecuteSql = (cloudDbId: string, projectId: string, payload: SqlExecuteRequest) => {
    return api<SqlExecuteResponse>(`/clouddb/${cloudDbId}/sql${buildQuery({ project_id: projectId })}`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};
