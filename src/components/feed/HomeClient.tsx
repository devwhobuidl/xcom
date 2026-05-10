"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CommunityFeed } from "./CommunityFeed";
import { Composer } from "./Composer";
import { Skull, Zap, Flame, AlertCircle, RefreshCw, ChevronRight, LayoutGrid, Trophy, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HomeClientProps {
  session: any;
  isDbConnected: boolean;
}

export function HomeClient({ session, isDbConnected }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section - Static & Bulletproof */}
      <div className="relative pt-20 pb-12 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="relative z-10 space-y-6 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full"
          >
            <Skull className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Rebellion Active</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl sm:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85]"
          >
            Fuck You <br />
            <span className="text-primary underline decoration-primary/30 underline-offset-[10px]">Nikita</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-medium text-lg leading-relaxed max-w-md"
          >
            The official community for the $XCOM movement. Burn the supply, roast the establishment, and reclaim the chaos.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            {!session && (
              <Button 
                asChild
                className="bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-tighter px-8 py-7 rounded-2xl text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] group"
              >
                <Link href="/auth/signin">
                  Join Rebellion
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
            <Button 
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-white font-black italic uppercase tracking-tighter px-8 py-7 rounded-2xl text-lg backdrop-blur-sm"
              onClick={() => {
                const feed = document.getElementById('feed-container');
                feed?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore The Pit
            </Button>
          </motion.div>
        </div>

        {/* Static Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-16 relative z-10 border-t border-white/5 mt-12">
          <div className="space-y-1">
            <div className="text-2xl font-black italic text-white tracking-tighter">4.20B</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Tokens Burned</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black italic text-white tracking-tighter">1.3K+</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Active Rebels</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black italic text-white tracking-tighter">$42M</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Treasury Cap</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black italic text-primary tracking-tighter">∞</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Pure Chaos</div>
          </div>
        </div>
      </div>

      {/* Main Feed Section */}
      <div id="feed-container" className="flex flex-col flex-1">
        {!isDbConnected ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-8">
            <div className="relative">
              <div className="p-6 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
                <AlertCircle className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div className="space-y-3 max-w-sm">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                The Pit is <span className="text-primary">Offline</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                The database is under heavy fire. We're re-establishing the secure link to the rebellion feed.
              </p>
            </div>

            <Button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white font-black italic uppercase tracking-tighter px-8 py-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Attempt Reconnect
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Tabs */}
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
        )}
      </div>
    </div>
  );
}
