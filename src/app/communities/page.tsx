import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Users, Plus, Hash, Search, Zap } from "lucide-react";
import Link from "next/link";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CommunitiesPage() {
  let communities: any[] = [];
  let joinedCommunityIds: Set<string> = new Set();

  try {
    const session = await getServerSession(authOptions);
    
    const [allCommunities, joined] = await Promise.all([
      prisma.community.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { members: true, posts: true }
          }
        }
      }),
      session?.user ? prisma.communityMember.findMany({
        where: { userId: (session.user as any).id },
        select: { communityId: true }
      }) : Promise.resolve([])
    ]);

    communities = allCommunities;
    joinedCommunityIds = new Set(joined.map(j => j.communityId));
  } catch (error) {
    console.error("COMMUNITIES_PAGE_FETCH_ERROR:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero / Header */}
      <div className="relative overflow-hidden p-8 border-b border-white/10 bg-zinc-950">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-lg rotate-[-5deg]">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">District Network</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
              The <span className="text-primary underline decoration-4 underline-offset-4">Districts</span>
            </h1>
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest mt-2 max-w-md italic leading-relaxed">
              Find your clan. Colonize the region. Roast Nikita into oblivion with your fellow rebels.
            </p>
          </div>
          
          <Link 
            href="/communities/create" 
            className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-tighter text-sm flex items-center gap-3 hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-primary/30 rounded-xl"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Establish District
          </Link>
        </div>

        {/* Search Bar Placeholder */}
        <div className="mt-12 relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <input 
            type="text" 
            placeholder="Search for a district frequency..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/10 uppercase tracking-tight"
          />
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {communities.map((community) => (
          <CommunityCard 
            key={community.id} 
            isJoined={joinedCommunityIds.has(community.id)}
            community={{
              ...community,
              memberCount: community._count?.members || 0
            }} 
          />
        ))}
        
        {communities.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center text-center gap-6 border-2 border-dashed border-white/5 rounded-[40px] bg-zinc-950/50">
            <div className="p-6 bg-zinc-900 rounded-full">
              <Zap className="w-12 h-12 text-white/10" />
            </div>
            <div>
              <p className="text-xl font-black italic text-white/20 uppercase tracking-widest">No districts established</p>
              <p className="text-sm font-bold text-white/10 uppercase tracking-widest mt-2">Be the first to claim a territory</p>
            </div>
            <Link 
              href="/communities/create" 
              className="px-6 py-3 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white/40 hover:border-primary hover:text-primary transition-all"
            >
              Establish Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
