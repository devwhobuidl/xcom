"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, UserPlus, Zap, Repeat2 } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markNotificationsAsRead } from "@/app/actions/community";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationsClientProps {
  initialNotifications: any[];
  currentUserId: string;
}

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    markNotificationsAsRead().catch(console.error);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "LIKE": return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case "REPLY": return <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-500" />;
      case "FOLLOW": return <UserPlus className="w-4 h-4 text-green-500" />;
      case "REPOST": return <Repeat2 className="w-4 h-4 text-purple-500" />;
      case "AIRDROP": return <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      default: return null;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "LIKE": return "roasted your post";
      case "REPLY": return "replied to your chaos";
      case "FOLLOW": return "joined your cult";
      case "REPOST": return "spread your gospel";
      case "AIRDROP": return "received rebellion rewards";
      default: return "interacted with you";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Silence in the Pit</h3>
        <p className="text-sm max-w-xs leading-relaxed font-bold uppercase tracking-widest opacity-40">No activity detected. Go out there and start a riot.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-white/5">
        <AnimatePresence initial={false}>
          {notifications.map((notification, idx) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`group flex items-start gap-4 p-6 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden ${!notification.read ? 'bg-primary/[0.03]' : ''}`}
            >
              {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
              )}
              
              <div className="mt-1 relative">
                <Link href={`/profile/${notification.issuer.id}`}>
                  <Avatar className="w-12 h-12 border-2 border-white/5 group-hover:border-primary/50 transition-all">
                    <AvatarImage src={notification.issuer.image || ''} />
                    <AvatarFallback className="bg-white/5 font-black italic text-white/40">
                      {notification.issuer.username?.slice(0, 2).toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1.5 border border-white/10 shadow-xl">
                  {getIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/profile/${notification.issuer.id}`} className="font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                    {notification.issuer.username || notification.issuer.walletAddress.slice(0, 4) + '...' + notification.issuer.walletAddress.slice(-4)}
                  </Link>
                  <span className="text-sm font-bold text-white/40 uppercase tracking-tighter">
                    {getLabel(notification.type)}
                  </span>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    • {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {notification.post && (
                  <Link href={`/status/${notification.post.id}`}>
                    <p className="text-sm text-white/60 line-clamp-2 mt-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl group-hover:bg-white/[0.04] transition-all font-medium leading-relaxed italic">
                      "{notification.post.content}"
                    </p>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
