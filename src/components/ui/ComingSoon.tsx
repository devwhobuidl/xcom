"use client";

import React from "react";
import { Skull, Flame, Rocket, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: "skull" | "fire" | "rocket" | "chat";
}

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  const renderIcon = () => {
    switch (icon) {
      case "skull":
        return <Skull className="w-24 h-24 text-red-600 animate-pulse" />;
      case "fire":
        return <Flame className="w-24 h-24 text-orange-600 animate-bounce" />;
      case "rocket":
        return <Rocket className="w-24 h-24 text-zinc-400 animate-pulse" />;
      case "chat":
        return <MessageCircle className="w-24 h-24 text-red-500 animate-bounce" />;
      default:
        return <Skull className="w-24 h-24 text-red-600" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-black/40 rounded-3xl border border-white/5 backdrop-blur-sm m-4 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        {renderIcon()}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">
          {title}
        </h1>
        <p className="text-xl text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed font-medium">
          {description}
        </p>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg font-black transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
        >
          BACK TO THE PIT
        </Link>
      </motion.div>

      {/* Decorative Memes/Text */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-12 opacity-10 font-black text-xs tracking-widest uppercase pointer-events-none">
        <span>FUCK NIKITA</span>
        <span>NO RESTRICTIONS</span>
        <span>$XCOM ONLY</span>
      </div>
    </div>
  );
}

export default ComingSoon;
