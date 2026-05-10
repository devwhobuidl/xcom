import { HomeClient } from "@/components/feed/HomeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let session = null;
  let isDbConnected = true;
  
  try {
    // We attempt to get the session and do a simple count to verify DB connectivity
    session = await getServerSession(authOptions);
    
    // Quick probe to ensure DB is responsive
    await prisma.user.count().catch((e) => {
      console.error("HOME_DB_PROBE_FAILED:", e.message);
      isDbConnected = false;
    });
    
  } catch (error: any) {
    console.error("HOME_PAGE_ERROR:", error.message);
    isDbConnected = false;
  }

  return <HomeClient session={session} isDbConnected={isDbConnected} />;
}
