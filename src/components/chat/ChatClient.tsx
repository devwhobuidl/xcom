"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getChatMessages, sendChatMessage, getOrCreateChannel } from "@/app/actions/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skull, Send, Zap, MessageSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAuthModal } from "@/components/providers/AuthModalProvider";

export function ChatClient() {
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChannelAndMessages = async () => {
    try {
      const chan = await getOrCreateChannel();
      setChannel(chan);
      const msgs = await getChatMessages(chan.id);
      setMessages(msgs.reverse());
    } catch (error) {
      console.error("CHAT_INIT_ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelAndMessages();
    
    // Polling for new messages every 3 seconds
    const interval = setInterval(async () => {
      if (channel) {
        const msgs = await getChatMessages(channel.id);
        setMessages(msgs.reverse());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [channel?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      openAuthModal("signup");
      return;
    }

    if (!content.trim() || !channel) return;

    setSending(true);
    try {
      const res = await sendChatMessage(channel.id, content);
      if (res.success) {
        setContent("");
        // Optimistic update handled by the next poll or I could manually push
        setMessages(prev => [...prev, res.message]);
      }
    } catch (error) {
      toast.error("Failed to transmit. Frequency jammed?");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="font-black uppercase tracking-widest text-xs">Encrypting Frequency...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-64px)] bg-black">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-zinc-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg rotate-[-5deg] shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Skull className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">Global Chaos</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Encrypted Relay Live</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
           <span className="text-[10px] font-black uppercase text-green-500/80">Frequency Clear</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.userId === (session?.user as any)?.id;
            return (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8 shrink-0 border border-white/10">
                  <AvatarImage src={msg.user?.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">
                    {msg.user?.username?.slice(0, 2) || "RE"}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">
                      {msg.user?.username || "Rebel"}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/10">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm font-medium leading-relaxed",
                    isMe 
                      ? "bg-red-600 text-white rounded-tr-none shadow-[0_5px_15px_rgba(220,38,38,0.2)]" 
                      : "bg-zinc-900 text-zinc-100 border border-white/5 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-zinc-950 border-t border-white/5">
        <div className="relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={session ? "Transmit chaos..." : "Enter the pit to transmit..."}
            disabled={sending}
            onClick={() => !session && openAuthModal("signup")}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:bg-zinc-900 transition-all placeholder:text-white/20 uppercase italic tracking-tight cursor-pointer"
          />
          <button
            type="submit"
            disabled={sending || (session && !content.trim())}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95 group"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/10 italic">
           <span>End-to-end chaotic encryption</span>
           <div className="w-1 h-1 rounded-full bg-white/10" />
           <span>Peer-to-peer rebellion</span>
        </div>
      </form>
    </div>
  );
}
