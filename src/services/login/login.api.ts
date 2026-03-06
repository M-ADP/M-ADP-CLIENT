import { api } from '@/utils/api';

export interface AuthCodePayload {
    code: string;
}

export interface AuthResponse {
    access_token?: string;
    role?: string;
}

export const postAuthCode = (payload: AuthCodePayload) => {
    return api('/auth/code', {
        method: 'POST',
        body: JSON.stringify(payload),
    }, false) as Promise<AuthResponse>;
};

export const postLogout = () => {
    return api('/auth/logout', {
        method: 'POST',
    });
};