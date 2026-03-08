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

export interface DeploymentItem {
    id: string;
    name: string;
    runtime: string;
    pod_count: number;
    exposed_port: number;
    cpu_usage_percent: number;
    ram_usage_percent: number;
    health_status: 'Stopped' | 'Healthy' | 'Unhealthy' | string;
}

export interface MetricPoint {
    timestamp: string;
    value: number;
}

export interface PortResponse {
    id: string;
    project_id: string;
    from_ip: string;
    from_port: number;
    port_number: number;
    protocol: string;
}

export interface ProjectDetail {
    id: string;
    name: string;
    my_role: 'OWNER' | 'VIEWER';
    deployments: DeploymentItem[];
    cpu_usage: MetricPoint[];
    memory_usage: MetricPoint[];
    disk_usage: MetricPoint[];
    network_usage: MetricPoint[];
    traffic_per_hour: MetricPoint[];
    ports: PortResponse[];
}

export interface ProjectDetailResponse {
    message: string;
    data: ProjectDetail;
}

export const getProjectById = (projectId: string) => {
    return api<ProjectDetailResponse>(`/projects/${projectId}`);
};