import React from "react";
import Link from "next/link";
import { Skull, ChevronRight, Users, Zap, Shield, Flame, LayoutGrid, Trophy, Globe, Lock, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30 selection:text-white relative overflow-hidden">
      {/* Cinematic Background FX */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-950/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/20 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/10 animate-scanline" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-32">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-10 mb-28">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-zinc-900/40 border border-white/5 rounded-full backdrop-blur-3xl">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">PROTOCOL STATUS: UNGOVERNABLE</span>
          </div>

          <div className="space-y-6">
            <div className="w-28 h-28 bg-red-600 mx-auto flex items-center justify-center rounded-[2rem] shadow-[0_0_80px_rgba(220,38,38,0.5)] rotate-[-8deg] mb-12 hover:rotate-0 transition-transform duration-500 cursor-pointer group">
              <Skull className="w-14 h-14 text-white group-hover:scale-110 transition-transform" />
            </div>
            
            <h1 className="text-7xl sm:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.75] select-none">
              XCOM.LOL <br />
              <span className="text-red-600">THE PIT</span>
            </h1>
            
            <p className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-white/40 max-w-2xl mx-auto leading-tight">
              Fuck You Nikita <span className="text-white/10">•</span> Real Community <span className="text-white/10">•</span> Daily $XCOM Drops
            </p>
          </div>

          <p className="text-white/40 font-medium text-xl max-w-3xl leading-relaxed">
            Welcome to the frontlines of the most chaotic movement on Solana. Burn the supply, roast the establishment, and claim your share of the rebellion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link 
              href="/communities"
              className="group bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-tighter px-12 py-7 rounded-[2rem] text-2xl shadow-[0_30px_70px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              ENTER THE PIT
              <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
            <button 
              className="border border-white/10 hover:bg-white/5 text-white font-black italic uppercase tracking-tighter px-12 py-7 rounded-[2rem] text-2xl backdrop-blur-xl transition-all"
              onClick={() => {
                document.getElementById('recon')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              RECON INTEL
            </button>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          <StatCard 
            icon={<Users className="w-7 h-7 text-red-600" />}
            label="X-ERS FUCKED"
            value="54,231"
            sub="Surging hourly"
          />
          <StatCard 
            icon={<Zap className="w-7 h-7 text-yellow-500" />}
            label="$XCOM PRICE"
            value="$0.000069"
            sub="+4,206.9% SINCE LAUNCH"
          />
          <StatCard 
            icon={<Shield className="w-7 h-7 text-blue-500" />}
            label="WAR CHEST"
            value="6.9M $XCOM"
            sub="Secured in Treasury"
          />
          <StatCard 
            icon={<Flame className="w-7 h-7 text-orange-500" />}
            label="TOKENS BURNED"
            value="1.2B"
            sub="Feeding the abyss"
          />
        </div>

        {/* Intelligence Sections */}
        <div id="recon" className="space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">OPERATIONAL STATUS</h2>
            <div className="h-1 w-32 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6" />}
              title="CHAOS FEED"
              status="STABLE"
              desc="Real-time roasting and intel sharing. The rebellion never sleeps."
              link="/communities"
            />
            <FeatureCard 
              icon={<Trophy className="w-6 h-6" />}
              title="REBEL RANK"
              status="STABLE"
              desc="Earn points through chaos. The top rebels claim the rewards."
              link="/leaderboard"
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-white/20" />}
              title="GLOBAL CHAT"
              status="DEPLOYING"
              desc="End-to-end encrypted comms for the pit. Initializing encryption..."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-white/20" />}
              title="DAILY DROPS"
              status="COMING SOON"
              desc="Automatic $XCOM distribution to the most active haters."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-white/20" />}
              title="DAO RAIDS"
              status="COMING SOON"
              desc="Vote on the next targets and treasury deployment."
            />
            <FeatureCard 
              icon={<Lock className="w-6 h-6 text-white/20" />}
              title="THE VAULT"
              status="COMING SOON"
              desc="Exclusive access for Chaos Pass holders. Preparing keyholes."
            />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="border-t border-white/5 py-16 text-center bg-zinc-950/40">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <p className="text-white/20 font-black italic uppercase tracking-[0.5em] text-xs">
            XCOMMUNITY.FUN // THE REBELLION WILL NOT BE CENTRALIZED
          </p>
          <div className="flex justify-center gap-8 opacity-30">
            <Link href="#" className="text-[10px] font-bold hover:text-white">MANIFESTO</Link>
            <Link href="#" className="text-[10px] font-bold hover:text-white">INTEL</Link>
            <Link href="#" className="text-[10px] font-bold hover:text-white">WAR ROOM</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-3xl group hover:border-red-600/30 transition-all duration-500">
      <div className="mb-6 group-hover:scale-125 transition-transform duration-500 bg-white/5 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5">{icon}</div>
      <div className="space-y-2">
        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">{label}</div>
        <div className="text-5xl font-black italic text-white tracking-tighter leading-none">{value}</div>
        <div className="text-[10px] font-mono font-bold text-red-600/60 uppercase mt-2">{sub}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, status, desc, link }: { icon: React.ReactNode, title: string, status: string, desc: string, link?: string }) {
  const Card = () => (
    <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${link ? 'bg-zinc-900/40 border-white/10 hover:border-red-600/50 hover:bg-zinc-900/60 cursor-pointer shadow-xl' : 'bg-black/40 border-white/5 opacity-40'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">{icon}</div>
        <div className={`text-[10px] font-black px-3 py-1.5 rounded-full ${status === 'STABLE' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-white/10 text-white/40 border border-white/10'}`}>
          {status}
        </div>
      </div>
      <h3 className="font-black italic uppercase tracking-tighter text-xl mb-3">{title}</h3>
      <p className="text-sm text-white/40 font-medium leading-relaxed">{desc}</p>
    </div>
  );

  if (link) {
    return <Link href={link} className="block group"><Card /></Link>;
  }
  return <Card />;
}
