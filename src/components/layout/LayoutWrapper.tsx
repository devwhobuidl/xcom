"use client";

import { usePathname } from "next/navigation";
import { Shell } from "./Shell";
import { RightSidebar } from "./RightSidebar";
import { RootProvider } from "../providers/RootProvider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Always wrap in RootProvider and Shell for the "Twitter-clone" look
  // Use a slightly different logic if we ever want a pure landing page again, 
  // but for now, the user wants the "Pit" UI everywhere.
  
  return (
    <RootProvider>
      <Shell rightSidebar={<RightSidebar />}>
        {children}
      </Shell>
    </RootProvider>
  );
}
