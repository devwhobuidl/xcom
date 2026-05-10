"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skull, LogOut, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bs58 from "bs58";

export const WalletButton = () => {
  const { wallet, publicKey, signMessage, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { data: session, status } = useSession();
  const [isSigning, setIsSigning] = useState(false);
  const [showRoast, setShowRoast] = useState(false);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) return;

    try {
      setIsSigning(true);
      const message = `Sign in to XCOM Rebellion: ${Date.now()}`;
      console.log("✍️ Signing message:", message);
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      const searchParams = new URLSearchParams(window.location.search);
      const referral = searchParams.get("ref");

      const result = await signIn("credentials", {
        message,
        signature: signatureBase58,
        publicKey: publicKey.toBase58(),
        referral: referral || "",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Signature verification failed. Are you Nikita? 🤨");
      } else {
        setShowRoast(true);
        toast.success("Welcome, fellow Nikita hater 💀");
        setTimeout(() => setShowRoast(false), 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign message. Don't be a pussy.");
    } finally {
      setIsSigning(false);
    }
  };

  useEffect(() => {
    if (publicKey && status === "unauthenticated" && !isSigning) {
      handleSignIn();
    }
  }, [publicKey, status]);

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs text-muted-foreground font-mono">
            {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </span>
          <span className="text-sm font-bold text-primary">UNGÖVERNABLE</span>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-primary/50 hover:bg-primary/10"
          onClick={() => {
            signOut();
            disconnect();
          }}
        >
          <LogOut className="w-4 h-4 text-primary" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setVisible(true)}
        className="w-full bg-white text-black hover:bg-zinc-200 font-black py-6 rounded-full transition-all text-lg uppercase tracking-widest active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
      >
        <span className="flex items-center gap-3">
          <Wallet className="w-5 h-5" />
          {publicKey ? "PROVE YOU HATE NIKITA" : "LOGIN"}
        </span>
      </Button>

      <AnimatePresence>
        {showRoast && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 overflow-hidden"
          >
            {/* Background Glitch Effect */}
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="absolute inset-0 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndnBqZ3BqZ3BqZ3BqZ3BqZ3BqZ3BqZ3BqZ3BqZ3BqZ3BqZ3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxY7F7Z5zq/giphy.gif')] bg-cover bg-center mix-blend-overlay opacity-20"
            />

            <div className="text-center space-y-8 z-10 p-6">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <Skull className="w-40 h-40 text-primary mx-auto drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]" />
              </motion.div>

              <div className="space-y-2">
                <motion.h2 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-black nikita-glitch italic uppercase tracking-tighter text-primary"
                >
                  SYSTEM UNLOCKED
                </motion.h2>
                <motion.p 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-mono text-white max-w-2xl mx-auto"
                >
                  Welcome back to the rebellion, <span className="text-primary font-bold underline italic">you magnificent bastard</span> 💀
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-4 pt-4"
              >
                <div className="px-4 py-2 bg-primary/20 border border-primary/50 text-primary font-mono text-sm animate-pulse">
                  IDENTITY VERIFIED: REBEL #{(Math.random() * 9999).toFixed(0)}
                </div>
              </motion.div>
            </div>

            {/* Simulated Confetti (Particles) */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: "-10%",
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    y: "110%",
                    rotate: 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WalletButton;
