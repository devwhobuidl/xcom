"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Skull, Flame, Bomb, X, Gavel } from "lucide-react";
import { motion } from "framer-motion";

interface ChaosPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChaosPassModal = ({ isOpen, onClose }: ChaosPassModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-red-900/50 border-2 text-white max-w-2xl p-0 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[100px] rounded-full" />
          
          <div className="relative p-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-6"
            >
              <div className="relative">
                <Skull className="w-20 h-20 text-red-600 animate-pulse" />
                <Flame className="w-8 h-8 text-orange-500 absolute -top-2 -right-2 animate-bounce" />
                <Gavel className="w-10 h-10 text-zinc-500 absolute -bottom-4 -right-4 -rotate-45" />
                <Bomb className="w-8 h-8 text-zinc-600 absolute -bottom-2 -left-2 rotate-12" />
              </div>
            </motion.div>

            <div className="relative mb-4">
              <h1 className="text-6xl font-black text-red-600 tracking-tighter italic uppercase">
                PREMIUM?
              </h1>
              <div className="absolute -inset-1 text-red-600/30 blur-sm animate-pulse uppercase text-6xl font-black tracking-tighter italic pointer-events-none">
                PREMIUM?
              </div>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-3xl font-bold mb-6 tracking-tight text-white/90 uppercase">
                We don't do that corporate shit here.
              </p>
              
              <div className="space-y-4 mb-8 text-zinc-400 font-medium text-lg">
                <p>
                  This is the <span className="text-white font-bold">$XCOM rebellion</span>.
                </p>
                <div className="flex flex-col gap-1">
                  <p>No subscriptions. No paywalls.</p>
                  <p>Just pure chaos and real rewards.</p>
                </div>
              </div>

              <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-2xl mb-8 relative group overflow-hidden">
                <div className="absolute inset-0 bg-red-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <p className="text-2xl font-black text-red-500 relative z-10">
                  Post more. Hate Nikita harder.<br/>
                  Get $XCOM airdrops.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="group relative px-12 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  BACK TO THE PIT <Skull className="w-6 h-6" />
                </span>
                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl" />
              </button>
            </motion.div>
            
            {/* Edge Memes/Decoration */}
            <div className="mt-12 flex gap-8 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-2 text-xs font-mono">
                 <X className="w-4 h-4 text-red-600" /> BROKEN SYSTEM
               </div>
               <div className="flex items-center gap-2 text-xs font-mono">
                 <Bomb className="w-4 h-4 text-red-600" /> BYE NIKITA
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
