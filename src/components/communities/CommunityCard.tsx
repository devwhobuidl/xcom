"use client";

import Link from "next/link";
import { Users, Shield, PlusCircle } from "lucide-react";
import { Community } from "@prisma/client";
import { JoinButton } from "./JoinButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CommunityCard = ({ community, isJoined = false }: { community: any, isJoined?: boolean }) => {
  return (
    <div className="group bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col h-full">
      {/* BANNER */}
      <div className="h-32 bg-zinc-800 relative overflow-hidden">
        {community.banner ? (
          <img src={community.banner} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="px-5 pb-5 pt-0 flex-1 flex flex-col -mt-10 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <Avatar className="w-20 h-20 border-4 border-zinc-950 rounded-2xl shadow-2xl">
            <AvatarImage src={community.avatar || ""} />
            <AvatarFallback className="bg-zinc-800 text-xl font-black">
              {community.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <JoinButton communityId={community.id} initialIsJoined={isJoined} />
        </div>

        <Link href={`/community/${community.slug}`} className="block group/link">
          <h3 className="text-xl font-black text-white group-hover/link:text-red-500 transition-colors flex items-center gap-2">
            {community.name}
            {community.isPublic === false && <Shield className="w-4 h-4 text-white/30" />}
          </h3>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
            /{community.slug}
          </p>
        </Link>

        <p className="text-sm text-white/60 mt-4 line-clamp-2 leading-relaxed flex-1">
          {community.description}
        </p>

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-white/20" />
            <span className="text-[12px] font-black text-white/40">
              {community._count?.members || community.memberCount} <span className="text-[10px] opacity-40">MEMBERS</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
