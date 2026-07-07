'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/ui/Sidebar/ui";
import PageTransition from "@/components/layout/PageTransition";
import TopProgressBar from "@/components/layout/TopProgressBar";
import FirstVisitGuide from "@/components/ui/FirstVisitGuide/ui";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname.startsWith('/oauth2/callback');
    const sectionKey = pathname.split('/').filter(Boolean)[0] ?? 'root';

    if (isAuthPage) {
        return (
            <>
                <TopProgressBar />
                <PageTransition routeKey={sectionKey}>{children}</PageTransition>
            </>
        );
    }

    return (
        <>
            <TopProgressBar />
            <div style={{ display: 'flex', width: '100%' }}>
                <Sidebar />
                <main style={{ flex: 1, minWidth: 0, height: '100vh', overflow: 'hidden' }}>
                    <PageTransition routeKey={sectionKey}>{children}</PageTransition>
                </main>
            </div>
            {pathname !=='/docs' && <FirstVisitGuide />}
        </>
    );
}
