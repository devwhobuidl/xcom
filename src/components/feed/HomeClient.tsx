"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommunityFeed } from "./CommunityFeed";
import { Composer } from "./Composer";
import { Skull, Zap, Flame, AlertCircle, RefreshCw, ChevronRight, LayoutGrid, Trophy, Bell, Shield, Users, BarChart3, MessageSquare, Heart, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HomeClientProps {
  session: any;
}

export function HomeClient({ session }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Home Feed Tabs */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-4">
          <h2 className="text-xl font-black italic uppercase tracking-tighter">The Pit</h2>
        </div>
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
      
      {/* Composer - Always visible, but prompts login if no session */}
      <div className="px-4 py-4 border-b border-white/5 bg-zinc-950/30">
        <Composer />
      </div>

      {/* Feed with Fallback Mock Data */}
      <div className="flex-1">
        <CommunityFeed activeTab={activeTab} />
      </div>

      {/* Persistent "Join" banner for non-logged in users */}
      {!session && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-red-600 p-4 rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.5)] z-[100] flex items-center justify-between animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Skull className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <p className="font-black italic uppercase tracking-tighter leading-tight">JOIN THE REBELLION</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Post chaos, earn $XCOM</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-white text-red-600 hover:bg-zinc-100 font-black italic uppercase tracking-tighter rounded-xl">
            <Link href="/auth/signin">Enter Pit</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
