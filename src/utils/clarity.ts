import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub?: string;
    role?: string;
    [key: string]: unknown;
}

/**
 * Clarity에 사용자 식별 정보를 전송합니다.
 * 로그인 성공 후 호출해야 합니다.
 */
export function identifyClarity(accessToken: string) {
    if (typeof window === 'undefined') return;

    const clarity = (window as any).clarity;
    if (!clarity) return;

    try {
        const decoded = jwtDecode<JwtPayload>(accessToken);

        if (decoded.sub) {
            clarity('identify', decoded.sub);
        }

        if (decoded.role) {
            clarity('set', 'role', decoded.role);
        }
    } catch (e) {
        console.error('[Clarity] 사용자 식별 실패:', e);
    }
}
