import { HomeClient } from "@/components/feed/HomeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions).catch(() => null);
  } catch (error) {
    console.error("AUTH_CHECK_FAILED:", error);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-black animate-pulse flex items-center justify-center">
      <div className="text-red-600 font-black italic uppercase tracking-tighter text-2xl">Initializing The Pit...</div>
    </div>}>
      <HomeClient session={session} />
    </Suspense>
  );
}
