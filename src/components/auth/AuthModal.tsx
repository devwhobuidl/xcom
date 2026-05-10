"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skull, Zap, Wallet, Loader2, ShieldCheck, Flame, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { signup } from "@/app/actions/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
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
        toast.error(res.error === "CredentialsSignin" ? "Invalid credentials. Try again, rebel." : `Error: ${res.error}`);
      } else {
        toast.success("Welcome back to the pit.");
        onClose();
        // Use window.location for a full reload to ensure session state is updated everywhere
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Nikita's firewall blocked the login.");
    } finally {
      setLoading(false);
    }
  };

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
          onClose();
          window.location.href = "/";
        } else {
          setActiveTab("login");
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
        onClose();
        window.location.href = "/";
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-zinc-950 border-white/5 p-0 overflow-hidden rounded-[2.5rem]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full" />
        
        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] rotate-[-5deg]">
                <Skull className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  The Pit
                </DialogTitle>
                <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-red-600">
                  Identity Verification Required
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-zinc-900/50 p-1 rounded-2xl mb-8">
              <TabsTrigger 
                value="login"
                className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Entrance
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                Join Rebellion
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="login">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-zinc-950 px-3 text-zinc-600 italic">OR USE THE CHAIN</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSolanaLogin}
                    disabled={loading}
                    variant="outline"
                    className="w-full h-14 border-red-600/30 hover:bg-red-600/10 text-red-600 font-black uppercase italic tracking-tighter text-lg rounded-2xl transition-all active:scale-95"
                  >
                    <Wallet className="w-5 h-5 mr-3" />
                    {publicKey ? "VERIFY WALLET" : "CONNECT SOLANA"}
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="signup">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl mb-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
                      <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-tight leading-relaxed">
                        Email is optional. Only required if you're a forgetful rebel.
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
                      className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter text-lg rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition-all active:scale-95"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ESTABLISH IDENTITY"}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>

        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
            Fuck You Nikita
          </p>
          <div className="flex gap-4">
            <Flame className="w-3 h-3 text-red-900" />
            <Zap className="w-3 h-3 text-red-900" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
