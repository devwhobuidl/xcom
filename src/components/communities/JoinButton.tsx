"use client";

import { useState, useTransition } from "react";
import { joinCommunity, leaveCommunity } from "@/app/actions/community";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  communityId: string;
  isJoined: boolean;
}

export function JoinButton({ communityId, isJoined }: JoinButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = async () => {
    startTransition(async () => {
      try {
        if (isJoined) {
          await leaveCommunity(communityId);
          toast.success("Left the clan. The rebellion continues elsewhere.");
        } else {
          await joinCommunity(communityId);
          toast.success("Welcome to the frontlines! Clan joined. 🔥");
        }
        router.refresh();
      } catch (error) {
        toast.error("Chaos failed to erupt. Try again.");
      }
    });
  };

  return (
    <button 
      disabled={pending}
      onClick={handleToggle}
      className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 ${
        isJoined 
          ? 'bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50' 
          : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
      }`}
    >
      {pending ? "LOADING..." : isJoined ? "LEAVE CLAN" : "JOIN REBELLION"}
    </button>
  );
}
