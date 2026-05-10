"use client";

import React, { useState } from "react";
import { Users, ChevronRight, Skull, Zap, Flame, Shield, Target, Plus, Minus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { joinCommunity, leaveCommunity } from "@/app/actions/community";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/providers/AuthModalProvider";

interface CommunityCardProps {
  community: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    banner: string | null;
    avatar: string | null;
    memberCount: number;
  };
  isJoined?: boolean;
}

const ICON_MAP: Record<string, any> = {
  "nikita-haters": Skull,
  "solana-chads": Zap,
  "meme-lords": Flame,
  "chaos-engine": Shield,
  "rebel-base": Target,
};

export const CommunityCard = ({ community, isJoined: initialJoined }: CommunityCardProps) => {
  const [isJoined, setIsJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();
  const Icon = ICON_MAP[community.slug] || Users;

  const handleToggleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("You must enter the pit to join a district.");
      openAuthModal("login");
      return;
    }

    setLoading(true);
    try {
      if (isJoined) {
        const res = await leaveCommunity(community.id);
        if (res.success) {
          setIsJoined(false);
          toast.success(`Abandoned ${community.name}. Traitor.`);
        }
      } else {
        const res = await joinCommunity(community.id);
        if (res.success) {
          setIsJoined(true);
          toast.success(`Assigned to ${community.name}. Post chaos.`);
        }
      }
    } catch (error) {
      toast.error("Nikita's signal jammer blocked the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link href={`/community/${community.slug}`} className="block">
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-2xl">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-br from-primary/20 via-black to-black relative overflow-hidden">
            {community.banner ? (
              <img src={community.banner} alt={community.name} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5 pt-0 relative">
            {/* Avatar */}
            <div className="absolute -top-10 left-5">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-black rounded-2xl shadow-2xl overflow-hidden">
                  <AvatarImage src={community.avatar || ""} />
                  <AvatarFallback className="bg-zinc-900 text-primary">
                    <Icon className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-lg border-2 border-black shadow-lg">
                  <Icon className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="mt-14 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xl font-black italic tracking-tighter text-white group-hover:text-primary transition-colors truncate max-w-[150px]">
                  {community.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleJoin}
                    disabled={loading}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isJoined 
                        ? "bg-white/5 text-white/40 border border-white/5 hover:bg-red-600/10 hover:text-red-600 hover:border-red-600/20" 
                        : "bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:scale-105"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isJoined ? (
                      <>
                        <Minus className="w-3 h-3" />
                        Leave
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Join
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-full border border-white/5">
                    <Users className="w-3 h-3 text-white/40" />
                    <span className="text-[10px] font-black text-white/60 tracking-widest">
                      {(community.memberCount + (isJoined && !initialJoined ? 1 : (!isJoined && initialJoined ? -1 : 0))).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/40 line-clamp-2 font-medium leading-relaxed min-h-[40px]">
                {community.description || "The rebellion is growing. Join the frontlines of chaos and roast Nikita into oblivion."}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=rebel${community.id}${i}`} alt="Member" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-black bg-zinc-900 flex items-center justify-center text-[8px] font-black text-white/40">
                    +{(community.memberCount > 3 ? community.memberCount - 3 : 0).toLocaleString()}
                  </div>
                </div>
                
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                  Enter Clan <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
