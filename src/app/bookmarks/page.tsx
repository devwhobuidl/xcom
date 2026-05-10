export const dynamic = 'force-dynamic';
import React from "react";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  return (
    <div className="flex-1 min-h-screen">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
        <h1 className="text-xl font-bold text-white">Bookmarks</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Bookmark className="w-10 h-10 text-zinc-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Save posts for later</h2>
        <p className="text-zinc-500 max-w-sm">
          Don't let the good memes get lost in the pit. Bookmark them here to keep the fire alive.
        </p>
      </div>
    </div>
  );
}
