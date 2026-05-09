"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Wallet } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const WalletButton = () => {
  const { publicKey, connected } = useWallet();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey && status === "unauthenticated") {
      // Auto sign-in if wallet is connected but no session
      // In a real app, you'd want to handle message signing here for security
      signIn("credentials", {
        username: publicKey.toBase58(),
        password: "wallet-auth-placeholder", // Security: implement message signing
        callbackUrl: window.location.origin,
      });
    }
  }, [connected, publicKey, status]);

  if (!mounted) return null;

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10 p-0 overflow-hidden group">
            <Avatar className="h-full w-full">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback className="bg-zinc-800 text-[10px] font-black uppercase text-white/40">
                {session.user.name?.slice(0, 2) || "RE"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <User className="w-4 h-4 text-white" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-white">
          <DropdownMenuItem onClick={() => window.location.href = "/profile"} className="cursor-pointer hover:bg-white/5">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-zinc-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <WalletMultiButton 
        className="!bg-black !h-10 !px-6 !rounded-lg !border !border-white/20 !font-black !text-[12px] !uppercase !tracking-widest hover:!border-white/40 transition-all !font-sans"
      />
    </div>
  );
};
