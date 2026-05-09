import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Share2, History, Award, Calendar } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { format } from "date-fns";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { walletAddress: (session.user as any).walletAddress },
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
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      },
      pointsLog: {
        take: 5,
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <ProfileHeader user={user} />

      <div className="mt-4 px-6 space-y-6">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            {user.username || `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`}
          </h2>
          <p className="text-white/40 font-mono text-sm">{user.walletAddress.slice(0, 8)}...</p>
        </div>

        {user.bio && (
          <p className="text-[15px] leading-relaxed text-white/90">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Zap className="w-4 h-4 fill-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Points</span>
            </div>
            <div className="text-2xl font-black italic">{user.points.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-green-500 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
            </div>
            <div className="text-2xl font-black italic">{user.streak} Days</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Referrals</span>
            </div>
            <div className="text-2xl font-black italic">0</div>
          </div>
        </div>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Recruit New Rebels</div>
          <div className="flex gap-2">
            <code className="flex-1 bg-black/50 p-2 rounded text-xs font-mono text-white/70 border border-white/10 truncate">
              https://xcommunity.fun?ref={user.referralCode}
            </code>
            <button className="bg-primary text-white px-4 rounded font-bold text-xs hover:scale-105 active:scale-95 transition-all">
              COPY
            </button>
          </div>
          <p className="text-[10px] text-white/30 italic">Earn 10% of their hate points forever.</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-6 border-b border-white/10 text-sm font-bold uppercase tracking-widest">
            <button className="pb-4 border-b-2 border-primary text-white">Your Roasts</button>
            <button className="pb-4 text-white/30 hover:text-white transition-colors">Point History</button>
          </div>

          <div className="divide-y divide-white/5">
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post as any} currentUserId={user.id} />
            ))}
            {user.posts.length === 0 && (
              <div className="py-20 text-center text-white/20 italic font-mono">
                You haven't roasted Nikita yet. What are you waiting for?
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
