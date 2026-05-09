"use client";

import React, { useEffect, useState } from "react";
import { Heart, MessageSquare, UserPlus, Bell, Repeat2, Skull, Zap } from "lucide-react";
import { WidgetContainer } from "./WidgetContainer";
import { getNotifications } from "@/app/actions/community";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const NotificationsPreview = () => {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getNotifications();
        setNotifs(data.slice(0, 3));
      } catch (e) {
        console.error("Failed to fetch notifications for preview:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "LIKE": return <Heart className="w-3 h-3 text-red-500 fill-red-500" />;
      case "REPLY": return <MessageSquare className="w-3 h-3 text-green-500 fill-green-500" />;
      case "FOLLOW": return <UserPlus className="w-3 h-3 text-blue-500" />;
      case "REPOST": return <Repeat2 className="w-3 h-3 text-purple-500" />;
      case "AIRDROP": return <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />;
      case "FUCK_YOU": return <Skull className="w-3 h-3 text-red-600" />;
      default: return <Bell className="w-3 h-3 text-white" />;
    }
  };

  const getContent = (notif: any) => {
    const issuerName = notif.issuer.username || `${notif.issuer.walletAddress.slice(0, 4)}...${notif.issuer.walletAddress.slice(-4)}`;
    switch (notif.type) {
      case "LIKE": return <span><b className="text-white">{issuerName}</b> liked your roast</span>;
      case "REPLY": return <span><b className="text-white">{issuerName}</b> replied to you</span>;
      case "FOLLOW": return <span><b className="text-white">{issuerName}</b> followed you</span>;
      case "REPOST": return <span><b className="text-white">{issuerName}</b> reposted you</span>;
      case "AIRDROP": return <span><b className="text-green-500">$XCOM Dropped!</b> 420 tokens recvd</span>;
      case "FUCK_YOU": return <span><b className="text-white">{issuerName}</b> roasted you</span>;
      default: return <span>Notification from <b className="text-white">{issuerName}</b></span>;
    }
  };

  return (
    <WidgetContainer title="Recent Chaos" viewAllHref="/notifications" icon={Bell}>
      <div className="flex flex-col">
        {loading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : notifs.length > 0 ? (
          notifs.map((notif, i) => (
            <Link 
              href={notif.postId ? `/status/${notif.postId}` : `/profile/${notif.issuerId}`}
              key={notif.id} 
              className={`px-5 py-4 hover:bg-white/[0.04] transition-all flex gap-3 group/notif ${i !== notifs.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="relative shrink-0">
                <Avatar className="w-9 h-9 border border-white/10 group-hover/notif:border-white/20 transition-colors shadow-lg">
                  <AvatarImage src={notif.issuer.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-[8px] font-black">
                    {notif.issuer.username?.slice(0, 2).toUpperCase() || "RE"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-1 border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover/notif:scale-110 transition-transform">
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-[12px] text-white/60 leading-tight truncate group-hover/notif:text-white transition-colors">
                  {getContent(notif)}
                </div>
                <p className="text-[9px] text-white/20 font-black mt-1 uppercase tracking-widest font-mono">
                  {formatDistanceToNow(new Date(notif.createdAt))} ago
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-20">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">
              Quiet in the pit...
            </p>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};
