export const dynamic = 'force-dynamic';
import React from "react";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function MessagesPage() {
  return (
    <div className="flex-1 min-h-screen">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
        <h1 className="text-xl font-bold">Chat</h1>
      </div>
      <ComingSoon 
        title="Chat is Coming Soon" 
        description="We're building the most chaotic rebel chat. Soon you'll be able to roast Nikita live with the squad."
        icon="chat"
      />
    </div>
  );
}
