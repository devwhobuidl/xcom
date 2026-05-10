"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CommunityFeed } from "./CommunityFeed";
import { Composer } from "./Composer";
import { Skull, Zap, Flame, AlertCircle, RefreshCw, ChevronRight, LayoutGrid, Trophy, Bell, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HomeClientProps {
  session: any;
  isDbConnected: boolean;
}

export function HomeClient({ session, isDbConnected }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  // If DB is connected and user is logged in, show the actual feed
  // Otherwise, show the premium landing page
  const showLanding = !isDbConnected || !session;

  if (showLanding) {
    return (
      <div className="flex flex-col min-h-screen bg-black overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-900/50 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-24 pb-16 px-6 max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/10 rounded-full backdrop-blur-xl mb-4"
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">System Status: Rebellious</span>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl sm:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8] mb-2">
                XCOM.LOL <br />
                <span className="text-primary italic">THE PIT</span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white/40"
            >
              Fuck You Nikita
            </motion.p>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/40 font-medium text-lg max-w-xl mx-auto leading-relaxed"
          >
            The digital frontlines for the $XCOM movement. Roast the establishment, burn the supply, and join the most chaotic community on Solana.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-6"
          >
            <Button 
              asChild
              className="bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-tighter px-10 py-8 rounded-2xl text-xl shadow-[0_20px_50px_rgba(255,255,255,0.15)] group transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/auth/signin">
                Join Rebellion
                <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-white font-black italic uppercase tracking-tighter px-10 py-8 rounded-2xl text-xl backdrop-blur-sm border-2"
              onClick={() => {
                const stats = document.getElementById('stats-grid');
                stats?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Intel
            </Button>
          </motion.div>
        </div>

        {/* Premium Stats Grid */}
        <div id="stats-grid" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5 bg-zinc-950/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
              icon={<Users className="w-6 h-6 text-primary" />}
              label="Users Fucked"
              value="69,420"
              sub="Increasing hourly"
            />
            <StatCard 
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              label="$XCOM Price"
              value="$0.000420"
              sub="+1,337% Last 24h"
            />
            <StatCard 
              icon={<Shield className="w-6 h-6 text-blue-500" />}
              label="Treasury"
              value="$4.20M"
              sub="Reserved for chaos"
            />
            <StatCard 
              icon={<Flame className="w-6 h-6 text-orange-500" />}
              label="Tokens Burned"
              value="1.2B"
              sub="Sending it to zero"
            />
          </div>
        </div>

        {/* Warning Banner if DB is actually down */}
        {!isDbConnected && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="flex items-center gap-4 px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl border border-red-400/30 backdrop-blur-xl"
            >
              <AlertCircle className="w-6 h-6 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest leading-none">Intelligence Lost</span>
                <span className="text-[10px] font-bold opacity-80 mt-1 uppercase">Database is under heavy fire. Recon restricted.</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="hover:bg-white/10 text-white font-black italic uppercase tracking-tighter text-[10px]"
              >
                Reconnect
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Actual Community Feed View (Logged in + Connected)
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Home Feed Tabs */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex">
          <button 
            onClick={() => setActiveTab("for-you")}
            className={`flex-1 py-5 hover:bg-white/5 transition-colors relative group ${activeTab === "for-you" ? "text-white" : "text-white/50"}`}
          >
            <span className={`text-sm ${activeTab === "for-you" ? "font-black italic uppercase tracking-tighter" : "font-bold uppercase tracking-tight opacity-40"}`}>For You</span>
            {activeTab === "for-you" && (
              <motion.div 
                layoutId="activeTabHome"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-5 hover:bg-white/5 transition-colors relative group ${activeTab === "following" ? "text-white" : "text-white/50"}`}
          >
            <span className={`text-sm ${activeTab === "following" ? "font-black italic uppercase tracking-tighter" : "font-bold uppercase tracking-tight opacity-40"}`}>Following</span>
            {activeTab === "following" && (
              <motion.div 
                layoutId="activeTabHome"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
              />
            )}
          </button>
        </div>
      </div>
      
      {/* Composer */}
      {session && (
        <div className="px-2 py-4 border-b border-white/5 bg-zinc-950/30">
          <Composer />
        </div>
      )}

      {/* Feed */}
      <div className="flex-1">
        <CommunityFeed activeTab={activeTab} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
    >
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="space-y-1">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-white/30">{label}</div>
        <div className="text-4xl font-black italic text-white tracking-tighter">{value}</div>
        <div className="text-[10px] font-mono font-bold text-primary/60 uppercase">{sub}</div>
      </div>
    </motion.div>
  );
}
