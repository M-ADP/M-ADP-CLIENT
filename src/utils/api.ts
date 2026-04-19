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
        const text = await response.text();
        try {
            return JSON.parse(text) as T;
        } catch {
            const safeParsed = text.replace(
                /(?<=[:{[,])\s*(\d{16,})\s*(?=[,}\]])/g,
                '"$1"'
            );
            return JSON.parse(safeParsed) as T;
        }
    }
    return response.text() as T;
};

export const api = async <T = unknown>(endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<T> => {
    const token = Cookies.get('token');
    const isLocalProxyEndpoint = endpoint.startsWith('/api/');
    const requestUrl = `${isLocalProxyEndpoint ? '' : BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (requireAuth && token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(requestUrl, {
            ...options,
            headers,
            credentials: 'include',
        });
    } catch (error) {
        // 백엔드에서 401 시 CORS 헤더를 누락하여 브라우저가 TypeError(Failed to fetch)를 던지는 경우를 대비한 우회(편법) 처리
        if (error instanceof TypeError) {
            if (isLocalProxyEndpoint) {
                throw new Error('요청을 전송하지 못했습니다. 잠시 후 다시 시도해주세요.');
            }
            console.error('>>> [api.ts] 네트워크 에러(CORS 차단 등) 감지됨. 401 만료로 가정하고 토큰 갱신 시도');
            try {
                const newToken = await getRefreshedToken();
                if (!newToken) {
                    throw new Error('인증 갱신에 실패했습니다.');
                }

                const retryResponse = await fetch(requestUrl, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${newToken}`,
                    },
                    credentials: 'include',
                });

                if (!retryResponse.ok) {
                    const errorData = await retryResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || 'API 요청에 실패했습니다.');
                }
                return parseResponse<T>(retryResponse);
            } catch (retryError) {
                throw error;
            }
        }
        throw error;
    }

    if (response.status === 401) {
        if (isLocalProxyEndpoint) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '인증이 필요합니다. 다시 로그인해주세요.');
        }
        const newToken = await getRefreshedToken();

        if (!newToken) {
            throw new Error('인증 갱신에 실패했습니다.');
        }

        const retryResponse = await fetch(requestUrl, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newToken}`,
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
