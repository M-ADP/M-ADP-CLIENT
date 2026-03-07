'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from "@/components/ui/Sidebar/ui";
import { useAuthStore } from '@/store/authStore';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const isAuthPage = pathname === '/login' || pathname.startsWith('/oauth2/callback');

    useEffect(() => {
        if (!isAuthPage && !token) {
            router.replace('/login');
        }
    }, [isAuthPage, token, router]);

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (!token) {
        return null;
    }

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <Sidebar />
            <main style={{ flex: 1, minWidth: 0 }}>
                {children}
            </main>
        </div>
    );
}