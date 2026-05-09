"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CommunityFeed } from "@/components/feed/CommunityFeed";
import { Composer } from "@/components/feed/Composer";
import { WalletButton } from "@/components/auth/WalletButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col">
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/5">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-black italic tracking-tighter leading-none opacity-0 select-none">$XCOM</h2>
            </div>
            {!session && (
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
            <div className="p-12 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent text-center space-y-6">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white/90">Join the Pit</h3>
              <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">Connect your wallet to roast Nikita, earn $XCOM, and join the rebellion.</p>
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
