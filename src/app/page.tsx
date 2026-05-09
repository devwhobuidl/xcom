"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CommunityFeed } from "@/components/feed/CommunityFeed";
import { Composer } from "@/components/feed/Composer";
import { RebellionHero } from "@/components/hero/RebellionHero";

export default function Home() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  if (!session) {
    return <RebellionHero />;
  }

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex flex-col min-h-screen">
        {/* Header Tabs */}
        <div className="sticky top-0 z-10 glass border-b border-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">The Pit</h1>
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
