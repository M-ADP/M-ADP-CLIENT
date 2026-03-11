import { api } from '@/utils/api';

export interface AppCreatePayload {
    name: string;
    port?: number;
    cpu?: number;
    memory?: number;
    disk?: number;
    project_id: number;
}

export interface AppCreateResponse {
    message?: string;
    data?: number;
}

export const postCreateApp = (payload: AppCreatePayload) => {
    return api<AppCreateResponse>('/apps', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export interface AppDeploymentStatusItem {
    name?: string;
    pod_count?: number;
    port?: number;
    cpu_usage_percentage?: number;
    memory_usage_percentage?: number;
}

export interface AppDeploymentStatusListResponse {
    message?: string;
    data?: AppDeploymentStatusItem[];
}

export const getAppsByProjectId = (projectId: string) => {
    const query = new URLSearchParams({ project_id: projectId }).toString();
    return api<AppDeploymentStatusListResponse>(`/apps?${query}`, {
        method: 'GET',
    });
};

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

export interface AppResourceStatusResponse {
    message?: string;
    data?: AppResourceStatus;
}

export const getAppResourceStatus = (projectId: string, appName: string) => {
    const query = new URLSearchParams({
        project_id: projectId,
        app_name: appName,
    }).toString();
    return api<AppResourceStatusResponse>(`/apps/status?${query}`, {
        method: 'GET',
    });
};

export interface AppDeploymentInfo {
    app_id?: number;
    port?: number;
    resource_use_percentage?: number;
    github_repository_url?: string;
    status?: string;
}

export interface AppDeploymentInfoResponse {
    message?: string;
    data?: AppDeploymentInfo;
}

export const getAppDetails = (projectId: string, appName: string) => {
    const query = new URLSearchParams({
        project_id: projectId,
        app_name: appName,
    }).toString();
    return api<AppDeploymentInfoResponse>(`/apps/details?${query}`, {
        method: 'GET',
    });
};

export interface AppLogsResponse {
    message?: string;
    data?: string;
}

export const getAppLogs = (projectId: string, appName: string) => {
    const query = new URLSearchParams({
        project_id: projectId,
        app_name: appName,
    }).toString();
    return api<AppLogsResponse>(`/apps/logs?${query}`, {
        method: 'GET',
    });
};
