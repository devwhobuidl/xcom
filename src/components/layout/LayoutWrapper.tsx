"use client";

import { usePathname } from "next/navigation";
import { Shell } from "./Shell";
import { RightSidebar } from "./RightSidebar";
import { RootProvider } from "../providers/RootProvider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // Completely bypass Shell, Sidebars, AND Providers for the landing page
  // This makes the landing page 100% static and immune to JS/Provider crashes
  if (isLanding) {
    return <main>{children}</main>;
  }

  return (
    <RootProvider>
      <Shell rightSidebar={<RightSidebar />}>
        {children}
      </Shell>
    </RootProvider>
  );
}
