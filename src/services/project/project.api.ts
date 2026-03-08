import { api } from '@/utils/api';

export interface ProjectCreatePayload {
    name: string;
    cpu?: string;
    memory?: string;
    disk?: string;
}

export interface ProjectCreateResponse {
    message: string;
    data: {
        namespace_id: string;
        name: string;
        resource_quota_id: string;
        limits: Record<string, string>;
    };
}

export const postCreateProject = (payload: ProjectCreatePayload) => {
    return api<ProjectCreateResponse>('/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export interface DeploymentSummary {
    running: number;
    warning: number;
}

export interface DeploymentStatus {
    state: string;
    message: string;
}

export interface ProjectListItem {
    id: string;
    name: string;
    my_role: string;
    domain: string;
    deployment_summary: DeploymentSummary;
    deployment_status: DeploymentStatus;
}

export interface ProjectListResponse {
    message: string;
    data: {
        items: ProjectListItem[];
        has_next: boolean;
    };
}

export interface ProjectListParams {
    cursor?: string | null;
    limit?: number;
}

export const getProjects = (params?: ProjectListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return api<ProjectListResponse>(`/projects${query ? `?${query}` : ''}`);
};