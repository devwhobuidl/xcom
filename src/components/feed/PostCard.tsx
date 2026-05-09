"use client";

import { useState } from "react";
import { Heart, MessageSquare, Repeat2, Bookmark, Share, Skull, MoreHorizontal, ShieldCheck, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: any;
  isReply?: boolean;
}

export const PostCard = ({ post, isReply = false }: PostCardProps) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(post.reactions?.filter((r: any) => r.type === "LIKE").length || 0);
  const [fuckYous, setFuckYous] = useState(post.reactions?.filter((r: any) => r.type === "FUCK_YOU").length || 0);
  const [isLiked, setIsLiked] = useState(post.reactions?.some((r: any) => r.userId === session?.user?.id && r.type === "LIKE"));
  const [isFucked, setIsFucked] = useState(post.reactions?.some((r: any) => r.userId === session?.user?.id && r.type === "FUCK_YOU"));

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    // Call API
  };

  const handleFuckYou = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsFucked(!isFucked);
    setFuckYous(prev => isFucked ? prev - 1 : prev + 1);
    // Call API
  };

  return (
    <div className={cn(
      "group bg-zinc-950/40 border border-white/5 hover:bg-white/[0.02] transition-all duration-300",
      isReply ? "p-4 ml-8 rounded-2xl" : "p-5 border-t-0 border-x-0"
    )}>
      <div className="flex gap-4">
        {/* AVATAR COLUMN */}
        <div className="flex flex-col items-center gap-2">
          <Link href={`/profile/${post.author.id}`} className="shrink-0">
            <Avatar className="w-12 h-12 border border-white/10 ring-0 group-hover:border-white/20 transition-all shadow-2xl">
              <AvatarImage src={post.author.image || ""} />
              <AvatarFallback className="bg-zinc-900 text-xs font-black uppercase text-white/40">
                {post.author.username?.slice(0, 2) || "RE"}
              </AvatarFallback>
            </Avatar>
          </Link>
          {!isReply && post.replies?.length > 0 && (
            <div className="w-0.5 flex-1 bg-white/5 group-hover:bg-white/10 transition-colors rounded-full" />
          )}
        </div>

        {/* CONTENT COLUMN */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 truncate">
              <Link href={`/profile/${post.author.id}`} className="font-black text-[15px] text-white hover:underline truncate">
                {post.author.username || 'Anonymous Rebel'}
              </Link>
              {post.author.points > 1000 && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 shrink-0" />
              )}
              <span className="text-white/20 text-xs hidden sm:inline truncate">
                @{post.author.walletAddress?.slice(0, 6)}...{post.author.walletAddress?.slice(-4)}
              </span>
              <span className="text-white/10 text-xs">•</span>
              <span className="text-white/30 text-[11px] font-black uppercase tracking-tighter shrink-0">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
            </div>
            <button className="text-white/20 hover:text-white transition-colors p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <Link href={`/status/${post.id}`} className="block mt-1">
            <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap break-words font-medium">
              {post.content}
            </p>
            {post.imageUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                <img src={post.imageUrl} alt="" className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button className="flex items-center gap-2 group/action text-white/40 hover:text-blue-500 transition-all px-2 py-1 -ml-2 rounded-full hover:bg-blue-500/10">
              <div className="p-1.5 rounded-full group-hover/action:bg-blue-500/10">
                <MessageSquare className="w-4 h-4 group-active/action:scale-75 transition-transform" />
              </div>
              <span className="text-[13px] font-black">{post.replies?.length || 0}</span>
            </button>

            <button 
              onClick={handleFuckYou}
              className={cn(
                "flex items-center gap-2 group/action transition-all px-2 py-1 rounded-full hover:bg-red-600/10",
                isFucked ? "text-red-600" : "text-white/40 hover:text-red-600"
              )}
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-red-600/10">
                <Skull className={cn("w-4 h-4 group-active/action:scale-125 transition-transform", isFucked && "fill-red-600")} />
              </div>
              <span className="text-[13px] font-black">{fuckYous}</span>
            </button>

            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 group/action transition-all px-2 py-1 rounded-full hover:bg-pink-600/10",
                isLiked ? "text-pink-600" : "text-white/40 hover:text-pink-600"
              )}
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-pink-600/10">
                <Heart className={cn("w-4 h-4 group-active/action:scale-125 transition-transform", isLiked && "fill-pink-600")} />
              </div>
              <span className="text-[13px] font-black">{likes}</span>
            </button>

            <div className="flex items-center gap-0.5">
              <button className="p-2.5 text-white/30 hover:text-white transition-all rounded-full hover:bg-white/5">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-white/30 hover:text-white transition-all rounded-full hover:bg-white/5">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
