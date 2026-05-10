"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skull, Loader2, ChevronLeft, ShieldCheck, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signup(formData);

      if (result.success) {
        toast.success("Account established. Welcome to the pit.");
        
        // Auto sign in
        const res = await signIn("username-login", {
          username,
          password,
          redirect: false,
        });

        if (!res?.error) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/auth/signin");
        }
      } else {
        toast.error(result.error || "Establishment failed.");
      }
    } catch (error) {
      toast.error("Nikita's signal jammer active. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Link 
          href="/auth/signin"
          className="absolute -top-12 left-0 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-3 h-3" /> Back to Entrance
        </Link>

        <div className="bg-zinc-950/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden">
          {/* Header */}
          <div className="p-10 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                <Flame className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Join Rebellion</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Establish Identity</p>
              </div>
            </div>
            
            <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl mb-8">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-tight leading-relaxed">
                  Encryption active. Your identity will be anonymized. Email is optional—use it only for recovery.
                </p>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Username (Required)</Label>
                <Input 
                  name="username"
                  required
                  placeholder="NEW_CHAOS_LORD"
                  className="bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email (Optional)</Label>
                <Input 
                  name="email"
                  type="email"
                  placeholder="recovery@rebel.com"
                  className="bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Secret Key (Required)</Label>
                <Input 
                  name="password"
                  type="password"
                  required
                  placeholder="MIN 8 CHARACTERS"
                  className="bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <Button 
                disabled={loading}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition-all active:scale-95 mt-4"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ESTABLISH IDENTITY"}
              </Button>
            </form>
          </div>

          <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              By entering, you agree to post chaos.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-black uppercase text-zinc-700 tracking-widest">Instant Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-black uppercase text-zinc-700 tracking-widest">End-to-End</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
