import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isInvitationPage = /^\/projects\/[^/]+\/member-invitations\/[^/]+$/.test(pathname);
    const isAuthPage = pathname === '/login' || pathname.startsWith('/oauth2/callback');
    const isPublicPath = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/assets') || pathname.startsWith('/icons') || pathname === '/favicon.ico';

    if (isPublicPath || isInvitationPage) {
        return NextResponse.next();
    }

    if (!token && !isAuthPage) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
