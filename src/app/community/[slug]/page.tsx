import { getCommunityBySlug, getJoinedCommunities } from "@/app/actions/community";
import { CommunityFeed } from "@/components/feed/CommunityFeed";
import { Composer } from "@/components/feed/Composer";
import { Users, Skull, Target, Zap, Flame, Shield, ChevronLeft, MoreHorizontal, Share2, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JoinButton } from "@/components/communities/JoinButton";

const ICON_MAP: Record<string, any> = {
  "nikita-haters": Skull,
  "solana-chads": Zap,
  "meme-lords": Flame,
  "chaos-engine": Shield,
  "rebel-base": Target,
};

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  const session = await getServerSession(authOptions);

  if (!community) {
    notFound();
  }

  const joinedCommunities = await getJoinedCommunities();
  const isJoined = joinedCommunities.some(c => c.id === community.id);
  const Icon = ICON_MAP[slug] || Users;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Banner Area */}
      <div className="relative">
        <div className="h-48 sm:h-64 bg-zinc-900 overflow-hidden relative">
          {community.banner ? (
            <img src={community.banner} alt={community.name} className="w-full h-full object-cover opacity-70" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black to-black">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <Link href="/communities" className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-primary transition-all group z-20">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="absolute top-4 right-4 flex gap-2 z-20">
             <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/10 transition-all">
                <Share2 className="w-5 h-5" />
             </button>
             <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/10 transition-all">
                <MoreHorizontal className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Community Info Overlay */}
        <div className="px-6 pb-6 -mt-12 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-black rounded-[2.5rem] shadow-2xl overflow-hidden">
                <AvatarImage src={community.avatar || ""} />
                <AvatarFallback className="bg-zinc-900 text-primary">
                  <Icon className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-xl border-4 border-black shadow-xl">
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col mb-1">
              <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">
                {community.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white">{community.memberCount.toLocaleString()}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Rebels</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white">{community._count.posts.toLocaleString()}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Posts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
             {session && (
               <JoinButton communityId={community.id} isJoined={isJoined} />
             )}
          </div>
        </div>
      </div>

      {/* Description & About */}
      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed font-medium">
          {community.description || "The rebellion is growing. Join the frontlines of chaos and roast Nikita into oblivion."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 sticky top-0 z-20 bg-black/95 backdrop-blur-md">
        <button className="flex-1 py-4 text-sm font-black italic uppercase tracking-tighter text-white relative group">
          CHAOS FEED
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
        </button>
        <button className="flex-1 py-4 text-sm font-bold uppercase tracking-tight text-white/30 hover:text-white/50 transition-colors">
          MEMBERS
        </button>
        <button className="flex-1 py-4 text-sm font-bold uppercase tracking-tight text-white/30 hover:text-white/50 transition-colors">
          ABOUT
        </button>
      </div>

      {/* Post & Feed */}
      <div className="flex-1">
        {session && isJoined && (
          <div className="border-b border-white/5">
            <Composer 
              placeholder={`Post to ${community.name}...`} 
              initialCommunityId={community.id}
            />
          </div>
        )}
        
        <div className="bg-black">
          <CommunityFeed activeTab={community.id} />
        </div>
      </div>
    </div>
  );
}
