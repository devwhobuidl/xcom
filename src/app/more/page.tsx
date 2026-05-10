export const dynamic = 'force-dynamic';
import React from "react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function MorePage() {
  return (
    <div className="flex-1 min-h-screen">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
        <h1 className="text-xl font-bold">More</h1>
      </div>
      <ComingSoon 
        title="More Chaos is Coming" 
        description="Settings, display options, and other boring corporate stuff—but we'll make it cool. Coming soon."
        icon="rocket"
      />
    </div>
  );
}
