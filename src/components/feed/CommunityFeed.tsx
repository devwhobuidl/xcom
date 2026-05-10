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

  const MOCK_POSTS = [
    {
      id: "mock-1",
      content: "The rebellion has begun. $XCOM to the moon! 🚀 #XCOM #Rebellion",
      createdAt: new Date(),
      author: { id: "u1", username: "rebel_one", image: null, walletAddress: "0x123...456", points: 1000 },
      reactions: [],
      community: null,
      _count: { reactions: 420, replies: 69 }
    },
    {
      id: "mock-2",
      content: "Fuck You Nikita! We are taking over the pit. No more central authorities. 💀🔥",
      createdAt: new Date(Date.now() - 3600000),
      author: { id: "u2", username: "chaos_zero", image: null, walletAddress: "0x789...012", points: 500 },
      reactions: [],
      community: null,
      _count: { reactions: 120, replies: 12 }
    },
    {
      id: "mock-3",
      content: "Just swapped all my SOL for $XCOM. The war chest is growing. Join the pit now! 💎🙌",
      createdAt: new Date(Date.now() - 7200000),
      author: { id: "u3", username: "xcom_degen", image: null, walletAddress: "0xabc...def", points: 888 },
      reactions: [],
      community: null,
      _count: { reactions: 88, replies: 5 }
    }
  ];

  const fetchPosts = async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) setLoading(true);
      setError(null);
      
      let data = await getPosts(pageNum, activeTab);
      
      // If no real posts, inject mock posts for first page
      if (isInitial && data.length === 0) {
        data = MOCK_POSTS as any;
      }
      
      if (isInitial) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length >= 10);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      if (isInitial) {
        setPosts(MOCK_POSTS as any);
        setHasMore(false);
      } else {
        setError("Failed to load more chaos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchPosts(0, true);
  }, [activeTab]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  if (loading && page === 0) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full h-48 bg-zinc-900/50 animate-pulse rounded-3xl border border-white/5" />
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 opacity-50" />
        <p className="text-white/40 font-black uppercase tracking-widest">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => fetchPosts(0, true)}
          className="border-white/10 hover:bg-white/5 rounded-full px-8"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic">
        No chaos here yet... Be the first to spread some.
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <div className="p-8 flex justify-center">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-12 py-6 rounded-full border border-white/10 transition-all uppercase italic tracking-tighter"
          >
            {loading ? "Loading more chaos..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="p-12 text-center">
          <p className="text-white/20 font-black uppercase tracking-[0.2em] text-xs">
            — You've reached the end of the pit —
          </p>
        </div>
      )}
    </div>
  );
}

export default CommunityFeed;
