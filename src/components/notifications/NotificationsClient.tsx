"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Zap, 
  Repeat2, 
  Bell, 
  Skull,
  Trash2,
  MoreHorizontal,
  Flame,
  Check
} from "lucide-react";
import Link from "next/link";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { markNotificationsAsRead, reactToPost } from "@/app/actions/community";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard } from "@/components/feed/PostCard";

interface Notification {
  id: string;
  type: "FOLLOW" | "LIKE" | "REPLY" | "REPOST" | "AIRDROP";
  issuer: {
    id: string;
    username?: string;
    image?: string;
    walletAddress: string;
    points?: number;
  };
  post?: any;
  createdAt: Date;
  read: boolean;
}

export const NotificationsClient = ({ 
  initialNotifications,
  currentUserId 
}: { 
  initialNotifications: Notification[];
  currentUserId?: string;
}) => {
  const MOCK_NOTIFICATIONS: Notification[] = [
    {
      id: "mock-n1",
      type: "AIRDROP",
      issuer: { id: "treasury", username: "XCOM_TREASURY", walletAddress: "TREASURY...", points: 0 },
      createdAt: new Date(),
      read: false
    },
    {
      id: "mock-n2",
      type: "FOLLOW",
      issuer: { id: "u1", username: "nikita_hunter", walletAddress: "0x123...", points: 1200 },
      createdAt: new Date(Date.now() - 3600000),
      read: true
    },
    {
      id: "mock-n3",
      type: "LIKE",
      issuer: { id: "u2", username: "chaos_bringer", walletAddress: "0x456...", points: 800 },
      post: { id: "p1", content: "Fuck you Nikita! $XCOM to the moon!", createdAt: new Date(Date.now() - 8000000) },
      createdAt: new Date(Date.now() - 7200000),
      read: true
    }
  ];

  const [activeTab, setActiveTab] = useState<"all" | "mentions" | "drops">("all");
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications.length > 0 ? initialNotifications : MOCK_NOTIFICATIONS
  );
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  
  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    await markNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setIsMarkingAll(false);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      if (activeTab === "mentions") {
        return notif.type === "REPLY" || notif.type === "REPOST";
      }
      if (activeTab === "drops") {
        return notif.type === "AIRDROP";
      }
      return true;
    });
  }, [notifications, activeTab]);

  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: Notification[] } = {};
    
    filteredNotifications.forEach(notif => {
      const date = new Date(notif.createdAt);
      let groupKey = "Earlier";
      
      if (isToday(date)) groupKey = "Today";
      else if (isYesterday(date)) groupKey = "Yesterday";
      else groupKey = format(date, "MMMM d, yyyy");
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(notif);
    });
    
    return groups;
  }, [filteredNotifications]);

  const handleFuckYou = async (postId: string) => {
    try {
      await reactToPost(postId, "FUCK_YOU");
      // Could add a toast or optimistic UI update here
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  const renderNotificationContent = (notif: Notification) => {
    const issuerName = notif.issuer.username || `${notif.issuer.walletAddress.slice(0, 4)}...${notif.issuer.walletAddress.slice(-4)}`;
    const timeAgo = formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true });
    
    switch (notif.type) {
      case "LIKE":
        return (
          <Link href={notif.post ? `/status/${notif.post.id}` : "#"} className="flex gap-4 w-full group py-1 px-2 cursor-pointer">
            <div className="flex flex-col items-center pt-1 w-10 shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-white/10 ring-2 ring-transparent group-hover:ring-red-500/20 transition-all shrink-0">
                  <AvatarImage src={notif.issuer.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-[10px] font-black">{issuerName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="text-[14px] truncate">
                  <span className="font-black text-white">{issuerName}</span>
                  <span className="text-white/50 font-medium"> liked your roast</span>
                </div>
                <span className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-auto shrink-0">{timeAgo}</span>
              </div>
              {notif.post && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white/40 text-[14px] leading-relaxed relative group-hover:border-white/10 transition-all group/post">
                  <div className="italic opacity-60 line-clamp-2">"{notif.post.content}"</div>
                </div>
              )}
            </div>
          </Link>
        );

      case "FOLLOW":
        return (
          <Link href={`/profile/${notif.issuer.id}`} className="flex gap-4 w-full group py-2 px-2 cursor-pointer">
            <div className="flex flex-col items-center pt-1 w-10 shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <UserPlus className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar className="w-12 h-12 border-2 border-white/10 shadow-2xl transition-transform group-hover:scale-105">
                      <AvatarImage src={notif.issuer.image || ""} />
                      <AvatarFallback className="bg-zinc-800 font-black">{issuerName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-black flex items-center justify-center">
                      <Check className="w-3 h-3 text-white stroke-[4px]" />
                    </div>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-black text-white text-[16px] leading-none truncate">{issuerName}</span>
                    <span className="text-[11px] text-white/30 font-black uppercase tracking-widest mt-1">REBEL RECRUIT</span>
                  </div>
                </div>
                <div className="text-[10px] text-white/20 font-black uppercase tracking-widest shrink-0 ml-2">{timeAgo}</div>
              </div>
              <div className="text-[14px] text-white/60 font-medium bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 group-hover:bg-white/[0.05] transition-all">
                Joined your rebellion in the Pit
              </div>
            </div>
          </Link>
        );

      case "REPLY":
      case "REPOST":
        if (notif.post) {
           const postData = {
             ...notif.post,
             author: notif.issuer,
             reactions: notif.post.reactions || [],
             _count: notif.post._count || { reactions: 0, replies: 0 }
           };
           return (
             <div className="w-full relative group/feed">
               <div className="absolute top-4 left-4 z-10 pointer-events-none">
                 {notif.type === "REPLY" ? (
                   <div className="bg-green-500/20 backdrop-blur-md border border-green-500/40 p-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                     <MessageSquare className="w-3.5 h-3.5 text-green-500 fill-green-500" />
                   </div>
                 ) : (
                   <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/40 p-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                     <Repeat2 className="w-3.5 h-3.5 text-purple-500" />
                   </div>
                 )}
               </div>
               <div className="flex items-center gap-2 mb-2 ml-14">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/30">
                    {notif.type === "REPLY" ? "REPLIED TO YOU" : "REPOSTED YOUR ROAST"}
                  </span>
                  <span className="text-[10px] text-white/10 font-black uppercase tracking-widest">· {timeAgo}</span>
               </div>
               <div className="transition-all duration-300 group-hover/feed:bg-white/[0.01] -mx-6 rounded-2xl">
                <PostCard post={postData} currentUserId={currentUserId} />
               </div>
             </div>
           );
        }
        return null;

      case "AIRDROP":
        return (
          <div className="flex gap-4 w-full bg-gradient-to-br from-green-500/10 via-green-500/[0.02] to-transparent p-5 rounded-3xl border border-green-500/20 shadow-[inset_0_0_30px_rgba(34,197,94,0.05)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-all duration-500 shadow-[0_0_25px_rgba(34,197,94,0.25)] relative z-10 shrink-0">
              <Zap className="w-7 h-7 text-green-500 fill-green-500 animate-pulse" />
            </div>
            <div className="flex-1 relative z-10 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-black italic uppercase tracking-tighter text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  $XCOM Dropped!
                </span>
                <span className="text-[10px] text-green-500/40 font-black uppercase tracking-widest shrink-0 ml-2">{timeAgo}</span>
              </div>
              <p className="text-[15px] text-white/70 leading-relaxed font-medium">
                The treasury recognized your chaos. <span className="text-white font-black italic">420 tokens</span> have been moved to your wallet.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-[10px] font-black text-green-500 uppercase tracking-[0.15em] shadow-lg">
                  CONFIRMED
                </div>
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">
                  TX: CtWo...umQe
                </div>
              </div>
            </div>
          </div>
        );

    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Tabs */}
      <div className="flex border-b border-white/5 sticky top-[68px] sm:top-[61px] z-30 bg-black/80 backdrop-blur-md">
        <button 
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-4 hover:bg-white/5 transition-colors relative group ${activeTab === "all" ? "text-white" : "text-white/50"}`}
        >
          <span className={`text-xs ${activeTab === "all" ? "font-black italic uppercase tracking-tighter scale-110" : "font-black uppercase tracking-tighter opacity-30 group-hover:opacity-60"} transition-all duration-300 block`}>All</span>
          {activeTab === "all" && (
            <motion.div 
              layoutId="notifTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
            />
          )}
        </button>
        <button 
          onClick={() => setActiveTab("mentions")}
          className={`flex-1 py-4 hover:bg-white/5 transition-colors relative group ${activeTab === "mentions" ? "text-white" : "text-white/50"}`}
        >
          <span className={`text-xs ${activeTab === "mentions" ? "font-black italic uppercase tracking-tighter scale-110" : "font-black uppercase tracking-tighter opacity-30 group-hover:opacity-60"} transition-all duration-300 block`}>Mentions</span>
          {activeTab === "mentions" && (
            <motion.div 
              layoutId="notifTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
            />
          )}
        </button>
        <button 
          onClick={() => setActiveTab("drops")}
          className={`flex-1 py-4 hover:bg-white/5 transition-colors relative group ${activeTab === "drops" ? "text-white" : "text-white/50"}`}
        >
          <span className={`text-xs ${activeTab === "drops" ? "font-black italic uppercase tracking-tighter scale-110" : "font-black uppercase tracking-tighter opacity-30 group-hover:opacity-60"} transition-all duration-300 block`}>Drops</span>
          {activeTab === "drops" && (
            <motion.div 
              layoutId="notifTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" 
            />
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1">
        {filteredNotifications.length > 0 && (
          <div className="flex justify-end px-4 py-3 border-b border-white/5 bg-white/[0.01]">
            <button 
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll || !notifications.some(n => !n.read)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors disabled:opacity-0 flex items-center gap-2 group"
            >
              {isMarkingAll ? "MARKING..." : (
                <>
                  <Check className="w-3 h-3 group-hover:scale-125 transition-transform" />
                  Mark all as read
                </>
              )}
            </button>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {Object.entries(groupedNotifications).map(([groupName, groupNotifs]) => (
            <div key={groupName} className="flex flex-col">
              <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-mono">{groupName}</span>
              </div>
              <div className="divide-y divide-white/5">
                {groupNotifs.map((notif) => (
                  <motion.div 
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-6 transition-all hover:bg-white/[0.03] relative ${!notif.read ? "bg-red-500/[0.03]" : ""}`}
                  >
                    {!notif.read && (
                      <div className="absolute top-8 left-2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,1)]" />
                    )}
                    {renderNotificationContent(notif)}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="py-40 flex flex-col items-center justify-center text-center px-4 space-y-8">
             <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                duration: 1,
                bounce: 0.5
              }}
              className="relative"
             >
                <div className="w-32 h-32 bg-zinc-900/50 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.03)] backdrop-blur-xl group cursor-default">
                   <Bell className="w-16 h-16 text-white/10 group-hover:text-white/20 transition-colors duration-500" />
                </div>
                <motion.div 
                  animate={{ 
                    rotate: [0, 15, -15, 15, 0],
                    scale: [1, 1.2, 1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-4 border-black shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                  <Skull className="w-5 h-5 text-white" />
                </motion.div>
             </motion.div>

             <div className="space-y-3 max-w-[320px]">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                 Silence in The Pit
               </h3>
               <p className="text-[15px] text-white/40 leading-relaxed font-medium">
                 Nikita hasn’t noticed your rebellion yet. Keep roasting harder to trigger the sensors.
               </p>
             </div>

             <Link href="/">
               <button className="bg-red-600 hover:bg-red-500 text-white font-black italic uppercase tracking-tighter px-10 py-4 rounded-full transition-all hover:scale-110 active:scale-95 shadow-[0_20px_40px_rgba(220,38,38,0.3)] border border-red-400/30 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 <span className="flex items-center gap-3 relative z-10">
                    Start Roasting
                    <Flame className="w-5 h-5 text-white fill-white group-hover:animate-bounce" />
                 </span>
               </button>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsClient;
