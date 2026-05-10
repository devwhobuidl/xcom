import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Award, ShieldAlert, Calendar, AlertCircle } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { FollowButton } from "@/components/social/FollowButton";
import { format } from "date-fns";
import Link from "next/link";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

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
    console.error("PROFILE_FETCH_ERROR:", error);
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">REBEL NOT FOUND</h2>
        <p className="text-white/40 mt-2 max-w-xs">This user hasn't joined the rebellion yet or has been terminated.</p>
        <Link href="/" className="mt-6 bg-white text-black px-8 py-3 rounded-2xl font-black uppercase italic hover:bg-zinc-200 transition-all">Back to The Pit</Link>
      </div>
    );
  }

  // Redirect to own profile if it's the current user
  if (session?.user && (session.user as any).id === user.id) {
    redirect("/profile");
  }

  const isFollowing = session?.user 
    ? user.followers.some(f => f.followerId === (session.user as any).id)
    : false;

  const displayName = user.username || (user.walletAddress ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : "Unknown Rebel");

  try {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="relative h-48 bg-zinc-900 border-b border-white/5">
          {user.bannerImage && (
            <img src={user.bannerImage} className="w-full h-full object-cover" alt="Banner" />
          )}
          <div className="absolute -bottom-16 left-6">
            <Avatar className="w-32 h-32 border-4 border-black rounded-full shadow-2xl">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-zinc-800 text-primary text-4xl font-black italic">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="mt-20 px-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  {displayName}
                </h2>
                {user.points > 10000 && (
                  <ShieldAlert className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-white/40 font-mono text-sm">@{user.walletAddress?.slice(0, 8) || "0xREBEL"}...</p>
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
              Joined {format(new Date(user.createdAt || Date.now()), "MMMM yyyy")}
            </div>
            <div className="flex gap-4">
              <button className="hover:underline decoration-white/20">
                <span className="font-bold text-white">{user._count?.following || 0}</span> Following
              </button>
              <button className="hover:underline decoration-white/20">
                <span className="font-bold text-white">{user._count?.followers || 0}</span> Followers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Zap className="w-4 h-4 fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Chaos Points</span>
              </div>
              <div className="text-2xl font-black italic">{(user.points || 0).toLocaleString()}</div>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Roast Streak</span>
              </div>
              <div className="text-2xl font-black italic">{user.streak || 0} Days</div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10">
            <div className="flex gap-6 text-sm font-bold uppercase tracking-widest pt-4 mb-4 overflow-x-auto">
              <button className="pb-4 border-b-2 border-primary text-white whitespace-nowrap">Roasts</button>
              <button className="pb-4 text-white/30 hover:text-white transition-colors whitespace-nowrap">Media</button>
              <button className="pb-4 text-white/30 hover:text-white transition-colors whitespace-nowrap">Likes</button>
            </div>

            <div className="divide-y divide-white/5">
              {(user.posts || []).map((post: any) => (
                <PostCard key={post.id} post={post} currentUserId={session?.user?.id} />
              ))}
              {(!user.posts || user.posts.length === 0) && (
                <div className="py-20 text-center text-white/20 italic font-mono border border-dashed border-white/5 rounded-3xl">
                  No roasts found. This user is too soft.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("PROFILE_PAGE_CRITICAL_ERROR:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <AlertCircle className="w-12 h-12 text-primary mb-4 animate-pulse" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Signal Lost</h2>
        <p className="text-white/40 mt-2 max-w-xs">The rebel frequency is jammed. We can't reach this profile.</p>
        <Link href="/" className="mt-6 text-primary font-black uppercase italic hover:underline">Back to The Pit</Link>
      </div>
    );
  }
}
