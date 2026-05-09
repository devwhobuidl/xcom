"use client";

import React from "react";
import { WidgetContainer } from "./WidgetContainer";
import { Shield, Coins, Users, Zap } from "lucide-react";

export const TreasuryStats = () => {
  return (
    <WidgetContainer title="Vault Status" icon={Shield}>
      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-950/50 border border-white/5 p-3 rounded-2xl flex flex-col gap-1">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Total Burned</p>
            <p className="text-sm font-black text-white italic tracking-tighter">4.2B $XCOM</p>
          </div>
          <div className="bg-zinc-950/50 border border-white/5 p-3 rounded-2xl flex flex-col gap-1">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Active Rebels</p>
            <p className="text-sm font-black text-white italic tracking-tighter">1,337</p>
          </div>
        </div>
        
        <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-red-500" />
              <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] italic">Community Fund</p>
            </div>
            <p className="text-2xl font-black text-white italic tracking-tighter leading-none">42,069 SOL</p>
            <p className="text-[10px] text-white/40 font-bold mt-2 uppercase tracking-tight">Reserved for airdrops and development</p>
          </div>
          <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-red-600/10 rotate-12 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </WidgetContainer>
  );
};
