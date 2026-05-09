"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Hash, 
  Bell, 
  MessageCircle, 
  Bookmark, 
  Users, 
  User, 
  MoreHorizontal, 
  Skull, 
  TrendingUp, 
  Search,
  Settings,
  ShieldAlert,
  Zap,
  Plus
} from "lucide-react";
import { WalletButton } from "../auth/WalletButton";
import { TrendingWidget } from "../widgets/TrendingWidget";
import { XcomPrice } from "../widgets/XcomPrice";
import { TreasuryStats } from "../widgets/TreasuryStats";
import { NotificationsPreview } from "../widgets/NotificationsPreview";
import { useSession } from "next-auth/react";
import { SuggestedHaters } from "../widgets/SuggestedHaters";
import { NetworkStatus } from "../widgets/NetworkStatus";

interface NavItem {
  icon: any;
  label: string;
  href: string;
  badge?: number;
}

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const navItems: NavItem[] = [
    { icon: Home, label: "The Pit", href: "/" },
    { icon: Search, label: "Explore", href: "/trending" },
    { icon: Bell, label: "Chaos", href: "/notifications", badge: 3 },
    { icon: MessageCircle, label: "Whispers", href: "/messages" },
    { icon: Bookmark, label: "Stolen", href: "/bookmarks" },
    { icon: Users, label: "Clans", href: "/communities" },
    { icon: TrendingUp, label: "Ranks", href: "/leaderboard" },
    { icon: ShieldAlert, label: "Treasury", href: "/treasury" },
    { icon: User, label: "Identity", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans">
      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-7xl mx-auto flex min-h-screen relative">
        {/* LEFT SIDEBAR - NAVIGATION */}
        <aside className="w-20 lg:w-72 flex flex-col border-r border-white/5 sticky top-0 h-screen py-4 shrink-0 px-2 lg:px-4 bg-black/80 backdrop-blur-3xl z-50">
          <Link href="/" className="mb-8 px-4 flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-all duration-300 border-2 border-black">
              <Skull className="w-7 h-7 stroke-[2.5px]" />
            </div>
            <span className="hidden lg:block text-2xl font-black italic tracking-tighter text-white group-hover:text-red-600 transition-colors">XCOM</span>
          </Link>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-white/5 text-white" 
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <div className="relative">
                    <item.icon className={`w-7 h-7 transition-all duration-300 ${isActive ? "scale-110 stroke-[2.5px]" : "group-hover:scale-110"}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-black animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`hidden lg:block text-[17px] font-black tracking-tight ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <JoinedClans />

          <div className="mt-auto px-2 lg:px-0">
             <WalletButton />
          </div>
        </aside>

        {/* MAIN FEED AREA */}
        <main className="flex-1 min-w-0 border-r border-white/5 bg-zinc-950/20">
          <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sm:hidden">
             <Skull className="w-8 h-8" />
             <WalletButton />
          </header>
          {children}
        </main>

        {/* RIGHT SIDEBAR - WIDGETS */}
        {pathname !== "/chat" && (
          <aside className="hidden xl:flex w-96 flex-col sticky top-0 h-screen py-6 px-6 gap-6 shrink-0 bg-black/80 backdrop-blur-3xl overflow-y-auto no-scrollbar">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-white/30 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search the rebellion..."
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all"
              />
            </div>
            
            <XcomPrice />
            <TreasuryStats />
            <NotificationsPreview />
            <TrendingWidget />
            <SuggestedHaters />
            <NetworkStatus />
          </aside>
        )}
        {/* MOBILE FLOATING ACTION BUTTON */}
        <button 
          onClick={() => {
            if (pathname === "/") {
              document.getElementById("main-composer")?.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.href = "/";
            }
          }}
          className="fixed bottom-20 right-6 w-14 h-14 bg-white text-black rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.3)] flex items-center justify-center z-50 sm:hidden active:scale-90 transition-all border-2 border-black"
        >
          <Plus className="w-8 h-8 stroke-[3px]" />
        </button>
      </div>

    </div>
  );
};

const JoinedClans = () => {
  const [clans, setClans] = useState<any[]>([]);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (session) {
      const fetchClans = async () => {
        try {
           const data = await (await import("@/app/actions/community")).getJoinedCommunities();
           setClans(data);
        } catch (e) {
           console.error("Failed to fetch joined clans:", e);
        }
      };
      fetchClans();
    }
  }, [session, pathname]);

  if (!session || clans.length === 0) return null;

  return (
    <div className="mt-8 hidden lg:block px-4">
      <div className="flex items-center gap-2 mb-4 text-white/30">
        <Users className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Joined Clans</span>
      </div>
      <div className="space-y-3">
        {clans.map(clan => (
          <Link 
            key={clan.id} 
            href={`/community/${clan.slug}`}
            className={`flex items-center gap-3 group transition-all p-1 rounded-full hover:bg-white/5 ${pathname === `/community/${clan.slug}` ? 'bg-white/5' : ''}`}
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all overflow-hidden">
               {clan.avatar ? <img src={clan.avatar} className="w-full h-full object-cover" /> : <Skull className="w-4 h-4 text-white/20" />}
            </div>
            <span className={`text-sm font-bold truncate group-hover:text-white transition-colors ${pathname === `/community/${clan.slug}` ? 'text-white' : 'text-white/50'}`}>
              {clan.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
