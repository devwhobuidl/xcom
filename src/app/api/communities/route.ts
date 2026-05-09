import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { members: true, posts: true }
      }
    }
  });

  return NextResponse.json(communities);
}
