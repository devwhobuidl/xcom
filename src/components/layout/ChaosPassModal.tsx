"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Shield, Skull, Zap, Flame, Terminal, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export const ChaosPassModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 hover:border-primary/50 transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <div className="flex flex-col items-start hidden xl:flex">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Chaos Pass</span>
            <span className="text-[11px] font-bold text-white/50">LEVEL 01 REBEL</span>
          </div>
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] bg-black border-primary/30 p-0 overflow-hidden rounded-[2rem] border-2">
        <div className="relative">
          {/* Hero Section */}
          <div className="h-48 bg-gradient-to-br from-primary via-black to-black p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 rotate-12 translate-x-1/4 -translate-y-1/4">
              <Skull className="w-64 h-64 text-white" />
            </div>
            
            <div className="relative z-10 flex flex-col justify-end h-full">
              <div className="flex items-center gap-3 mb-2">
                <Terminal className="w-5 h-5 text-white/60" />
                <span className="text-xs font-mono text-white/60 tracking-widest uppercase">System: Decentralized</span>
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white">CHAOS PASS v1.0</h2>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <p className="text-white/50 font-medium leading-relaxed font-mono text-sm">
                The <span className="text-primary font-bold">Chaos Pass</span> is your immutable identity in the rebellion. It tracks your contributions, your roasts, and your dedication to the fallback of corporate control.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, label: "ENERGY", value: "85%", color: "text-yellow-500" },
                { icon: Flame, label: "INFAMY", value: "RANK #42", color: "text-primary" },
                { icon: Shield, label: "DEFENSE", value: "UNBREAKABLE", color: "text-blue-500" },
                { icon: Fingerprint, label: "SIG", value: "VERIFIED", color: "text-green-500" },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl group hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-lg font-black italic tracking-tighter text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">REBEL MISSION:</h4>
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Skull className="w-12 h-12 text-primary" />
                </div>
                <div className="text-sm font-bold text-white mb-1">THE GREAT NIKITA ROAST</div>
                <p className="text-xs text-white/40 font-mono">Collect 1000 INFAMY points to unlock the next level of the rebellion.</p>
                <div className="mt-4 h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Connection Stable</span>
              </div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">v0.42.0-chaos</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
