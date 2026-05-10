"use client";

import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "./WalletProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthModalProvider } from "./AuthModalProvider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WalletProvider>
        <AuthModalProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" closeButton />
        </AuthModalProvider>
      </WalletProvider>
    </SessionProvider>
  );
}
