"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface WidgetContainerProps {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const WidgetContainer = ({ title, viewAllHref, children, icon: Icon, className }: WidgetContainerProps) => {
  return (
    <div className={`bg-zinc-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden ${className}`}>
      <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <h3 className="flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.15em] text-white/40">
          {Icon && <Icon className="w-3.5 h-3.5 opacity-50" />}
          {title}
        </h3>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-[10px] font-black text-red-600 hover:text-red-500 uppercase italic tracking-tighter transition-colors">
            VIEW ALL
          </Link>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
