"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, Skull, User, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatClient = ({ channelId, initialMessages = [] }: { channelId: string, initialMessages?: any[] }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !session) return;
    
    // Optimistic update
    const newMessage = {
      id: Date.now().toString(),
      content: input,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      user: session.user
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
    
    // In a real app, send to API/Socket
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50">
      <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 group ${msg.userId === session?.user?.id ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-10 h-10 shrink-0 border border-white/5">
                <AvatarImage src={msg.user.image} />
                <AvatarFallback><User className="w-5 h-5 text-white/20" /></AvatarFallback>
              </Avatar>
              <div className={`flex flex-col gap-1 max-w-[70%] ${msg.userId === session?.user?.id ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 px-1">
                   <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">
                    {msg.user.username || 'Anonymous Dejen'}
                   </span>
                   <span className="text-[8px] font-bold text-white/10">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.userId === session?.user?.id 
                    ? 'bg-red-600/90 text-white shadow-[0_4px_15px_rgba(220,38,38,0.2)] rounded-tr-none' 
                    : 'bg-zinc-900 border border-white/5 text-white/90 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <Button variant="ghost" size="icon" className="shrink-0 text-white/30 hover:text-white hover:bg-white/5">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative group">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Roast the group..."
              className="bg-zinc-900/50 border-white/5 focus-visible:ring-red-600/20 focus-visible:border-red-600/50 h-12 rounded-xl pr-12"
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-1 top-1 h-10 w-10 bg-red-600 hover:bg-red-500 text-white rounded-lg p-0 transition-all active:scale-95 disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
