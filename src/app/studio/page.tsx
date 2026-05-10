export const dynamic = 'force-dynamic';
import React from "react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function StudioPage() {
  return (
    <div className="flex-1 min-h-screen">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
        <h1 className="text-xl font-bold">Creator Studio</h1>
      </div>
      <ComingSoon 
        title="Studio is Coming Soon" 
        description="Monetize your hate. The $XCOM creator studio will allow you to earn from your high-effort chaos."
        icon="skull"
      />
    </div>
  );
}
