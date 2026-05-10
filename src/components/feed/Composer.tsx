"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Image as ImageIcon, Smile, BarChart2, Calendar, MapPin, Send, X, Skull, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createPost, getJoinedCommunities } from "@/app/actions/community";
import Image from "next/image";

interface ComposerProps {
  parentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
  initialCommunityId?: string;
}

export function Composer({ parentId, placeholder, onSuccess, initialCommunityId }: ComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);
  const [isCommunityMenuOpen, setIsCommunityMenuOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const init = async () => {
      if (session) {
        const joined = await getJoinedCommunities();
        setCommunities(joined);
        
        if (initialCommunityId) {
          const initial = joined.find(c => c.id === initialCommunityId);
          if (initial) setSelectedCommunity(initial);
        }
      }
    };
    init();
  }, [session, initialCommunityId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Meme too large! Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (!session) {
      toast.error("Sign in to roast Nikita!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost(content, image || undefined, parentId, selectedCommunity?.id);
      setContent("");
      setImage(null);
      toast.success(parentId ? "Reply live! +20 XCOM Points 🔥" : "Post live! +50 XCOM Points 🔥");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to post. Nikita is censoring us?");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className={`p-4 pb-2 ${!parentId ? "border-b border-white/5" : "bg-white/[0.02] rounded-2xl mb-2 mt-2"}`}>
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 border border-white/10 rounded-full">
          <AvatarImage src={(session?.user as any)?.image || ""} />
          <AvatarFallback className="bg-secondary text-primary font-bold">
            {session?.user?.name?.slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          {!parentId && (
            <div className="relative">
              <button 
                onClick={() => setIsCommunityMenuOpen(!isCommunityMenuOpen)}
                className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all group"
              >
                {selectedCommunity ? (
                  <>
                    <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                       <Skull className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{selectedCommunity.name}</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">The Pit (Public)</span>
                  </>
                )}
                <ChevronDown className={`w-3 h-3 text-white/20 group-hover:text-white/40 transition-transform ${isCommunityMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCommunityMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 p-2 py-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 pb-2 border-b border-white/5 mb-2">
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Post to...</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCommunity(null);
                      setIsCommunityMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20">
                       <Globe className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-white">The Pit</span>
                       <span className="text-[9px] text-white/30 font-medium">Public for all rebels</span>
                    </div>
                  </button>
                  
                  {communities.map(community => (
                    <button 
                      key={community.id}
                      onClick={() => {
                        setSelectedCommunity(community);
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all overflow-hidden">
                        {community.avatar ? <img src={community.avatar} className="w-full h-full object-cover" /> : <Skull className="w-4 h-4 text-white/20" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{community.name}</span>
                        <span className="text-[9px] text-white/30 font-medium">{community.memberCount} members</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder || "What's happening? Roast Nikita..."}
            className="w-full bg-transparent text-xl leading-relaxed resize-none outline-none placeholder:text-white/20 min-h-[50px] py-2 scrollbar-hide font-medium tracking-tight"
          />

          <AnimatePresence>
            {image && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative mt-2 rounded-2xl overflow-hidden border border-white/10 aspect-video group"
              >
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-0.5 -ml-2">
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleImageSelect} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors group/tool"
              >
                <ImageIcon className="w-5 h-5 group-hover/tool:scale-110 transition-transform" />
              </button>
              <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors group/tool">
                <Smile className="w-5 h-5 group-hover/tool:scale-110 transition-transform" />
              </button>
              <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors group/tool">
                <BarChart2 className="w-5 h-5 group-hover/tool:scale-110 transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {content.length > 0 && (
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <svg className="w-6 h-6 -rotate-90">
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      className="text-white/10"
                    />
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeDasharray={2 * Math.PI * 10}
                      strokeDashoffset={2 * Math.PI * 10 * (1 - Math.min(content.length / 280, 1))}
                      className={`${content.length > 280 ? "text-red-500" : content.length > 260 ? "text-yellow-500" : "text-primary"}`}
                    />
                  </svg>
                  {content.length > 260 && (
                    <span className={`absolute text-[10px] font-bold ${content.length > 280 ? "text-red-500" : "text-white/50"}`}>
                      {280 - content.length}
                    </span>
                  )}
                </div>
              )}
              
              <button
                disabled={!content.trim() || isSubmitting || content.length > 280}
                onClick={handleSubmit}
                className={`px-8 py-2.5 rounded-full font-black uppercase text-sm transition-all flex items-center gap-2 italic tracking-widest ${
                  content.trim() && !isSubmitting && content.length <= 280
                    ? "bg-primary text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,0,0.5)]" 
                     : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Skull className="w-4 h-4" />
                  </motion.div>
                ) : (parentId ? "REPLY" : "POST CHAOS")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
