"use client";

import React, { useEffect, useState } from "react";
import { getFeed } from "@/app/actions/community";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface CommunityFeedProps {
  communityId?: string;
  userId?: string;
}

export function CommunityFeed({ communityId, userId }: CommunityFeedProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const data = await getFeed(communityId, userId);
        setPosts(data);
      } catch (err) {
        console.error("Feed failure:", err);
        setError("Failed to fetch the chaos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [communityId, userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20 animate-pulse">
          Loading the pit...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl m-4">
        <p className="text-red-500 font-black uppercase italic">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-20">
          <p className="text-2xl">💀</p>
        </div>
        <div className="space-y-1">
          <p className="text-white font-black uppercase italic tracking-tight">No chaos detected</p>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
            Be the first to roast Nikita and start the rebellion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          currentUserId={session?.user?.id}
        />
      ))}
    </div>
  );
}
