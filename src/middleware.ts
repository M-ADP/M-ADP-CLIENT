import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname === '/login' || pathname.startsWith('/oauth2/callback');
    const isPublicPath =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/assets') ||
        pathname.startsWith('/icons') ||
        pathname.startsWith('/system-error') ||
        pathname === '/favicon.ico';

    if (isPublicPath) {
        return NextResponse.next();
    }

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
