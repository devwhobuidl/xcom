import { HomeClient } from "@/components/feed/HomeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let session = null;
  let isDbConnected = false;
  
  try {
    // Attempt to get session - this might fail if DB is down or NEXTAUTH_SECRET is missing
    session = await getServerSession(authOptions).catch(() => null);
    
    // Quick probe to ensure DB is responsive
    const probe = await prisma.user.count({ take: 1 }).catch((e) => {
      console.error("HOME_DB_PROBE_FAILED:", e.message);
      return null;
    });
    
    if (probe !== null) {
      isDbConnected = true;
    }
    
  } catch (error: any) {
    console.error("HOME_PAGE_CRITICAL_ERROR:", error.message);
    isDbConnected = false;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-black animate-pulse" />}>
      <HomeClient session={session} isDbConnected={isDbConnected} />
    </Suspense>
  );
}
