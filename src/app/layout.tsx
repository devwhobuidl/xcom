import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers/RootProvider";
import { Shell } from "@/components/layout/Shell";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { Suspense } from "react";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "xcommunity.fun | The $XCOM Rebellion",
  description: "Official home of the $XCOM community. Fuck You Nikita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen overflow-x-hidden bg-black text-white`}
      >
        {/* Global UI Effects */}
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.05),transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scanline opacity-30" />
        </div>

        <GlobalErrorBoundary>
          <RootProvider>
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <Shell rightSidebar={<RightSidebar />}>
                {children}
              </Shell>
            </Suspense>
          </RootProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
