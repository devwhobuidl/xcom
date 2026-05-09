"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, TrendingUp, Shield, Zap } from "lucide-react";

export const RebellionHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-b-[4rem] bg-black border-b border-white/5">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <AnimatePresence>
        {isVisible && (
          <div className="relative z-10 max-w-6xl mx-auto px-8 py-24 md:py-32 flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">System Unlocked: Version 0.42.0</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 nikita-glitch leading-none"
            >
              THE <span className="text-primary">REBELLION</span> <br />
              STARTS HERE
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl text-xl md:text-2xl text-white/50 font-medium font-mono leading-relaxed mb-12"
            >
              The XCOM ecosystem is for the ones who refuse to be exit liquidity. Join the clans, roast the corporates, and earn the chaos.
            </motion.p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
              {[
                { icon: TrendingUp, label: "NETWORK TVL", value: "$1.4M", color: "text-primary" },
                { icon: Shield, label: "CLANS ACTIVE", value: "42", color: "text-blue-500" },
                { icon: Zap, label: "DAILY ROASTS", value: "12.8K", color: "text-yellow-500" },
                { icon: Skull, label: "EXIT LIQUIDITY", value: "0%", color: "text-green-500" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group"
                >
                  <stat.icon className={`w-6 h-6 mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-2xl font-black italic tracking-tighter text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>
            
            {/* Animated Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-16 opacity-30"
            >
              <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
