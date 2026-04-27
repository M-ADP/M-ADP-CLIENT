import { api } from '@/utils/api';

export interface ApiResponse<T> {
    message?: string;
    data?: T;
}

export interface AppCreatePayload {
    name: string;
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
    application_id: string | number;
    max_cpu: number;
    max_memory: number;
    max_disk: number;
}

export interface DeleteAppPayload {
    application_id: string | number;
}

export interface DnsEndpointItem {
    id: string | number;
    project_id: string | number;
    deployment_id: string | number;
    subdomain: string;
    deployment_type: string;
    service_type?: string;
}

export interface DnsEndpointPage {
    cursor: number | null;
    items: DnsEndpointItem[];
}

export interface CreateDnsEndpointPayload {
    deploymentId: string | number;
    project_id: string | number;
    deployment_type: 'CloudDB' | 'App Deployment';
    subdomain?: string;
}

export interface UpdateDnsEndpointPayload {
    dnsId: string | number;
    subdomain: string;
}

export interface CreateSecretRequestPayload {
    projectId: string;
    appName: string;
    data: Record<string, string>;
}

export interface CreateSecretResponse {
    namespace: string;
    app_name: string;
    path: string;
    policy_name: string;
    role_name: string;
}

export interface DeleteSecretRequestPayload {
    projectId: string;
    appName: string;
    secret_names: string[];
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

export const getDnsEndpoints = (projectId: string, cursor?: number, limit?: number) => {
    const query = buildQueryString({
        cursor,
        limit,
    });
    return api<ApiResponse<DnsEndpointPage> | DnsEndpointPage>(`/dns/${projectId}${query}`, {
        method: 'GET',
    });
};

export const postCreateDnsEndpoint = (payload: CreateDnsEndpointPayload) => {
    const { deploymentId, ...body } = payload;
    return api<ApiResponse<DnsEndpointItem> | DnsEndpointItem>(`/dns/${deploymentId}`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
};

export const deleteDnsEndpoint = (dnsId: string | number) => {
    return api<ApiResponse<DnsEndpointItem> | DnsEndpointItem>(`/dns/${String(dnsId)}`, {
        method: 'DELETE',
    });
};

export const putUpdateDnsEndpoint = (payload: UpdateDnsEndpointPayload) => {
    const { dnsId, subdomain } = payload;
    return api<ApiResponse<DnsEndpointItem> | DnsEndpointItem>(`/dns/${String(dnsId)}`, {
        method: 'PUT',
        body: JSON.stringify({ subdomain }),
    });
};

export const getSecretNames = (projectId: string, appName: string) => {
    return api<ApiResponse<string[]> | string[]>(`/apps/${projectId}/${encodeURIComponent(appName)}/secrets`, {
        method: 'GET',
    });
};

export const postCreateSecret = (payload: CreateSecretRequestPayload) => {
    const { projectId, appName, data } = payload;
    return api<ApiResponse<CreateSecretResponse> | CreateSecretResponse>(`/apps/${projectId}/${encodeURIComponent(appName)}/secrets`, {
        method: 'POST',
        body: JSON.stringify({ data }),
    });
};

export const deleteSecret = (payload: DeleteSecretRequestPayload) => {
    const { projectId, appName, secret_names } = payload;
    return api(`/apps/${projectId}/${encodeURIComponent(appName)}/secrets`, {
        method: 'DELETE',
        body: JSON.stringify({ secret_names }),
    });
};
