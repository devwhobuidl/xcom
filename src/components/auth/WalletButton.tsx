"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import bs58 from "bs58";
import { Wallet, LogOut, Loader2, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function WalletButton() {
  const { publicKey, signMessage, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey && status === "unauthenticated" && !loading) {
      handleSignIn();
    }
  }, [publicKey, status]);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) return;

    try {
      setLoading(true);
      const message = `Sign this message to log in to XCOM Rebellion.\n\nNonce: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      const result = await signIn("credentials", {
        message: message,
        signature: signatureBase58,
        publicKey: publicKey.toBase58(),
        redirect: false,
      });

      if (result?.error) {
        toast.error("Authentication failed: " + result.error);
        disconnect();
      } else {
        toast.success("Joined the rebellion");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign message");
      disconnect();
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterSignIn = () => {
    signIn("twitter");
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    await disconnect();
    toast.info("Left the base");
  };

  if (status === "loading" || loading) {
    return (
      <Button disabled variant="outline" className="gap-2 border-primary/30 bg-primary/5 text-primary">
        <Loader2 className="h-4 w-4 animate-spin" />
        SECURE LINK...
      </Button>
    );
  }

  if (session?.user) {
    const isTwitter = session.user.walletAddress?.startsWith("twitter:");
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden border-primary/20 bg-primary/5 text-primary/70 md:flex">
          {isTwitter ? "TWITTER REBEL" : "SOLANA REBEL"}
        </Badge>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 border-white/10 bg-black/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
          onClick={handleSignOut}
        >
          {isTwitter ? <Twitter className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {session.user.name?.slice(0, 8)}
          </span>
          <LogOut className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline"
        size="sm"
        className="gap-2 border-white/10 bg-black/40 hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400/50"
        onClick={handleTwitterSignIn}
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">TWITTER</span>
      </Button>
      <Button 
        variant="primary"
        size="sm"
        className="gap-2"
        onClick={() => setVisible(true)}
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">CONNECT</span>
      </Button>
    </div>
  );
}
