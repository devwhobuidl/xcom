import React from "react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function GrokPage() {
  return (
    <div className="flex-1 min-h-screen">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
        <h1 className="text-xl font-bold">Dork</h1>
      </div>
      <ComingSoon 
        title="Dork is Coming Soon" 
        description="The AI that actually knows what the fuck is going on. Coming soon to help you navigate the chaos."
        icon="rocket"
      />
    </div>
  );
}
