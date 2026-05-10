"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { followUser } from "@/app/actions/user";
import { getSuggestedUsers } from "@/app/actions/community";
import { toast } from "sonner";
import { WidgetContainer } from "./WidgetContainer";

export function SuggestedHaters() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getSuggestedUsers();
        setUsers(data.slice(0, 3)); // Only show top 3
      } catch (error) {
        console.error("Failed to fetch suggested haters", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      setFollowedIds(prev => new Set(prev).add(userId));
      toast.success("Joined the rebellion!");
    } catch (error) {
      toast.error("Failed to follow. Are you even a rebel?");
    }
  };

  if (loading) return null;
  if (users.length === 0) return null;

  return (
    <WidgetContainer title="Who to Roast" className="!rounded-[1.5rem]">
        <div className="flex flex-col">
          {users.map((user, i) => (
            <div key={user.id} className={`px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-all group ${i !== users.length - 1 ? 'border-b border-white/5' : ''}`}>
              <Link href={`/profile/${user.username || user.id}`} className="flex items-center gap-3 group/avatar min-w-0">
                <Avatar className="w-9 h-9 border border-white/10 rounded-full group-hover/avatar:border-red-600/50 transition-colors shrink-0">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-[8px] font-black italic">
                    {user.username?.slice(0, 2).toUpperCase() || "RB"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="font-black text-[13px] group-hover/avatar:text-red-500 text-white truncate transition-colors">
                    {user.username || `${user.walletAddress.slice(0, 4)}...`}
                  </span>
                  <span className="text-[9px] text-white/30 font-black uppercase tracking-widest truncate">@{user.username?.toLowerCase() || "rebel"}</span>
                </div>
              </Link>
              <Button 
                size="sm" 
                disabled={followedIds.has(user.id)}
                className={`rounded-full font-black text-[9px] uppercase tracking-widest px-4 h-8 transition-all shrink-0 ${
                  followedIds.has(user.id) 
                    ? "bg-transparent text-white/20 border border-white/5" 
                    : "bg-white text-black hover:bg-red-600 hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFollow(user.id);
                }}
              >
                {followedIds.has(user.id) ? "JOINED" : "ROAST"}
              </Button>
            </div>
          ))}
        </div>
      </WidgetContainer>
  );
}
