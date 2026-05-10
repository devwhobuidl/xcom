"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Zap, Shield, Key, Wallet, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";

export default function SignInPage() {
  const [method, setMethod] = useState<"credentials" | "solana">("credentials");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { publicKey, signMessage, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleCredentialsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("username-login", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials. Try again, rebel.");
      } else {
        toast.success("Welcome back to the pit.");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Nikita's firewall blocked the login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSolanaLogin = async () => {
    if (!publicKey || !signMessage) {
      setVisible(true);
      return;
    }

    setLoading(true);
    try {
      const message = `Welcome to The Pit.\n\nAuthenticate to join the rebellion.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      const res = await signIn("credentials", {
        message,
        signature: signatureBase58,
        publicKey: publicKey.toBase58(),
        redirect: false,
      });

      if (res?.error) {
        toast.error("Signature failed validation.");
      } else {
        toast.success("Wallet verified. Entering the pit.");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-950/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="p-10 pb-6 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] rotate-[-5deg] mb-6"
            >
              <Skull className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">The Pit</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mt-2">Authentication Required</p>
          </div>

          {/* Tabs */}
          <div className="flex px-8 gap-2 mb-8">
            <button 
              onClick={() => setMethod("credentials")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === "credentials" ? "bg-white text-black shadow-lg" : "bg-white/5 text-zinc-500 hover:bg-white/10"}`}
            >
              Credentials
            </button>
            <button 
              onClick={() => setMethod("solana")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === "solana" ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]" : "bg-white/5 text-zinc-500 hover:bg-white/10"}`}
            >
              Solana Wallet
            </button>
          </div>

          <div className="px-10 pb-10">
            <AnimatePresence mode="wait">
              {method === "credentials" ? (
                <motion.form 
                  key="creds"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleCredentialsLogin}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Username</Label>
                    <Input 
                      name="username"
                      required
                      placeholder="REBEL_COMMANDER"
                      className="bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Secret Key</Label>
                    <Input 
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="bg-white/5 border-white/5 rounded-xl h-12 px-4 text-sm font-bold focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                  <Button 
                    disabled={loading}
                    className="w-full h-14 bg-white hover:bg-zinc-100 text-black font-black uppercase italic tracking-tighter text-lg rounded-2xl transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ENTER THE PIT"}
                  </Button>
                </motion.form>
              ) : (
                <motion.div 
                  key="solana"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-red-600/5 border border-red-600/20 rounded-2xl text-center">
                    <Wallet className="w-10 h-10 text-red-600 mx-auto mb-4" />
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                      Connect your wallet to verify your identity on the blockchain. No password needed.
                    </p>
                  </div>
                  <Button 
                    onClick={handleSolanaLogin}
                    disabled={loading}
                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (publicKey ? "VERIFY IDENTITY" : "CONNECT WALLET")}
                  </Button>
                  {publicKey && (
                    <button 
                      onClick={() => disconnect()}
                      className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      Disconnect: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                New to the rebellion?
              </p>
              <Link 
                href="/auth/signup"
                className="text-white font-black uppercase italic tracking-tighter hover:text-red-600 transition-colors flex items-center gap-2 group"
              >
                Create Account <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic">
          Fuck You Nikita • Power to the Rebels
        </p>
      </motion.div>
    </div>
  );
}
