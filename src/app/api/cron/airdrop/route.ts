import { NextResponse } from "next/server";
import { processDailyAirdrop } from "@/lib/solana/airdrop";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const result = await processDailyAirdrop();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Cron airdrop failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
