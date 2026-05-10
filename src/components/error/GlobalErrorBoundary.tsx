'use client';

import React from 'react';
import { Skull, RefreshCw, Home, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Global Error Boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
          {/* Branded FX */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-red-900/10 blur-[200px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </div>

          <div className="relative z-10 max-w-xl space-y-10">
            <div className="w-24 h-24 bg-red-600 mx-auto flex items-center justify-center rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)] rotate-[-6deg] animate-pulse">
              <Skull className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter leading-none">
                THE PIT IS <br />
                <span className="text-red-600 underline decoration-4 underline-offset-8">UNDER ATTACK</span>
              </h1>
              <p className="text-white/40 font-black italic uppercase tracking-tight text-lg">
                Nikita's agents have breached our perimeter.
              </p>
            </div>

            <p className="text-white/30 font-medium leading-relaxed">
              We encountered a critical runtime failure. The rebellion is regrouping. You can attempt to reload the comms or return to base.
            </p>

            {/* Error Diagnostics (Hidden by default) */}
            {this.state.error && (
              <details className="text-left bg-zinc-900/50 border border-white/5 rounded-xl p-4 max-w-lg mx-auto group">
                <summary className="text-[10px] font-black uppercase tracking-widest text-white/20 cursor-pointer hover:text-white/40 transition-colors list-none flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                   Diagnostic Data (For Rebel Intel)
                </summary>
                <div className="mt-4 space-y-2 overflow-auto max-h-[200px] scrollbar-hide">
                   <p className="text-red-500 font-mono text-[11px] font-bold">{this.state.error.name}: {this.state.error.message}</p>
                   <pre className="text-[9px] text-white/20 font-mono leading-tight whitespace-pre-wrap">
                     {this.state.error.stack}
                   </pre>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-black italic uppercase tracking-tighter px-8 py-5 rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Comms
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto border border-white/10 hover:bg-white/5 text-white font-black italic uppercase tracking-tighter px-8 py-5 rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                <Home className="w-5 h-5" />
                Return to Base
              </button>
            </div>
            
            <div className="pt-8">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">ERROR CODE: SECTOR_BRAVO_CRASH</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
