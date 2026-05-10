"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Users, 
  Globe, 
  Lock, 
  Skull,
  Plus,
  Upload,
  Zap,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { createCommunity } from "@/app/actions/community";
import { useRouter } from "next/navigation";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    avatar: "",
    banner: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Name and Slug are mandatory for rebellion recruitment!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCommunity(formData);
      if (res.success) {
        toast.success("District Established! Welcome to the resistance.");
        onClose();
        router.push(`/community/${res.community?.slug}`);
      } else {
        toast.error(res.error || "Establishment failed. Nikita's spies?");
      }
    } catch (error) {
      toast.error("Critical failure during establishment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 flex items-center justify-center rounded-2xl rotate-[-5deg] shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <Skull className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Establish District</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Recruit your squad</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">District Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. THE SOVIETS"
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all placeholder:text-zinc-700 uppercase italic tracking-tight"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Frequency (Slug)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-red-600/40 font-bold italic">/</span>
                    <input 
                      type="text"
                      required
                      placeholder="soviet-base"
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all placeholder:text-zinc-700 italic tracking-tight"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">District Objective</label>
                <textarea 
                  placeholder="What is your clan's purpose? Roast Nikita? Spread Chaos?"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all placeholder:text-zinc-700 uppercase italic tracking-tight min-h-[100px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 border border-white/5 bg-zinc-900/50 rounded-2xl flex items-center gap-3 group cursor-pointer hover:border-red-600/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:bg-red-600/10">
                       <Upload className="w-5 h-5 text-zinc-500 group-hover:text-red-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Avatar</span>
                 </div>
                 <div className="p-4 border border-white/5 bg-zinc-900/50 rounded-2xl flex items-center gap-3 group cursor-pointer hover:border-red-600/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:bg-red-600/10">
                       <Upload className="w-5 h-5 text-zinc-500 group-hover:text-red-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Banner</span>
                 </div>
              </div>

              <div className="bg-red-600/5 border border-red-600/10 rounded-2xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed tracking-wider">
                  Establishing a district costs <span className="text-white">0.1 SOL</span> (Mainnet) or <span className="text-white">500 XCOM Points</span>. This prevents Nikita's bots from flooding our network.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-white hover:bg-red-600 text-black hover:text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-red-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Zap className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Establish Now
                    <Plus className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
