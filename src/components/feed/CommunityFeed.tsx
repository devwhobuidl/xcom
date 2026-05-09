"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/app/actions/community";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, RefreshCw } from "lucide-react";

export function CommunityFeed({ activeTab = "for-you" }: { activeTab?: "for-you" | "following" | string }) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastElementRef, setLastElementRef] = useState<HTMLDivElement | null>(null);

  const fetchPosts = async (isNewTab = false) => {
    try {
      setLoading(true);
      const currentPage = isNewTab ? 0 : page;
      const data = await getPosts(currentPage, 10);
      
      if (isNewTab) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 10);
      setPage(prev => isNewTab ? 1 : prev + 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("FAILED_TO_FETCH");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [activeTab]);

  useEffect(() => {
    if (!lastElementRef || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(lastElementRef);
    return () => observer.disconnect();
  }, [lastElementRef, hasMore, loading]);

  if (error === "FAILED_TO_FETCH" && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <ShieldAlert className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase italic tracking-widest text-white">System Breach</h3>
          <p className="text-white/40 text-sm max-w-xs mx-auto font-medium">
            The database is currently unreachable. Nikita's goons might have cut the lines.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchPosts(true);
          }}
          className="rounded-full border-primary/20 hover:bg-primary/10 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="divide-y divide-white/10">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserId={session?.user?.id} 
            />
          ))}
        </AnimatePresence>

        {/* Sentinel for infinite scroll */}
        <div ref={setLastElementRef} className="h-10 w-full" />

        {loading && (
          <div className="divide-y divide-white/5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2 items-center">
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="h-4 w-16 bg-white/5 rounded" />
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-[80%] bg-white/5 rounded" />
                  <div className="flex justify-between max-w-[400px] pt-4">
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length > 0 && !hasMore && (
          <div className="p-12 text-center text-white/20 italic font-mono border-t border-white/5">
            You've reached the bottom of the pit. Nikita wins... for now.
          </div>
        )}

        {!loading && posts.length === 0 && !error && (
          <div className="p-20 text-center space-y-4">
             <div className="text-4xl">🕳️</div>
             <p className="text-white/40 font-black italic uppercase tracking-widest">The pit is empty...</p>
             <p className="text-white/20 text-sm">Be the first to post chaos.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityFeed;
