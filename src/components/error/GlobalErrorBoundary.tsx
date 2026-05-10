"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CLIENT_SIDE_CRASH:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center z-[9999] relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/30 animate-scanline opacity-50" />
          </div>

          <div className="relative z-10 max-w-md w-full space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <ShieldAlert className="w-24 h-24 text-primary animate-pulse" />
                <div className="absolute inset-0 blur-3xl bg-primary/40 animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
                The Pit is <span className="text-primary underline decoration-wavy underline-offset-8">Under Heavy Fire</span>
              </h1>
              <p className="text-white/60 font-mono text-sm leading-relaxed border-l-2 border-primary/50 pl-4 py-2 bg-primary/5">
                CRITICAL SYSTEM FAILURE: The rebellion has encountered a reality-warping glitch. Nikita might have sent a tactical nuke.
              </p>
              <div className="bg-zinc-900/80 p-3 rounded-lg border border-white/5 text-left">
                <p className="text-[10px] font-mono text-primary uppercase mb-1">Error Intel:</p>
                <p className="text-[10px] font-mono text-white/40 break-all leading-tight">
                  {this.state.error?.message || "Unknown anomaly detected"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black italic uppercase tracking-tighter py-8 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all active:scale-95 group"
              >
                <RefreshCw className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Reload The Rebellion
              </Button>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 animate-pulse">
                Standing by for extraction...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
