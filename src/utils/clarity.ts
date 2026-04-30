import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  role?: string;
  [key: string]: unknown;
}

export function identifyClarity(accessToken: string) {
  if (typeof window === 'undefined') return;

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);

    const identify = () => {
      const clarity = (window as any).clarity;
      if (!clarity) return;
      if (decoded.sub) clarity('identify', decoded.sub);
      if (decoded.role) clarity('set', 'role', decoded.role);
    };

    if ((window as any).clarity) {
      identify();
    } else {
      const interval = setInterval(() => {
        if ((window as any).clarity) {
          identify();
          clearInterval(interval);
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 5000);
    }
  } catch (e) {
    console.error('[Clarity] 사용자 식별 실패:', e);
  }
}