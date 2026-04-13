import { api } from '@/utils/api';

export interface ApiResponse<T> {
    message?: string;
    data?: T;
}

export interface AppCreatePayload {
    name: string;
    port?: number;
    cpu?: number;
    memory?: number;
    disk?: number;
    project_id: string;
}

export interface AppCreateResponse {
    message?: string;
    data?: string;
}

export const postCreateApp = (payload: AppCreatePayload) => {
    return api<AppCreateResponse>('/apps', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};
export interface GithubAllowedRepository {
    repository_full_name: string;
    repository_profile: string;
}

export const getGithubAllowedRepositories = () => {
    return api<ApiResponse<GithubAllowedRepository[]> | GithubAllowedRepository[]>('/apps/github/allowed-repositories', {
        method: 'GET',
    });
};

export interface UpdateGithubInfoPayload {
    appDeploymentId: string | number;
    owner: string;
    repository: string;
    branch?: string;
}

export const patchGithubInfo = (payload: UpdateGithubInfoPayload) => {
    return api<ApiResponse<unknown>>('/apps/github', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export interface AppDeploymentStatusItem {
    name: string;
    pod_count?: number;
    port?: number;
    cpu_usage_percentage?: number;
    memory_usage_percentage?: number;
}

export interface AppDeploymentInfo {
    app_id?: number;
    port?: number;
    resource_use_percentage?: number;
    github_repository_url?: string;
    status?: string;
}

export interface AppResourceStatus {
    appId?: number;
    cpu_usage_percentage?: number;
    memory_used?: string;
    memory_total?: string;
    disk_used?: string;
    disk_total?: string;
    current_instances?: number;
    available_instances?: number;
}

export interface PatchAppResourcesPayload {
    application_id: number;
    max_cpu: number;
    max_memory: number;
    max_disk: number;
}

export interface DeleteAppPayload {
    application_id: number;
}

const buildQueryString = (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === '') return;
        searchParams.set(key, String(value));
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

export const getAppsByProjectId = (projectId: string) => {
    const query = buildQueryString({ project_id: projectId });
    return api<ApiResponse<AppDeploymentStatusItem[]> | AppDeploymentStatusItem[]>(`/apps${query}`, {
        method: 'GET',
    });
};

export const getAppLogs = (projectId: string, appName: string) => {
    const query = buildQueryString({ project_id: projectId, app_name: appName });
    return api<ApiResponse<string> | string>(`/apps/logs${query}`, {
        method: 'GET',
    });
};

export const getAppResourceStatus = (projectId: string, appName: string) => {
    const query = buildQueryString({ project_id: projectId, app_name: appName });
    return api<ApiResponse<AppResourceStatus> | AppResourceStatus>(`/apps/status${query}`, {
        method: 'GET',
    });
};

export const getAppDetails = (projectId: string, appName: string) => {
    const query = buildQueryString({ project_id: projectId, app_name: appName });
    return api<ApiResponse<AppDeploymentInfo> | AppDeploymentInfo>(`/apps/details${query}`, {
        method: 'GET',
    });
};

export const patchAppResources = (payload: PatchAppResourcesPayload) => {
    return api<ApiResponse<unknown>>('/apps/resources', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const deleteApp = (payload: DeleteAppPayload) => {
    return api<ApiResponse<unknown>>('/apps', {
        method: 'DELETE',
        body: JSON.stringify(payload),
    });
};
