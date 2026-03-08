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

export interface ReissueResponse {
    key: string;
}

export const postReissue = async (): Promise<ReissueResponse> => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await fetch(`${BASE_URL}/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('토큰 재발급에 실패했습니다.');
    }

    return response.json();
};