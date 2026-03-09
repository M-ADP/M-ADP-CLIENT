import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
    const reissueRes = await fetch(`${BASE_URL}/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
    });

    if (reissueRes.ok) {
        const data = await reissueRes.json();
        if (data.key) {
            Cookies.set('token', data.key, { path: '/' });
            return data.key;
        }
    }

    Cookies.remove('token');
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

    const headers = {
        'Content-Type': 'application/json',
        ...(requireAuth && token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (response.status === 401 && requireAuth) {
        const newToken = await getRefreshedToken();

        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newToken}`,
                ...options.headers,
            },
            credentials: 'include',
        });

        if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'API 요청에 실패했습니다.');
        }

        return parseResponse<T>(retryResponse);
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API 요청에 실패했습니다.');
    }

    return parseResponse<T>(response);
};

