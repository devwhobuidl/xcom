"use client";

import { motion } from "framer-motion";
import { WalletButton } from "@/components/auth/WalletButton";
import { Skull, Zap, Shield, Globe } from "lucide-react";

export function RebellionHero() {
  return (
    <div className="relative overflow-hidden bg-black py-24 sm:py-32">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="cyber-scanline" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_70%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-primary ring-1 ring-primary/20 hover:ring-primary/40">
                THE REBELLION HAS BEGUN.{" "}
                <a href="#" className="font-semibold">
                  <span className="absolute inset-0" aria-hidden="true" />
                  READ THE MANIFESTO <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <h1 className="text-glow text-4xl font-bold tracking-tight text-white sm:text-6xl">
              XCOM REBELLION
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A decentralized social ecosystem built on the ruins of corporate greed. 
              Earn $XCOM, roast Nikita, and join the most chaotic community on Solana.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <WalletButton />
              <a href="#features" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "REBEL FEED", desc: "Uncensored social chaos", icon: Skull },
                { name: "AIRDROPS", desc: "Daily rewards for activity", icon: Zap },
                { name: "TREASURY", desc: "Community-owned assets", icon: Shield },
                { name: "GLOBAL", desc: "Resilient infrastructure", icon: Globe },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-red p-6 text-center"
                >
                  <feature.icon className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-white">{feature.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
