import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthGuard } from "@/components/AuthGuard";
import InnerShell from "@/components/layout/InnerShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAllPrint - CRM ระบบบริหารงานพิมพ์",
  description: "CRM สำหรับธุรกิจพิมพ์ - จัดการลูกค้า งานผลิต และยอดขาย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthGuard>
              <InnerShell>{children}</InnerShell>
            </AuthGuard>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
