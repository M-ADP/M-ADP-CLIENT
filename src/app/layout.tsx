import type { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import QueryProvider from "@/components/providers/QueryProvider";
import ClarityProvider from "@/components/providers/ClarityProvider";

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
        <ClarityProvider />
        <QueryProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
