import type { Metadata } from "next";
import Sidebar from "@/components/ui/Sidebar/ui";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "M-ADP",
  description: "부산소프트웨어마이스터고등학교 학생들을 위한 교내 클라우드 디벨로퍼 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <QueryProvider>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flex: 1, minWidth: 0 }}>
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
