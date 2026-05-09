import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "XCOM | The Rebel Pit",
  description: "Join the XCOM rebellion against Nikita. Roast, earn $XCOM, and reclaim the pit.",
  keywords: ["XCOM", "Solana", "Rebellion", "Meme", "Crypto", "Nikita"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-black text-white selection:bg-primary/30 selection:text-white overflow-hidden`}>
        <AuthProvider>
          <Shell>{children}</Shell>
          <Toaster 
            theme="dark" 
            position="bottom-right" 
            toastOptions={{
              className: "bg-black border border-white/10 text-white font-sans",
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
