import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-expect-error: CSS import side effects are handled by Next.js
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from "@/components/layout/app-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppStoreSyncProvider } from "@/components/providers/app-store-sync-provider";

export const metadata: Metadata = {
  title: {
    template: `%s | ${String(process.env.NEXT_PUBLIC_APP_NAME)}`,
    default: String(process.env.NEXT_PUBLIC_APP_NAME),
  },
  description: String(process.env.NEXT_PUBLIC_APP_DESCRIPTION),
  metadataBase: new URL(String(process.env.NEXT_PUBLIC_BASE_URL)),
};
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body
        className={`antialiased bg-bg-layout text-foreground min-h-screen flex flex-col  py-0 ${inter.className}`}
      >
        <div className="app-bg min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider>
                <AppStoreSyncProvider>
                  <AuthBootstrap />
                  <AppHeader />
                  <main className="flex-1 w-full px-10">{children}</main>
                  <Toaster richColors position="top-right" />
                </AppStoreSyncProvider>
              </TooltipProvider>
            </QueryProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
