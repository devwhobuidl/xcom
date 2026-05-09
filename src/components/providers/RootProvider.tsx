"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "./WalletProvider";
import { Toaster } from "@/components/ui/sonner";

export const RootProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <WalletProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </WalletProvider>
    </SessionProvider>
  );
};
