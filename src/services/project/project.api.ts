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