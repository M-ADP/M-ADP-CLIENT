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
export interface GithubAllowedRepository {
    repository_full_name: string;
    repository_profile: string;
}

export const getGithubAllowedRepositories = () => {
    return api<GithubAllowedRepository[]>('/apps/github/allowed-repositories', {
        method: 'GET',
    });
};

export interface UpdateGithubInfoPayload {
    appDeploymentId: number | string;
    owner: string;
    repository: string;
    branch?: string;
}

export const patchGithubInfo = (payload: UpdateGithubInfoPayload) => {
    return api('/apps/github', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};
