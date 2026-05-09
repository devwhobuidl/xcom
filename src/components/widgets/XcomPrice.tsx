"use client";

import React from "react";
import { WidgetContainer } from "./WidgetContainer";
import { Coins, TrendingUp, ArrowUpRight } from "lucide-react";

export const XcomPrice = () => {
  return (
    <WidgetContainer title="Rebellion Index" icon={Coins}>
      <div className="p-5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-black text-white italic tracking-tighter leading-none">$XCOM</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Live Price</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-white italic leading-none">$0.0042069</p>
            <p className="text-[11px] text-green-500 font-black flex items-center justify-end gap-1 mt-1 uppercase italic">
              <ArrowUpRight className="w-3 h-3" />
              +69.42%
            </p>
          </div>
        </div>
        
        <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-[69%] bg-gradient-to-r from-red-600 to-red-400 animate-pulse" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Low: $0.003</span>
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">High: $0.005</span>
        </div>
      </div>
    </WidgetContainer>
  );
};
