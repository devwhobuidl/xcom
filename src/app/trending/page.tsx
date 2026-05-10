export const dynamic = 'force-dynamic';
import { CommunityFeed } from "@/components/feed/CommunityFeed";
import { TrendingUp, Flame, MessageSquare } from "lucide-react";

export default function TrendingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 border-b border-white/10 bg-primary/5">
        <div className="flex items-center gap-3 text-primary mb-1">
          <Flame className="w-5 h-5 animate-pulse" />
          <h2 className="font-black uppercase italic tracking-tighter">Heat Level: MAXIMÜM</h2>
        </div>
        <p className="text-xs text-white/50 font-mono">Nikita's mentions are currently melting down.</p>
      </div>
      
      <div className="p-4 flex gap-2 overflow-x-auto border-b border-white/10 no-scrollbar">
        {["#FuckYouNikita", "#XCOM", "#Rebellion", "#TaxTheRich", "#FreeTheCode"].map((tag) => (
          <div key={tag} className="px-4 py-1.5 rounded-full bg-secondary/50 border border-white/5 text-sm font-bold whitespace-nowrap hover:bg-primary/20 cursor-pointer transition-colors">
            {tag}
          </div>
        ))}
      </div>

      <div className="flex-1">
        <CommunityFeed />
      </div>
    </div>
  );
}
