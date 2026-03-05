import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const targetUrl = `${baseUrl}/auth/oauth2/authorization/github`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
            },
            redirect: 'manual',
        });

        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('location');
            if (redirectUrl) {
                return NextResponse.json({ url: redirectUrl });
            }
        }

        const responseBody = await response.text();

        console.log('[API Proxy] 백엔드 응답 상태:', response.status);
        console.log('[API Proxy] 백엔드 응답 본문 전체:', responseBody);

        if (response.ok) {
            try {
                const data = JSON.parse(responseBody);
                if (data.url) return NextResponse.json({ url: data.url });
            } catch (e) {
            }
        }

        return NextResponse.json({
            error: '리다이렉션 URL 추출 실패',
            backendStatus: response.status,
            backendBody: responseBody
        }, { status: 500 });

    } catch (error: any) {
        console.error('[API Proxy] Github 연동 리다이렉션 추출 실패:', error);
        return NextResponse.json({
            error: '서버 내부 통신 에러',
            message: error.message
        }, { status: 500 });
    }
}
