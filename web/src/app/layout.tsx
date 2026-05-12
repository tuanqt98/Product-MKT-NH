import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Đời Buồn JQK - Marketing AI",
  description: "Hệ thống quản lý Marketing AI dành riêng cho công ty Nhật Hàn",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Đời Buồn JQK",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className={cn(inter.className, "mesh-gradient min-h-screen")}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:pl-72 min-h-screen relative">
            <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
