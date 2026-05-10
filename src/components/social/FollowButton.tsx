"use client";

import React, { useState } from "react";
import { followUser, unfollowUser } from "@/app/actions/user";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  isLoggedIn: boolean;
}

export const FollowButton = ({ userId, isFollowing: initialFollowing, isLoggedIn }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Sign in to join the rebellion!");
      return;
    }

    setLoading(true);
    // Optimistic update
    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      if (previousState) {
        await unfollowUser(userId);
        toast.success("Unfollowed. One less ally in the pit.");
      } else {
        await followUser(userId);
        toast.success("Followed! Rebellion growing stronger. +15 pts");
      }
    } catch (error) {
      toast.error("Failed to update follow status.");
      setIsFollowing(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading}
      onClick={handleToggle}
      className={`px-6 py-2 rounded-full font-black text-sm transition-all uppercase tracking-widest ${
        isFollowing 
          ? "border border-white/20 text-white hover:border-primary/50 hover:text-primary hover:bg-primary/5" 
          : "bg-white text-black hover:bg-primary hover:text-white"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isFollowing ? (
        <span className="group">
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </span>
      ) : "Follow"}
    </motion.button>
  );
};
