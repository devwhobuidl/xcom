import { HomeClient } from "@/components/feed/HomeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let session = null;
  
  try {
    // Only check session, don't touch Prisma directly here
    session = await getServerSession(authOptions).catch(() => null);
  } catch (error) {
    console.error("AUTH_CHECK_FAILED:", error);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-black animate-pulse" />}>
      <HomeClient session={session} />
    </Suspense>
  );
}
