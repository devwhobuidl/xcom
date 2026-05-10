"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, MessageSquare, Repeat2, Heart, ShieldAlert, Share, Trash2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { reactToPost, createPost, deletePost } from "@/app/actions/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import { Composer } from "./Composer";

interface Post {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
  parentId?: string | null;
  author: {
    id: string;
    username?: string | null;
    walletAddress: string;
    image?: string | null;
    points: number;
  };
  reactions: {
    type: string;
    userId: string;
  }[];
  _count?: {
    reactions: number;
    replies: number;
  };
  community?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  isReply?: boolean;
}

export const PostCard = ({ post, currentUserId: propUserId, isReply }: PostCardProps) => {
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [optimisticReactions, setOptimisticReactions] = useState(post.reactions);

  const currentUserId = propUserId || (session?.user as any)?.id;

  const handleReact = async (type: "LIKE" | "FUCK_YOU" | "REPOST") => {
    if (!session) {
      toast.error("Join the rebellion to amplify chaos!");
      openAuthModal("signup");
      return;
    }

    if (!currentUserId) return;

    // Toggle logic for optimistic UI
    const alreadyReacted = optimisticReactions.find(r => r.userId === currentUserId && r.type === type);
    if (alreadyReacted) {
      setOptimisticReactions(prev => prev.filter(r => !(r.userId === currentUserId && r.type === type)));
    } else {
      setOptimisticReactions(prev => [...prev, { type, userId: currentUserId }]);
    }

    try {
      await reactToPost(post.id, type);
      if (!alreadyReacted) {
        let msg = "Chaos amplified 🔥";
        if (type === "FUCK_YOU") msg = "Nikita roasted 💀";
        if (type === "REPOST") msg = "Propaganda spread! +30 pts 🔥";
        if (type === "LIKE") msg = "Solid hate! +10 pts";
        toast.success(msg);
      }
    } catch (error) {
      toast.error("Failed to react. Nikita's firewall?");
      setOptimisticReactions(post.reactions);
    }
  };

  const fuckYouCount = optimisticReactions.filter((r) => r.type === "FUCK_YOU").length;
  const likeCount = optimisticReactions.filter((r) => r.type === "LIKE").length;
  const repostCount = optimisticReactions.filter((r) => r.type === "REPOST").length;
  
  const hasLiked = optimisticReactions.some(r => r.userId === currentUserId && r.type === "LIKE");
  const hasFucked = optimisticReactions.some(r => r.userId === currentUserId && r.type === "FUCK_YOU");
  const hasReposted = optimisticReactions.some(r => r.userId === currentUserId && r.type === "REPOST");

  return (
    <div className={`relative ${isReply ? "pl-12" : ""}`}>
      {isReply && (
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/10" />
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 border-b border-white/5 hover:bg-white/[0.02] transition-all group relative`}
      >
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${post?.author?.username || post?.author?.id || "rebel"}`}>
              <Avatar className="w-10 h-10 border border-white/10 rounded-full hover:border-primary transition-colors">
                <AvatarImage src={post?.author?.image || ""} />
                <AvatarFallback className="bg-secondary text-primary font-bold">
                  {post?.author?.username?.slice(0, 2) || post?.author?.walletAddress?.slice(0, 2) || "RE"}
                </AvatarFallback>
              </Avatar>
            </Link>
            {!isReply && post._count?.replies! > 0 && (
               <div className="w-[2px] flex-1 bg-white/10 mt-2" />
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <Link href={`/profile/${post?.author?.username || post?.author?.id || "rebel"}`} className="font-bold text-[15px] hover:underline cursor-pointer truncate">
                  {post?.author?.username || (post?.author?.walletAddress ? `${post.author.walletAddress.slice(0, 4)}...${post.author.walletAddress.slice(-4)}` : "Anonymous")}
                </Link>
                {post?.author?.points > 5000 && (
                  <Skull className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]" />
                )}
                <span className="text-[14px] text-white/40 font-normal truncate">
                  @{post?.author?.username?.toLowerCase() || post?.author?.walletAddress?.slice(0, 6) || "rebel"} · {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "just now"}
                </span>
                {post.community && (
                  <Link 
                    href={`/community/${post.community.slug}`}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[9px] font-black text-primary tracking-widest hover:bg-primary/20 transition-all uppercase"
                  >
                    {post.community.name}
                  </Link>
                )}
              </div>
              {currentUserId === post.author.id && (
                <button 
                  onClick={async () => {
                    if (confirm("Execute this post? This cannot be undone.")) {
                      try {
                        await deletePost(post.id);
                        toast.success("Post obliterated.");
                      } catch (e) {
                        toast.error("Failed to delete.");
                      }
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-primary p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <p className="text-[15px] leading-normal whitespace-pre-wrap text-white/90">{post.content}</p>
            
            {post.imageUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/50 relative aspect-video group/img">
                <Image 
                   src={post.imageUrl} 
                   alt="Meme" 
                   fill 
                   className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                   unoptimized
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
              </div>
            )}
            <div className="flex items-center justify-between mt-3 max-w-lg text-white/40 -ml-2">
              <button 
                onClick={() => setShowReplyComposer(!showReplyComposer)}
                className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group/btn p-2 rounded-full"
              >
                <div className="p-2 rounded-full group-hover/btn:bg-blue-400/10 transition-colors">
                  <MessageSquare className="w-[19px] h-[19px]" />
                </div>
                <span className="text-[13px] font-medium">{post._count?.replies || 0}</span>
              </button>
              
              <button 
                onClick={() => handleReact("REPOST")}
                className={`flex items-center gap-1.5 transition-colors group/btn p-2 rounded-full ${hasReposted ? "text-green-500" : "hover:text-green-500"}`}
              >
                <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors">
                  <Repeat2 className={`w-[19px] h-[19px] ${hasReposted ? "stroke-[2.5px]" : ""}`} />
                </div>
                <span className="text-[13px] font-medium">{repostCount}</span>
              </button>
              
              <button 
                onClick={() => handleReact("LIKE")}
                className={`flex items-center gap-1.5 transition-colors group/btn p-2 rounded-full ${hasLiked ? "text-pink-500" : "hover:text-pink-500"}`}
              >
                <div className="p-2 rounded-full group-hover/btn:bg-pink-500/10 transition-colors">
                  <Heart className={`w-[19px] h-[19px] ${hasLiked ? "fill-pink-500" : ""}`} />
                </div>
                <span className="text-[13px] font-medium">{likeCount}</span>
              </button>
              
              <button 
                onClick={() => handleReact("FUCK_YOU")}
                className={`flex items-center gap-1.5 transition-all group/btn p-2 rounded-full ${hasFucked ? "text-primary drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]" : "hover:text-primary"}`}
              >
                <div className="p-2 rounded-full group-hover/btn:bg-primary/10 transition-colors">
                  <Skull className={`w-[19px] h-[19px] ${hasFucked ? "animate-pulse stroke-[2.5px]" : ""}`} />
                </div>
                <span className="text-[13px] font-black uppercase tracking-tighter">{hasFucked ? "FUCKED" : "FUCK YOU"}</span>
              </button>

              <button className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors group/share">
                <Share className="w-[18px] h-[18px] group-hover/share:scale-110 transition-transform" />
              </button>
            </div>


            <AnimatePresence>
              {showReplyComposer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <Composer 
                    parentId={post.id} 
                    placeholder="Post your reply" 
                    onSuccess={() => setShowReplyComposer(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
