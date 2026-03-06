const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

let isRefreshing = false;

export const api = async (endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<any> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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

    if (response.status === 401 && requireAuth && !isRefreshing) {
        isRefreshing = true;
        try {
            const reissueRes = await fetch(`${BASE_URL}/auth/reissue`, {
                method: 'POST',
                credentials: 'include',
            });

            if (reissueRes.ok) {
                const data = await reissueRes.json();
                if (data.key) {
                    localStorage.setItem('token', data.key);
                }

                const retryHeaders = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${data.key}`,
                    ...options.headers,
                };

                const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                    ...options,
                    headers: retryHeaders,
                    credentials: 'include',
                });

                isRefreshing = false;

                if (!retryResponse.ok) {
                    const errorData = await retryResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || 'API 요청에 실패했습니다.');
                }

                const contentType = retryResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return retryResponse.json();
                }
                return retryResponse.text();
            } else {
                isRefreshing = false;
                localStorage.removeItem('token');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
            }
        } catch (error) {
            isRefreshing = false;
            throw error;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API 요청에 실패했습니다.');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};
