import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Users, Plus, Hash } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommunityCard } from "@/components/communities/CommunityCard";

export default async function CommunitiesPage() {
  let communities: any[] = [];
  try {
    communities = await prisma.community.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { members: true, posts: true }
        }
      }
    });
  } catch (error) {
    console.error("COMMUNITIES_PAGE_FETCH_ERROR:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 border-b border-white/10 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Districts
          </h2>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">Join the regional resistance</p>
        </div>
        
        <Link 
          href="/communities/create" 
          className="px-6 py-3 bg-white text-black font-black uppercase tracking-tighter text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New District
        </Link>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community as any} />
        ))}
        {communities.length === 0 && (
          <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-white/20 italic font-mono">No districts established yet. Be the first to colonize.</p>
          </div>
        )}
      </div>
    </div>
  );
}
