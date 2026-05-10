import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Trophy, Skull, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function LeaderboardPage() {
  const topHaters = await prisma.user.findMany({
    take: 50,
    orderBy: { points: "desc" },
    select: {
      id: true,
      username: true,
      walletAddress: true,
      image: true,
      points: true,
      _count: {
        select: { posts: true }
      }
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/10 text-center">
        <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">The Hall of Hate</h2>
        <p className="text-white/50 font-mono text-sm">The most dedicated rebels in the $XCOM ecosystem.</p>
      </div>

      <div className="divide-y divide-white/5">
        {topHaters.map((hater, i) => (
          <div key={hater.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
            <div className="w-8 text-center font-black italic text-xl text-white/20 group-hover:text-primary transition-colors">
              {i + 1}
            </div>
            
            <Avatar className="w-12 h-12 border border-white/10">
              <AvatarImage src={hater.image || ""} />
              <AvatarFallback className="bg-secondary text-primary font-bold">
                {hater.username?.slice(0, 2) || hater.walletAddress.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="font-bold text-lg">
                {hater.username || `${hater.walletAddress.slice(0, 4)}...${hater.walletAddress.slice(-4)}`}
              </div>
              <div className="text-xs text-white/40 font-mono uppercase">
                {hater._count.posts} Roasts Published
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-primary italic flex items-center gap-1 justify-end">
                <Zap className="w-4 h-4 fill-primary" />
                {hater.points.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Hate Points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
