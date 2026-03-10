import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
    console.error('>>> [api.ts] refreshToken() called! BASE_URL is:', BASE_URL);
    try {
        const reissueRes = await fetch(`${BASE_URL}/auth/reissue`, {
            method: 'POST',
            credentials: 'include',
        });
        console.error('>>> [api.ts] reissue API response ok:', reissueRes.ok, 'status:', reissueRes.status);

        if (reissueRes.ok) {
            const data = await reissueRes.json();
            // 백엔드 명세에 따라 key 또는 access_token 확인
            const token = data.key || data.access_token;
            if (token) {
                Cookies.set('token', token, { path: '/' });
                return token;
            }
        }
    } catch (error) {
        console.error('Token refresh network error:', error);
    }

    Cookies.remove('token', { path: '/' });
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
};

const getRefreshedToken = async (): Promise<string | null> => {
    if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json() as T;
    }
    return response.text() as T;
};

export const api = async <T = unknown>(endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<T> => {
    const token = Cookies.get('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (requireAuth && token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (response.status === 401) {
        console.error('>>> [api.ts] 401 Error Detected! Calling getRefreshedToken()');
        try {
            const newToken = await getRefreshedToken();
            console.error('>>> [api.ts] getRefreshedToken() finished with:', newToken);

            if (!newToken) {
                console.error('>>> [api.ts] newToken is empty, throwing error');
                throw new Error('인증 갱신에 실패했습니다.');
            }

            console.error('>>> [api.ts] retrying original request with new token');
            const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${newToken}`,
                },
                credentials: 'include',
            });

            if (!retryResponse.ok) {
                console.error('>>> [api.ts] retryResponse not ok:', retryResponse.status);
                const errorData = await retryResponse.json().catch(() => ({}));
                throw new Error(errorData.message || 'API 요청에 실패했습니다.');
            }

            return parseResponse<T>(retryResponse);
        } catch (e) {
            console.error('>>> [api.ts] Error during refresh token flow:', e);
            throw e;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API 요청에 실패했습니다.');
    }

    return parseResponse<T>(response);
};

