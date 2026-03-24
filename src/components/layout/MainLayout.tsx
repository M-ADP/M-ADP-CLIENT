'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/ui/Sidebar/ui";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname.startsWith('/oauth2/callback');

    if (isAuthPage) {
        return <>{children}</>;
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