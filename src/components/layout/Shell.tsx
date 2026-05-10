"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Skull, 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User, 
  Shield, 
  Settings,
  MoreHorizontal,
  Flame,
  LayoutGrid,
  Trophy,
  Zap,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChaosPassModal } from "./ChaosPassModal";
import { useSession } from "next-auth/react";

interface ShellProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export function Shell({ children, rightSidebar }: ShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [chaosPassOpen, setChaosPassOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "THE PIT", href: "/", icon: Home },
    { name: "SQUAD", href: "/communities", icon: LayoutGrid },
    { name: "RANK", href: "/leaderboard", icon: Trophy },
    { name: "CHAOS", href: "/notifications", icon: Bell },
    { name: "PROFILE", href: `/profile/${session?.user?.id || 'me'}`, icon: User },
    { name: "INTEL", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-red-600/30 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1300px] mx-auto flex justify-center">
        {/* Left Sidebar */}
        <header className="hidden sm:flex flex-col sticky top-0 h-screen w-20 xl:w-[275px] shrink-0 pr-4 py-4 overflow-y-auto">
          <Link href="/" className="mb-8 px-4 flex items-center gap-3 group">
            <div className="w-12 h-12 bg-red-600 flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-all duration-300 rotate-[-5deg]">
              <Skull className="w-7 h-7 text-white" />
            </div>
            <div className="hidden xl:block">
              <h1 className="text-xl font-black italic tracking-tighter leading-none">XCOM</h1>
              <p className="text-[10px] text-red-500 font-bold tracking-[0.2em]">REBELLION</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-zinc-900 text-white shadow-lg shadow-black/50" 
                      : "text-zinc-500 hover:bg-zinc-900/50 hover:text-white"
                  )}
                >
                  {isActive && <div className="absolute left-0 w-1 h-6 bg-red-600 rounded-full" />}
                  <item.icon className={cn("w-6 h-6", isActive && "text-red-600")} />
                  <span className={cn(
                    "hidden xl:block font-black tracking-tight text-lg uppercase italic",
                    isActive && "italic"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={() => setChaosPassOpen(true)}
              className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-3 px-4 py-4 rounded-2xl shadow-[0_10px_25px_rgba(220,38,38,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Zap className="w-5 h-5 fill-white group-hover:animate-bounce" />
              <span className="hidden xl:block font-black uppercase italic tracking-tight">Chaos Pass</span>
            </button>
          </nav>

          <div className="mt-auto px-2">
            {session ? (
              <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-white/5 group hover:bg-zinc-900 transition-all cursor-pointer">
                <Avatar className="w-10 h-10 border border-white/10 ring-2 ring-red-600/20 group-hover:ring-red-600/40 transition-all">
                  <AvatarImage src={(session?.user as any)?.image || ""} />
                  <AvatarFallback className="bg-primary/20 text-primary font-black italic">
                    {session?.user?.name?.slice(0, 2).toUpperCase() || "RE"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block flex-1 min-w-0">
                  <span className="font-bold text-white text-[13px] leading-none truncate">{session?.user?.name || (session?.user as any)?.walletAddress?.slice(0, 8) || "Rebel"}</span>
                  <span className="text-[10px] text-white/40 font-medium truncate">@{session?.user?.name?.toLowerCase().replace(/\s+/g, '_') || "rebel"}</span>
                </div>
                <MoreHorizontal className="hidden xl:block w-4 h-4 text-zinc-600" />
              </div>
            ) : (
              <Button 
                onClick={() => setChaosPassOpen(true)}
                className="w-full rounded-2xl font-black uppercase italic tracking-tight"
              >
                JOIN REBELLION
              </Button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-[600px] border-x border-white/5 min-h-screen relative bg-zinc-950/20 backdrop-blur-3xl">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex flex-col sticky top-0 h-screen w-[350px] shrink-0 pl-8 py-4 gap-6 overflow-y-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH THE PIT..." 
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-700 uppercase italic tracking-tight"
            />
          </div>

          {rightSidebar}

          <footer className="mt-auto py-4 px-2">
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">
              <Link href="#" className="hover:text-zinc-400">MANIFESTO</Link>
              <Link href="#" className="hover:text-zinc-400">RULES</Link>
              <Link href="#" className="hover:text-zinc-400">INTEL</Link>
              <Link href="#" className="hover:text-zinc-400">REBELLION © 2024</Link>
            </nav>
          </footer>
        </aside>
      </div>

      {/* Mobile Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
        <Link href="/" className="p-2 text-zinc-500 hover:text-white"><Home className="w-6 h-6" /></Link>
        <Link href="/communities" className="p-2 text-zinc-500 hover:text-white"><LayoutGrid className="w-6 h-6" /></Link>
        <div className="p-1 bg-red-600 rounded-full -mt-10 shadow-lg shadow-red-600/30 ring-4 ring-black">
          <Button size="icon" className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700">
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
        <Link href="/notifications" className="p-2 text-zinc-500 hover:text-white"><Bell className="w-6 h-6" /></Link>
        <Link href={`/profile/${session?.user?.id || 'me'}`} className="p-2 text-zinc-500 hover:text-white"><User className="w-6 h-6" /></Link>
      </nav>

      <ChaosPassModal open={chaosPassOpen} onOpenChange={setChaosPassOpen} />
    </div>
  );
}
