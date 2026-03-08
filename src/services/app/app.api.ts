import { api } from '@/utils/api';

export interface AppCreatePayload {
    name: string;
    port?: number;
    cpu?: number;
    memory?: number;
    disk?: number;
    project_id: string;
}

export const postCreateApp = (payload: AppCreatePayload) => {
    return api('/apps', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};