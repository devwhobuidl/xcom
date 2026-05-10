"use client";

export const dynamic = 'force-dynamic';
import { useState } from "react";
import { motion } from "framer-motion";
import { CommunityFeed } from "@/components/feed/CommunityFeed";
import { Composer } from "@/components/feed/Composer";
import { useSession } from "next-auth/react";
import { Skull, Zap, Shield, Flame } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col">
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/5">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-black italic tracking-tighter leading-none opacity-0 select-none">$XCOM</h2>
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-white/40">The Pit</span>
              </div>
            </div>
            {status === "unauthenticated" && (
              <div className="inline-block bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.15)]">
                <span className="text-[10px] font-black tracking-widest uppercase text-primary animate-pulse">Public Rebellion</span>
              </div>
            )}
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
                  The only place where roasting Nikita earns you $XCOM. Connect your wallet to start the rebellion.
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
        <div id="feed" className="flex-1">
          <CommunityFeed activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
