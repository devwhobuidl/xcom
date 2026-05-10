"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  BarChart3, 
  LogOut, 
  ChevronRight,
  Shield,
  Zap,
  Skull
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

export function ProfileDropdown({ isOpen, onClose, user }: ProfileDropdownProps) {
  const menuItems = [
    { 
      label: "View Profile", 
      icon: User, 
      href: `/profile/${user.id}`,
      description: "Your rebellion status" 
    },
    { 
      label: "My Stats", 
      icon: BarChart3, 
      href: "/stats",
      description: "Influence & Points" 
    },
    { 
      label: "Settings", 
      icon: Settings, 
      href: "/settings",
      description: "Calibrate equipment" 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={onClose}
          />
          
          {/* Dropdown Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-4 w-72 bg-zinc-950 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[70] overflow-hidden"
          >
            {/* User Header */}
            <div className="p-5 border-b border-white/5 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center border border-red-600/30">
                  <Skull className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black italic uppercase text-white truncate leading-none">
                    {user.name || "Rebel"}
                  </span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                    Level 14 Rebellion
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-red-600/30 group-hover:bg-red-600/10 transition-all">
                    <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-red-600 transition-colors" />
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-sm font-black italic uppercase text-white tracking-tight">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none mt-1">
                      {item.description}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-red-600 transition-colors" />
                </Link>
              ))}

              <div className="h-px bg-white/5 my-2 mx-3" />

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-4 p-3 hover:bg-red-600/10 rounded-2xl transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-red-600/30 transition-all">
                  <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-600 transition-colors" />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-sm font-black italic uppercase text-red-600 tracking-tight">
                    Terminate Session
                  </span>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none mt-1">
                    Log out of XCOM
                  </span>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="bg-red-600/5 p-3 flex items-center justify-center gap-2">
              <Zap className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-red-600/60">
                Connected to The Pit
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
