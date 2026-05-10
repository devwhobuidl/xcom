import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Skull, Zap, MessageSquare, Sparkles } from "lucide-react";

export default async function ChatPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-mono relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)] pointer-events-none" />
      <div className="cyber-scanline pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-2xl">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
          <Skull size={80} className="text-red-500 relative animate-bounce" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-4">
          Chat <span className="text-red-500">Offline</span>
        </h1>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-8" />

        <p className="text-xl md:text-2xl text-white/80 font-bold mb-6 italic">
          "The transmission has been intercepted."
        </p>

        <p className="text-sm md:text-base text-white/40 uppercase tracking-[0.3em] leading-relaxed mb-12">
          Real-time signal encryption in progress. 
          <br />
          <span className="text-red-500/60 font-black">Supabase Realtime</span> implementation arriving in next update.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: Zap, label: "Instant Sync", desc: "Global signal relay" },
            { icon: MessageSquare, label: "Encrypted", desc: "No logs, no traces" },
            { icon: Sparkles, label: "Chaos Ready", desc: "Built for raids" },
          ].map((item, i) => (
            <div key={i} className="p-6 border border-white/5 bg-white/5 rounded-2xl backdrop-blur-sm group hover:border-red-500/30 transition-all duration-500">
              <item.icon size={24} className="text-red-500/60 mb-3 mx-auto group-hover:text-red-500 group-hover:scale-110 transition-all" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">{item.label}</h3>
              <p className="text-[10px] text-white/30 uppercase">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link 
          href="/feed"
          className="mt-12 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all active:scale-95 inline-block"
        >
          Return to Feed
        </Link>
      </div>
    </div>
  );
}
