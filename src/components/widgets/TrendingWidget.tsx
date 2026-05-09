"use client";

import React from "react";
import { WidgetContainer } from "./WidgetContainer";
import { TrendingUp, Flame, Zap, ArrowUpRight } from "lucide-react";

export const TrendingWidget = () => {
  const trends = [
    { name: "$XCOM", count: "42.0K", type: "TOKEN" },
    { name: "REBELLION", count: "12.4K", type: "MOVEMENT" },
    { name: "NIKITA", count: "8.9K", type: "TARGET" },
    { name: "SOLANA", count: "6.7K", type: "NETWORK" },
  ];

  return (
    <WidgetContainer title="War Trends" icon={TrendingUp}>
      <div className="flex flex-col">
        {trends.map((trend, i) => (
          <div 
            key={trend.name}
            className={`px-5 py-4 hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer ${i !== trends.length - 1 ? 'border-b border-white/5' : ''}`}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-white italic tracking-tight">{trend.name}</p>
                {i === 0 && <Flame className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />}
              </div>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-0.5">{trend.type}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-white italic">{trend.count}</p>
              <p className="text-[8px] text-green-500 font-bold uppercase flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" />
                Trending
              </p>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};
