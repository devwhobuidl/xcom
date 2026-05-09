"use client";

import React, { useState, useEffect } from "react";
import { Skull } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RebellionHero = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show on mount for a short time
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1, times: [0, 0.7, 1] }}
              className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full"
            />

            <div className="text-center space-y-8 z-10 p-6">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <Skull className="w-40 h-40 text-primary mx-auto drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]" />
              </motion.div>

              <div className="space-y-2">
                <motion.h2 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-black nikita-glitch italic uppercase tracking-tighter text-primary"
                >
                  SYSTEM UNLOCKED
                </motion.h2>
                <motion.p 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-mono text-white max-w-2xl mx-auto"
                >
                  Welcome back to the rebellion, <span className="text-primary font-bold underline italic">you magnificent bastard</span> 💀
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-4 pt-4"
              >
                <div className="px-4 py-2 bg-primary/20 border border-primary/50 text-primary font-mono text-sm animate-pulse">
                  IDENTITY VERIFIED: REBEL #{(Math.random() * 9999).toFixed(0)}
                </div>
              </motion.div>
            </div>

            {/* Simulated Confetti (Particles) */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: "-10%",
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    y: "110%",
                    rotate: 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
