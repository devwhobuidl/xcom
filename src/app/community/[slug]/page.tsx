import { getCommunityBySlug } from "@/app/actions/community";
import { PostCard } from "@/components/feed/PostCard";
import { JoinButton } from "@/components/communities/JoinButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Users, MessageSquare } from "lucide-react";

export default async function CommunityPage({ params }: { params: { slug: string } }) {
  const community = await getCommunityBySlug(params.slug);

  if (!community) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: { communityId: community.id, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      reactions: true,
      _count: { select: { reactions: true, replies: true } }
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Community Banner & Header */}
      <div className="h-48 bg-zinc-900 relative">
        {community.banner && <img src={community.banner} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      <div className="px-6 -mt-12 relative z-10 space-y-4 pb-6 border-b border-white/10">
        <div className="flex justify-between items-end">
          <Avatar className="w-24 h-24 border-4 border-black bg-zinc-800">
            <AvatarImage src={community.avatar || ""} />
            <AvatarFallback className="bg-primary/20 text-primary font-black text-2xl italic">
              {community.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <JoinButton communityId={community.id} />
        </div>

        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">{community.name}</h1>
          <p className="text-white/40 font-mono text-sm">c/{community.slug}</p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 max-w-2xl">{community.description}</p>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2 text-white/50">
            <Users className="w-4 h-4" />
            <span className="font-bold text-white">{community.memberCount}</span> Rebels
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <MessageSquare className="w-4 h-4" />
            <span className="font-bold text-white">{community._count.posts}</span> Roasts
          </div>
        </div>
      </div>

      <div className="flex-1 divide-y divide-white/5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post as any} />
        ))}
        {posts.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="text-4xl">🕳️</div>
             <p className="text-white/40 font-black italic uppercase tracking-widest text-sm">No roasts in this cell yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
