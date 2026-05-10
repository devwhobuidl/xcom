"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hash, Users, Sparkles, Smile, Image as ImageIcon, Shield, Skull, Zap, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  createdAt: string | Date;
  system?: boolean;
  user: {
    id?: string;
    username: string;
    image?: string;
    walletAddress?: string;
  };
}

const CHANNELS = [
  { id: 'general', name: 'general', icon: Hash },
  { id: 'airdrops', name: 'airdrops', icon: Zap },
  { id: 'memes', name: 'memes', icon: Smile },
  { id: 'dev-talk', name: 'dev-talk', icon: Shield },
  { id: 'raids', name: 'raids', icon: Skull },
];

export function ChatClient() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentChannel, setCurrentChannel] = useState('general');
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Connect to standalone chat server
    const newSocket = io(process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !session?.user) return;

    const user = session.user as any;
    
    // Join channel
    socket.emit('join', {
      channel: currentChannel,
      userId: user.id || user.walletAddress,
      username: user.username || user.walletAddress?.slice(0, 8)
    });

    socket.on('history', (history: Message[]) => {
      setMessages(history);
    });

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('online_count', (count: number) => {
      setOnlineCount(count);
    });

    socket.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers((prev) => 
        isTyping ? Array.from(new Set([...prev, username])) : prev.filter(u => u !== username)
      );
    });

    return () => {
      socket.off('history');
      socket.off('message');
      socket.off('online_count');
      socket.off('user_typing');
    };
  }, [socket, currentChannel, session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !socket || !session?.user) return;

    const user = session.user as any;
    socket.emit('message', {
      channel: currentChannel,
      userId: user.id || user.walletAddress,
      content: input
    });
    
    setInput('');
    setShowEmojiPicker(false);
    socket.emit('typing', { channel: currentChannel, username: user.username, isTyping: false });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!socket || !session?.user) return;
    
    const user = session.user as any;
    socket.emit('typing', { 
      channel: currentChannel, 
      username: user.username || user.walletAddress?.slice(0, 8), 
      isTyping: e.target.value.length > 0 
    });
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket && session?.user) {
      // In a real app, you'd upload to S3/Cloudinary and get a URL
      // For now, we'll simulate an image message
      const user = session.user as any;
      socket.emit('message', {
        channel: currentChannel,
        userId: user.id || user.walletAddress,
        content: `Uploaded an image: ${file.name} (Preview Coming Soon)`
      });
    }
  };

  return (
    <div className="flex h-full bg-black overflow-hidden font-mono selection:bg-red-500/30">
      {/* LEFT: Channel Sidebar */}
      <div className="w-64 border-r border-white/5 bg-black/50 flex flex-col hidden md:flex relative z-20 overflow-y-auto scrollbar-thin">
        <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <Skull size={18} className="text-red-500" />
            <h2 className="text-xs font-bold text-white uppercase tracking-widest">Rebel Channels</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setCurrentChannel(ch.name)}
              className={`w-full flex items-center px-4 py-2.5 space-x-3 transition-all relative group ${
                currentChannel === ch.name 
                ? 'text-red-500' 
                : 'text-white/40 hover:text-white/80'
              }`}
            >
              {currentChannel === ch.name && (
                <motion.div 
                  layoutId="activeChannel"
                  className="absolute inset-y-0 left-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]" 
                />
              )}
              <ch.icon size={16} className={currentChannel === ch.name ? 'text-red-500' : 'text-white/20 group-hover:text-white/40'} />
              <span className="text-sm font-bold lowercase tracking-tight">#{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        <div className="cyber-scanline" />
        
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md bg-black/60 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <button className="text-white/40"><Hash size={20} /></button>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black text-white lowercase">#{currentChannel}</h1>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{onlineCount} rebels online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin relative z-0"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <Skull size={48} className="text-red-500 mb-4 animate-pulse" />
              <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-2">Welcome to the rebellion</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Roast Nikita freely 💀</p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start space-x-3 group ${msg.system ? 'justify-center py-2' : ''}`}
              >
                {!msg.system && (
                  <Avatar className="w-9 h-9 border border-white/5 rounded-xl group-hover:border-red-500/30 transition-all duration-500">
                    <AvatarImage src={msg.user.image || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${msg.user.username}`} />
                    <AvatarFallback className="bg-white/5 text-white/40 text-[10px] font-bold">
                      {msg.user.username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col min-w-0 ${msg.system ? 'items-center w-full' : 'flex-1'}`}>
                  {!msg.system && (
                    <div className="flex items-baseline space-x-2 mb-0.5">
                      <span className="text-xs font-black text-white/90 group-hover:text-red-500 transition-colors">
                        {msg.user.username}
                      </span>
                      <span className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  )}
                  
                  <div className={`
                    ${msg.system 
                      ? 'bg-red-500/5 text-red-500/60 border border-red-500/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest' 
                      : 'text-white/70 text-sm leading-relaxed'}
                    max-w-3xl break-words
                  `}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Typing & Input Area */}
        <div className="p-4 bg-black/80 border-t border-white/5 backdrop-blur-2xl relative z-10">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute -top-6 left-4 h-4 overflow-hidden">
              <AnimatePresence>
                {typingUsers.length > 0 && (
                  <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: 20 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-tight">
                      {typingUsers[0]} is transmitting...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-16 left-0 bg-neutral-900 border border-white/10 p-2 rounded-2xl grid grid-cols-5 gap-2 shadow-2xl backdrop-blur-xl z-50"
                >
                  {['🔥', '💀', '🚀', '🧪', '☢️', '☣️', '🔫', '💣', '🖕', '🤡'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={sendMessage} className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-2xl p-1.5 pr-2 focus-within:border-red-500/50 transition-all group">
              <div className="flex items-center px-1">
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-xl transition-all ${showEmojiPicker ? 'bg-red-500/20 text-red-500' : 'text-white/20 hover:text-white/60 hover:bg-white/5'}`}
                >
                  <Smile size={20} />
                </button>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all"
                >
                  <ImageIcon size={20} />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </button>
              </div>
              
              <input
                type="text"
                value={input}
                onChange={handleTyping}
                placeholder={`Signal to #${currentChannel}...`}
                className="flex-1 bg-transparent border-none py-3 text-sm text-white placeholder:text-white/10 focus:ring-0 outline-none"
              />
              
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-white/10 hover:bg-red-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-20 active:scale-95 shadow-lg group-hover:shadow-red-500/10"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT: Trends Sidebar */}
      <div className="w-80 border-l border-white/5 bg-black/50 flex flex-col hidden lg:flex relative z-20 overflow-y-auto scrollbar-thin">
        <div className="p-4 border-b border-white/5 bg-black/40">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Rebel Intel</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Hot Signals</span>
            <div className="space-y-1">
              {[
                { tag: 'FuckNikita', count: '1,421' },
                { tag: 'ChaosDrop', count: '892' },
                { tag: 'RaidsOnly', count: '542' },
              ].map(item => (
                <div key={item.tag} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
                  <span className="text-sm font-bold text-white/60 group-hover:text-red-500 transition-colors">#{item.tag}</span>
                  <span className="text-[10px] text-white/20 font-mono tracking-tighter">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quick Raid</span>
            <button className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black uppercase tracking-[0.15em] hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] active:scale-[0.98]">
              Initiate Raid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatClient;
