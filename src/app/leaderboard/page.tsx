import { getLeaderboard } from "@/app/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Skull, Medal } from "lucide-react";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 border-b border-white/10 bg-gradient-to-br from-primary/10 via-black to-black">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-10 h-10 text-primary animate-bounce" />
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Wall of Hate</h2>
            <p className="text-white/40 font-mono text-sm uppercase">Nikita's Least Favorite Humans</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="divide-y divide-white/5">
          {leaderboard.map((user) => (
            <div key={user.rank} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-8 text-center font-black italic ${user.rank <= 3 ? "text-primary text-xl" : "text-white/20"}`}>
                  #{user.rank}
                </div>
                <Avatar className="w-10 h-10 border border-white/10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.wallet}`} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">REBEL</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                    {user.username || user.wallet}
                    {user.rank <= 3 && <Medal className="w-3 h-3 text-primary" />}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">{user.label}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black italic text-white">{user.points.toLocaleString()}</div>
                <div className="text-[10px] text-white/20 uppercase tracking-tighter">Hate Points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
