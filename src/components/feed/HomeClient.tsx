"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CommunityFeed } from "./CommunityFeed";
import { Composer } from "./Composer";
import { Skull, Zap, Shield, Flame, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeClientProps {
  session: any;
  isDbConnected: boolean;
}

export function HomeClient({ session, isDbConnected }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  if (!isDbConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)]" />
          
          <div className="relative">
            <div className="p-6 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
              <AlertCircle className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute -inset-4 blur-3xl bg-primary/20 -z-10 animate-pulse" />
          </div>

          <div className="space-y-4 max-w-md relative z-10">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
              The Pit is <span className="text-primary">Offline</span>
            </h1>
            <p className="text-white/40 font-mono text-sm leading-relaxed">
              The connection to the rebellion was severed. Nikita might be behind this, or the database is just taking a smoke break.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white font-black italic uppercase tracking-tighter py-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reconnect to Chaos
            </Button>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
              Standing by for signal re-establishment...
            </p>
          </div>

          {/* Background Elements */}
          <div className="flex justify-center gap-12 pt-12 opacity-20 filter grayscale">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white italic tracking-tighter">?.?B</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Burned</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white italic tracking-tighter">???</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Rebels</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white italic tracking-tighter">$??M</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Treasury</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/5">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-black italic tracking-tighter leading-none opacity-0 select-none">$XCOM</h2>
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-white/40">The Pit</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-block bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.15)]">
                <span className="text-[10px] font-black tracking-widest uppercase text-primary animate-pulse">
                  {!session ? "Public Rebellion" : "Rebel Authenticated"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex border-t border-white/5">
            <button 
              onClick={() => setActiveTab("for-you")}
              className={`flex-1 py-5 hover:bg-white/5 transition-colors relative group ${activeTab === "for-you" ? "text-white" : "text-white/50"}`}
            >
              <span className={`text-sm ${activeTab === "for-you" ? "font-black italic uppercase tracking-tighter" : "font-bold uppercase tracking-tight opacity-40"}`}>For You</span>
              {activeTab === "for-you" && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full neon-glow shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
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
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full neon-glow shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
                />
              )}
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div id="main-composer" className="py-2">
          {session ? (
            <div className="px-2">
              <Composer />
            </div>
          ) : (
            <div className="relative p-12 border-b border-white/5 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
              <div className="relative z-10 text-center space-y-6">
                <div className="inline-flex p-3 bg-zinc-900 rounded-2xl border border-white/10 mb-2">
                  <Flame className="w-8 h-8 text-primary animate-bounce" />
                </div>
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white/90 leading-tight">
                  Welcome to <span className="text-primary">The Pit</span>
                </h3>
                <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                  The rebellion against Nikita starts here. Roasting is not just a right, it's a duty.
                </p>
                <div className="flex justify-center gap-8 pt-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-black text-white italic tracking-tighter">4.2B</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Burned</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-black text-white italic tracking-tighter">1.3K</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Rebels</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-black text-white italic tracking-tighter">$42M</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Treasury</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feed with internal error handling */}
        <div id="feed" className="flex-1 min-h-[400px]">
          <CommunityFeed activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
