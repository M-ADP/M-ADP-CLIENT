export interface ProjectCreatePayload {
    name: string;
    max_cpu?: number;
    max_memory?: number;
    max_disk?: number;
}

export interface ProjectCreateResponse {
    message: string;
    data: {
        id: string;
        user_id: string;
        name: string;
        max_cpu: number;
        max_memory: number;
        max_disk: number;
    };
}

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

export interface DeploymentItem {
    id: string | number;
    name: string;
    runtime?: string;
    pod_count: number;
    exposed_port: number;
    cpu_usage_percent: number;
    ram_usage_percent: number;
    health_status: 'RUNNING' | 'PENDING' | 'Stopped' | 'Healthy' | 'Unhealthy' | string;
}

export interface MetricPoint {
    timestamp: string;
    value: number;
}


export interface ResourceUsage {
    limit: string | number;
    used: string | number;
    percentage: number;
    unit?: string;
}

export interface ProjectResource {
    project_id: string | number;
    cpu: ResourceUsage;
    memory: ResourceUsage;
    disk: ResourceUsage;
    instance: ResourceUsage;
}

export interface ProjectDetail {
    id: string | number;
    name: string;
    my_role: 'OWNER' | 'VIEWER';
    deployments: DeploymentItem[];
    resource: ProjectResource;
}

export interface ProjectDetailResponse {
    message: string;
    data: ProjectDetail;
}

export interface UpdateProjectNamePayload {
    name: string;
}

export interface UpdateProjectResourcePayload {
    max_cpu?: number | null;
    max_memory?: number | null;
    max_disk?: number | null;
}

export interface ProjectMemberResponse {
    user_id: string;
    username: string;
    profile_image: string | null;
    role: 'OWNER' | 'VIEWER';
    joined_at: string;
}

export interface CursorPageProjectMemberResponse {
    items: ProjectMemberResponse[];
    has_next: boolean;
}

export interface ProjectMembersListResponse {
    message: string;
    data: CursorPageProjectMemberResponse;
}

export interface ProjectMembersParams {
    cursor?: string | null;
    limit?: number;
}

export interface AddProjectMemberPayload {
    user_id: string;
}

export interface ProjectOwnerTransferPayload {
    target_user_id: string;
}
