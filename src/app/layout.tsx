import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

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
        {/* The Boundary is now at the absolute top, but Providers are moved deeper */}
        <GlobalErrorBoundary>
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Suspense>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
