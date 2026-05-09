import React from "react";
import { Hammer, Lock, Skull, Construction } from "lucide-react";
import { motion } from "framer-motion";

interface ComingSoonProps {
  feature?: string;
  description?: string;
  eta?: string;
}

const ComingSoon = ({ 
  feature = "Classified Rebellion Intel", 
  description = "The code for this module is being forged in the pits of decentralization. Nikita is trying to patch it, but he will fail.",
  eta = "SOON™"
}: ComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl"
      >
        {/* Icon Cluster */}
        <div className="relative mb-8 flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="p-6 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl relative z-10"
          >
            <Hammer className="w-16 h-16 text-primary" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
            className="absolute -top-4 -right-4 p-3 bg-black border border-white/20 rounded-2xl shadow-2xl"
          >
            <Lock className="w-6 h-6 text-yellow-500" />
          </motion.div>

          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute -bottom-2 -left-6 p-3 bg-black border border-white/20 rounded-2xl shadow-2xl"
          >
            <Construction className="w-6 h-6 text-white/40" />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Status: Under Construction</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter nikita-glitch">
            {feature.toUpperCase()}
          </h1>
          
          <p className="text-white/40 font-medium text-lg leading-relaxed font-mono">
            {description}
          </p>

          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Estimated Arrival</div>
            <div className="text-2xl font-black italic text-white tracking-widest bg-white/[0.05] border border-white/10 px-8 py-3 rounded-2xl">
              {eta}
            </div>
          </div>
        </div>

        {/* Rebellion Branding */}
        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-center gap-6 grayscale opacity-20">
          <Skull className="w-8 h-8" />
          <span className="font-black italic text-xl tracking-tighter">XCOM REBELLION</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
