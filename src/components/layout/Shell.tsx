"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Bookmark, 
  User, 
  MoreHorizontal, 
  Skull,
  TrendingUp,
  MessageSquare,
  Shield,
  LayoutGrid,
  Trophy,
  History,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/auth/WalletButton";
import { Button } from "@/components/ui/button";
import { ChaosPassModal } from "./ChaosPassModal";
import { CreatePost } from "../feed/CreatePost";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Explore", href: "/trending" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: History, label: "History", href: "/more" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: User, label: "Profile", href: "/profile" },
];

const QUICK_LINKS = [
  { icon: LayoutGrid, label: "Communities", href: "/communities" },
  { icon: Settings, label: "Settings", href: "/more" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPostOpen, setIsPostOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-[1400px] mx-auto flex min-h-screen relative z-10">
        {/* Left Sidebar */}
        <aside className="w-20 xl:w-[300px] flex flex-col h-screen sticky top-0 border-r border-white/5 px-2 xl:px-4 py-6 bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3 px-4 mb-8">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-12 h-12 bg-primary flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all group-hover:scale-110"
              >
                <Skull className="w-7 h-7 text-white" />
              </motion.div>
              <span className="hidden xl:block text-2xl font-black italic tracking-tighter text-white group-hover:nikita-glitch">
                XCOM
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                      isActive 
                        ? "bg-white/5 text-primary border border-white/5 shadow-xl" 
                        : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                    )}
                  >
                    <item.icon className={cn(
                      "w-6 h-6 transition-transform duration-500",
                      isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"
                    )} />
                    <span className={cn(
                      "hidden xl:block font-black uppercase tracking-[0.15em] text-xs",
                      isActive ? "text-primary" : ""
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-glow"
                        className="absolute right-0 w-1 h-6 bg-primary rounded-full blur-[2px] hidden xl:block"
                      />
                    )}
                  </Link>
                );
              })}

              <div className="my-6 border-t border-white/5 mx-4" />

              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl text-white/30 hover:text-white hover:bg-white/[0.02] transition-all group"
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-6" />
                  <span className="hidden xl:block font-bold uppercase tracking-widest text-[10px]">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <Button 
                onClick={() => setIsPostOpen(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-7 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                <TrendingUp className="w-5 h-5 hidden xl:block group-hover:rotate-12 transition-transform" />
                <span className="hidden xl:block uppercase tracking-widest text-xs">Mobilize</span>
                <TrendingUp className="w-6 h-6 xl:hidden" />
              </Button>
              
              <div className="px-2 xl:px-0">
                <WalletButton />
              </div>

              <ChaosPassModal />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex">
          {children}
        </main>
      </div>

      <CreatePost isOpen={isPostOpen} setIsOpen={setIsPostOpen} />
    </div>
  );
}
