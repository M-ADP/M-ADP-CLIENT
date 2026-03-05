import { api } from '@/utils/api';

export interface AuthCodePayload {
    code: string;
}

export interface AuthResponse {
    access_token?: string;
}

export const postAuthCode = (payload: AuthCodePayload) => {
    return api('/auth/code', {
        method: 'POST',
        body: JSON.stringify(payload),
    }, false) as Promise<AuthResponse>;
};