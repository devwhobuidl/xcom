import { getUserStats } from "@/app/actions/user";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/feed/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skull, Ghost, Zap, Award } from "lucide-react";

export default async function StatsPage() {
  const data = await getUserStats();

  if (!data) {
    return (
      <div className="p-20 text-center">
        <p className="text-white/40 font-black uppercase tracking-widest italic animate-pulse">Establishing Identity...</p>
      </div>
    );
  }

  const { user, counts, recentActivity } = data;

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Advanced Stats Section */}
      <section className="px-6 py-12 border-b border-white/10 bg-gradient-to-b from-transparent to-primary/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2 p-6 glass-red rounded-3xl border-primary/20">
             <div className="text-[10px] font-black uppercase tracking-widest text-primary">Global Rank</div>
             <div className="text-5xl font-black italic tracking-tighter text-glow-red">#{user.rank}</div>
             <p className="text-[10px] font-mono text-white/30 uppercase">Top {((user.rank / counts.totalUsers) * 100).toFixed(1)}% of Rebels</p>
          </div>
          
          <div className="space-y-2 p-6 glass rounded-3xl">
             <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Roasts</div>
             <div className="text-5xl font-black italic tracking-tighter">{counts.roastsGiven}</div>
             <p className="text-[10px] font-mono text-white/30 uppercase">Broadcasted to the pit</p>
          </div>

          <div className="space-y-2 p-6 glass rounded-3xl">
             <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Hate Received</div>
             <div className="text-5xl font-black italic tracking-tighter">{counts.roastsReceived}</div>
             <p className="text-[10px] font-mono text-white/30 uppercase">Collective anger levels</p>
          </div>

          <div className="space-y-2 p-6 glass rounded-3xl bg-primary/10">
             <div className="text-[10px] font-black uppercase tracking-widest text-primary">Current Tier</div>
             <div className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> SUPREME
             </div>
             <p className="text-[10px] font-mono text-white/30 uppercase">Multiplier: 2.5x</p>
          </div>
        </div>
      </section>

      {/* Rebellion Progress */}
      <section className="px-6 py-12 border-b border-white/10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="relative shrink-0">
             <div className="w-64 h-64 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                <div className="text-center">
                   <div className="text-4xl font-black italic tracking-tighter">72%</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-white/40">To Next Level</div>
                </div>
                {/* SVG Progress Circle would go here */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="753.98"
                    strokeDashoffset="211.11"
                    className="text-primary drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                  />
                </svg>
             </div>
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-6 py-2 rounded-full whitespace-nowrap">
                <span className="text-xs font-black italic uppercase">Level 14 Rebellion</span>
             </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Level 7 Rebel</h3>
                <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block w-fit mx-auto lg:mx-0">Ungovernable Status</span>
              </div>
              <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto lg:mx-0">
                You have reached high-tier rebel status. Your influence in the pit is growing, and Nikita's sweat level is increasing.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {[
                { label: "Bonus Points", val: "+25%", color: "text-blue-400" },
                { label: "Airdrop Weight", val: "1.5x", color: "text-green-400" },
                { label: "Roast Power", val: "ULTRA", color: "text-primary" },
              ].map((benefit, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{benefit.label}</p>
                  <p className={`text-xl font-black italic ${benefit.color}`}>{benefit.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
