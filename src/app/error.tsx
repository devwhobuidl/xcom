"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GLOBAL_ERROR_BOUNDARY:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scanline opacity-30" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <ShieldAlert className="w-24 h-24 text-primary animate-pulse" />
            <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            The Pit is <span className="text-primary">Under Construction</span>
          </h1>
          <p className="text-white/40 font-medium leading-relaxed">
            Even a rebellion needs a reboot sometimes. The connection to the database was lost in the chaos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black italic uppercase tracking-tighter py-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/10 hover:bg-white/5 text-white/60 font-black italic uppercase tracking-tighter py-6 rounded-2xl transition-all"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="pt-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
            Error Digest: {error.digest || "REBEL-SYSTEM-FAILURE"}
          </p>
        </div>
      </div>
    </div>
  );
}
