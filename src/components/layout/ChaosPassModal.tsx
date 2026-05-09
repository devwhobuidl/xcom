"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Flame, Skull, Rocket, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ChaosPassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChaosPassModal({ open, onOpenChange }: ChaosPassModalProps) {
  const perks = [
    { icon: Skull, label: "Exclusive Roasts", color: "text-red-500" },
    { icon: Flame, label: "Burn $XCOM", color: "text-orange-500" },
    { icon: Shield, label: "Rebel Badges", color: "text-blue-500" },
    { icon: Rocket, label: "Early Intel", color: "text-zinc-400" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-zinc-950 border-white/5 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full" />
        
        <DialogHeader className="relative pt-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] rotate-[-5deg] mb-6"
          >
            <Zap className="w-8 h-8 text-white fill-white" />
          </motion.div>
          <DialogTitle className="text-3xl font-black text-center uppercase italic tracking-tighter text-white">
            Get the Chaos Pass
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400 font-bold uppercase tracking-widest text-xs mt-2">
            Unlock the full rebellion experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-8">
          {perks.map((perk, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 group hover:bg-zinc-900 transition-colors">
              <perk.icon className={`w-6 h-6 ${perk.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-300">{perk.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-red-600/5 border border-red-600/20 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-red-500 italic">Limited Time Offer</span>
            <span className="text-lg font-black text-white italic">0.1 SOL</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">One-time payment for lifetime access to all future rebellion features and token multiplier.</p>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl font-black text-lg uppercase italic tracking-tighter shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => onOpenChange(false)}
          >
            MINT NOW
          </Button>
          <p className="text-[9px] text-center text-zinc-600 font-bold uppercase tracking-widest italic">
            Securely processed via Solana network
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
