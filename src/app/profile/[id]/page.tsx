import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Award, ShieldAlert, Calendar } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { FollowButton } from "@/components/social/FollowButton";
import { format } from "date-fns";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  let user = null;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: id },
          { id: id },
          { walletAddress: id }
        ]
      },
      include: {
        posts: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            author: true,
            reactions: true,
            _count: { select: { reactions: true, replies: true } }
          }
        },
        followers: true,
        following: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    });
  } catch (error) {
    console.error("PROFILE_PAGE_FETCH_ERROR:", error);
  }

  if (!user) return notFound();

  if (session?.user && (session.user as any).id === user.id) {
    redirect("/profile");
  }

  const isFollowing = session?.user 
    ? user.followers.some(f => f.followerId === (session.user as any).id)
    : false;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-48 bg-zinc-900 border-b border-white/5">
        {user.bannerImage && (
          <img src={user.bannerImage} className="w-full h-full object-cover" alt="Banner" />
        )}
        <div className="absolute -bottom-16 left-6">
          <Avatar className="w-32 h-32 border-4 border-black rounded-full">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-secondary text-primary text-4xl font-black">
              {user.username?.slice(0, 2) || user.walletAddress.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-20 px-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                {user.username || `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`}
              </h2>
              {user.points > 10000 && (
                <ShieldAlert className="w-5 h-5 text-primary" />
              )}
            </div>
            <p className="text-white/40 font-mono text-sm">@{user.walletAddress.slice(0, 8)}...</p>
          </div>
          <FollowButton 
            userId={user.id} 
            isFollowing={isFollowing} 
            isLoggedIn={!!session?.user} 
          />
        </div>

        {user.bio && (
          <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Joined {format(new Date(user.createdAt), "MMMM yyyy")}
          </div>
          <div className="flex gap-4">
            <button className="hover:underline decoration-white/20">
              <span className="font-bold text-white">{user._count.following}</span> Following
            </button>
            <button className="hover:underline decoration-white/20">
              <span className="font-bold text-white">{user._count.followers}</span> Followers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Zap className="w-4 h-4 fill-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Chaos Points</span>
            </div>
            <div className="text-2xl font-black italic">{user.points.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-green-500 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Roast Streak</span>
            </div>
            <div className="text-2xl font-black italic">{user.streak} Days</div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10">
          <div className="flex gap-6 text-sm font-bold uppercase tracking-widest pt-4 mb-4">
            <button className="pb-4 border-b-2 border-primary text-white">Roasts</button>
            <button className="pb-4 text-white/30 hover:text-white transition-colors">Media</button>
            <button className="pb-4 text-white/30 hover:text-white transition-colors">Likes</button>
          </div>

          <div className="divide-y divide-white/5">
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id} />
            ))}
            {user.posts.length === 0 && (
              <div className="py-20 text-center text-white/20 italic font-mono">
                No roasts found. This user is too soft.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
