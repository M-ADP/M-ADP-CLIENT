export interface ProjectCreatePayload {
    name: string;
    max_cpu?: number;
    max_memory?: number;
    max_disk?: number;
}

export interface ProjectCreateResponse {
    message: string;
    data: {
        id: number;
        user_id: number;
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

export interface PortCreate {
    from_ip: string;
    from_port: number;
    port_number: number;
    protocol: 'tcp' | 'udp' | 'icmp' | string;
}

export interface CreateProjectPortResponse {
    message: string;
    data: PortResponse;
}

export interface CursorPagePortResponse {
    items: PortResponse[];
    has_next: boolean;
}

export interface ProjectPortsListResponse {
    message: string;
    data: CursorPagePortResponse;
}

export interface ProjectPortsListParams {
    cursor?: string | null;
    limit?: number;
}

export interface PortUpdate {
    from_ip: string;
    from_port: number;
    port_number: number;
    protocol: 'tcp' | 'udp' | 'icmp' | string;
}

export interface UpdateProjectPortResponse {
    message: string;
    data: PortResponse;
}

export interface DeleteProjectPortResponse {
    message: string;
    data: PortResponse;
}
