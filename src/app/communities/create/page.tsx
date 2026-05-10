"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createCommunity } from "@/app/actions/community";
import { Users, Plus, Hash, Shield, Info, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateCommunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    setLoading(true);
    try {
      const res = await createCommunity(formData);
      if (res.success) {
        toast.success("District established. Recruiting rebels...");
        const community = (res as any).community;
        router.push(`/community/${community.slug}`);
      } else {
        toast.error(res.error || "Establishment failed.");
      }
    } catch (error) {
      toast.error("Critical system failure during establishment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-zinc-950/50">
        <Link href="/communities" className="p-2 hover:bg-white/5 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">Establish District</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Claim your territory in the rebellion</p>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Users className="w-3 h-3" />
              District Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Nikita Roasters"
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold placeholder:text-white/10"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Hash className="w-3 h-3" />
              District Slug (URL)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">xcom.lol/community/</span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="nikita-haters"
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 pl-[165px] text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold placeholder:text-white/10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Manifesto
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is the purpose of this district?"
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold placeholder:text-white/10 resize-none"
            />
          </div>

          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">District Commander</h4>
                <p className="text-[10px] font-bold text-white/30 leading-relaxed mt-1">
                  You will be the founder and primary administrator of this district. You can assign other commanders and moderators once established.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.name || !formData.slug}
            className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] hover:bg-red-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Establish District
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
