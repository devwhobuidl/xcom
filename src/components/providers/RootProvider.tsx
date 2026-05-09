"use client";

import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "./WalletProvider";
import { Toaster } from "@/components/ui/sonner";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WalletProvider>
        {children}
        <Toaster theme="dark" position="bottom-right" closeButton />
      </WalletProvider>
    </SessionProvider>
  );
}
