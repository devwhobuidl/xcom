"use client";

import React, { useState } from "react";
import { followUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing?: boolean;
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!session) {
      toast.error("Connect wallet to follow rebels!");
      return;
    }

    setLoading(true);
    try {
      await followUser(targetUserId);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Unfollowed rebel." : "Joined their squad!");
    } catch (e) {
      toast.error("Nikita blocked the connection.");
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.id === targetUserId) return null;

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className={`rounded-full font-black uppercase italic tracking-tight transition-all active:scale-95 ${
        isFollowing 
          ? "border-white/10 hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5" 
          : "bg-white text-black hover:bg-white/90 shadow-[0_5px_15px_rgba(255,255,255,0.1)]"
      }`}
    >
      {isFollowing ? "FOLLOWING" : "FOLLOW"}
    </Button>
  );
}
